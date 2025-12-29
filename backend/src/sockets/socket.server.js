const { Server } = require("socket.io");
const cookie=require('cookie')
const jwt=require('jsonwebtoken');
const userModel = require("../models/user.model");
const {generateResponse,generateVector} = require("../services/ai.service");
const messageModel = require("../models/message.model");
const {createMemory,queryMemory}= require('../services/vector.service');
const { text } = require("express");

 function initSocketServer(httpServer) {
//   const io = new Server(httpServer,{
//      cors:{
//   origin: "http://localhost:5173"

// } 
//     /* options */
//   });

  // middleware of socket

  const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

//  socket middleware for authentication aur make socket connection protected

  io.use(async(socket,next)=>{
    const cookies=cookie.parse(socket.handshake.headers?.cookie || "");

    if(!cookies.token){
      next(new Error("Authentication error: No token provided"));
    }
    try{
      const decoded=jwt.verify(cookies.token,process.env.JWT_SECRETE)
      const user= await userModel.findById(decoded.id)

      socket.user=user;
      next()

    }catch(err){
      next(new Error("Authentication error: Invaild token "))
    }


  })
 

  

  // events
  // io.on("connection", (socket) => {
  //   console.log("A user connected")
  //   // console.log(socket.user)
  //   // console.log(socket.id)
  //   socket.on("ai-message",async(message)=>{
  //     // console.log(message)
  //     const contentMessage = await messageModel.create({
  //       chat:message.chat_id,
  //       user:socket.user._id,
  //       content:message.content,
  //       role:'user'
  //     })

  //     const vectors= await generateVector(message.content)
  //     // query (vector data base se data laao for LTM)
  //     const memory=await queryMemory({
  //       queryVector:vectors,
  //       limits:3,
  //       metadata:{
  //         // konse se user ka vector points lana h 
  //         user:socket.user._id
  //       }
  //     })

  //     // console.log(memory)


  //     await createMemory({
  //       vectors:vectors,
  //       messageId:contentMessage._id,
  //       metadata:{
  //         chat:message.chat_id,
  //         user:socket.user._id,
  //         text:message.content
  //       }
  //     })
  //     // console.log(vectors)
  //     const chatHistory= (await messageModel.find({
  //       chat:message.chat_id

  //     }).sort({createdAt:-1}).limit(20).lean()).reverse()
  //     // console.log(chatHistory)

  //     const stm= chatHistory.map((obj)=>{
  //       return{
  //         role:obj.role,
  //         parts:[{text:obj.content}]
  //       }
  //     })
  //     // console.log(stm)

  //     const ltm=[
  //       {
  //         role:"user",
  //         parts:[{
  //           text:`
  //           these are some previous messages from the chat , use them to generate a response

  //           ${memory.map(obj=>obj.metadata.text).join('\n')}
  //           `
  //         }]
  //       }
  //     ]
  //     const response=await generateResponse([...ltm , ...stm])

  //     const responseMessage = await messageModel.create({
  //       chat:message.chat_id,
  //       user:socket.user._id,
  //       content:response,
  //       role:'model'
  //     })

  //     const responseVectors=await generateVector(response)

  //     await createMemory({
  //       vectors:responseVectors,
  //       messageId:responseMessage._id,
  //       metadata:{
  //         chat:message.chat_id,
  //         user:socket.user._id,
  //         text:response
  //       }
  //     })

    

      
  //     socket.emit("ai-response",{
  //       response:response,
      
  //       chat_id:message.chat_id


  //     })

  //   })

  // });

  // gpt

  io.on("connection", (socket) => {
  console.log("User connected:", socket.user._id);


  socket.on("join-chat", ({ chatId }) => {
  socket.join(chatId);
});

socket.on("leave-chat", ({ chatId }) => {
  socket.leave(chatId);
});


  socket.on("ai-message", async (message) => {

    // USER MESSAGE SAVE
    const question = await messageModel.create({
      chat: message.chat_id,
      user: socket.user._id,
      content: message.content,
      role: "user"
    });

    // STM
    const chatHistory = (await messageModel.find({
      chat: message.chat_id
    }).sort({ createdAt: -1 }).limit(20).lean()).reverse();

    const stm = chatHistory.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    // LTM
    const vectors = await generateVector(message.content);

    // create memory in vector DB (pinepone)

    await createMemory({
        vectors:vectors,
        messageId:question._id,
        metadata:{
          chat:message.chat_id,
          user:socket.user._id,
          text:message.content
        }
      })

      // query of vector memory
    const memory = await queryMemory({
      queryVector: vectors,
      limits: 3,
      metadata: { user: socket.user._id }
    });

    const ltm = [{
      role: "user",
      parts: [{
        text: memory.map(m => m.metadata.text).join("\n")
      }]
    }];

    const response = await generateResponse([...ltm, ...stm]);

    // SAVE AI RESPONSE
    const responseMessage = await messageModel.create({
        chat:message.chat_id,
        user:socket.user._id,
        content:response,
        role:'model'
      })
    // await messageModel.create({
    //   chat: message.chat_id,
    //   user: socket.user._id,
    //   content: response,
    //   role: "model"
    // });

//     1️⃣ Bina room ke message kaise hota hai?
// (A) Sabko message bhejna (broadcast)
// io.emit("ai-response", data);


// 📌 Result:

// Saare connected users ko message mil jayega
// ❌ Chat app ke liye galat (privacy issue)

// (B) Sirf ek user ko (socket id se)
// io.to(socketId).emit("ai-response", data);


// 📌 Result:

// Sirf ek socket ko message milega
// ✔️ One-to-one possible
// ❌ Multiple tabs / devices ka issue

// 2️⃣ Room-based message kyu best hai? 🏆
// socket.join(chat_id);
// io.to(chat_id).emit(...)

// Fayde 👇

// ✔️ Multiple users ek chat me
// ✔️ Same user ke multiple tabs sync
// ✔️ Group chat easy
// ✔️ Clean architecture
// ✔️ Secure (sirf joined users)

    // EMIT TO ROOM 

    io.to(message.chat_id).emit("ai-response", {
      role: "model",
      content: response,
      chat_id: message.chat_id
    });

    // LTM

    const responseVectors=await generateVector(response)

      await createMemory({
        vectors:responseVectors,
        messageId:responseMessage._id,
        metadata:{
          chat:message.chat_id,
          user:socket.user._id,
          text:response
        }
      })


  });
});
}



module.exports=initSocketServer;



