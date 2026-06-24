// ============================
// IMPORTS
// ============================

const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");

const { generateResponse, generateVector } = require("../services/ai.service");

const { createMemory, queryMemory } = require("../services/vector.service");

// ========================================================
// SOCKET SERVER INITIALIZATION
// ========================================================


function initSocketServer(httpServer) {
  // const io = new Server(httpServer, {
  //   cors: {
  //     origin: "http://localhost:5173",
  //     credentials: true,
  //   },
  // });

  const io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        }
    });


  // ========================================================
  // SOCKET AUTHENTICATION MIDDLEWARE
  // ========================================================
  // Har socket connection protected rahega.
  // User ke cookies se token niklega aur verify hoga.

  io.use(async (socket, next) => {
    // Cookie parse
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    // Token exist nahi karta
    if (!cookies.token) {
      return next(new Error("Authentication Error : No token provided"));
    }

    try {
      // JWT verify
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRETE);

      // User database se nikalna
      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(new Error("Authentication Error : User not found"));
      }

      // User socket object me attach kar diya
      socket.user = user;

      next();
    } catch (err) {
      next(new Error("Authentication Error : Invalid Token"));
    }
  });

  // ========================================================
  // CONNECTION EVENT
  // ========================================================

  io.on("connection", (socket) => {
    console.log("User connected :", socket.user._id);

    // ========================================================
    // JOIN ROOM
    // ========================================================

    socket.on("join-chat", ({ chatId }) => {
      socket.join(chatId);

      console.log(`${socket.user._id} joined room ${chatId}`);
    });

    // ========================================================
    // LEAVE ROOM
    // ========================================================

    socket.on("leave-chat", ({ chatId }) => {
      socket.leave(chatId);

      console.log(`${socket.user._id} left room ${chatId}`);
    });

    // ========================================================
    // AI MESSAGE EVENT
    // ========================================================

    socket.on("ai-message", async (message) => {
      try {
        // ====================================================
        // 1. USER MESSAGE SAVE
        // ====================================================

        const question = await messageModel.create({
          chat: message.chat_id,
          user: socket.user._id,
          content: message.content,
          role: "user",
        });

        // ====================================================
        // 2. STM (Short Term Memory)
        // Last 20 messages nikalo
        // ====================================================

        const chatHistory = (
          await messageModel
            .find({
              chat: message.chat_id,
            })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean()
        ).reverse();

        // Gemini format me convert
        const stm = chatHistory.map((msg) => ({
          role: msg.role,
          parts: [
            {
              text: msg.content,
            },
          ],
        }));

        // ====================================================
        // 3. CURRENT MESSAGE VECTOR GENERATE
        // ====================================================

    

      

        // 1. Vector generate
        const vectors = await generateVector(message.content);

        // 2. Pinecone me save karo
        await createMemory({
          vectors,
          messageId: question._id,
          metadata: {
            chat: message.chat_id.toString(),
            user: socket.user._id.toString(),
            text: message.content,
          },
        });

        // 3. Similar memories retrieve karo
        const memory = await queryMemory({
          queryVector: vectors,
          limit: 5,
          metadata: {
            user: socket.user._id.toString(),
          },
        });

        // ====================================================
        // 5. LTM (Long Term Memory)
        // ====================================================

        const ltm = [
          {
            role: "user",
            parts: [
              {
                text: memory.map((m) => m.metadata.text).join("\n"),
              },
            ],
          },
        ];
        console.log(ltm.parts);

        // ====================================================
        // 6. AI RESPONSE GENERATE
        // LTM + STM dono bhej rahe hain
        // ====================================================

        const response = await generateResponse([...ltm, ...stm]);

        // ====================================================
        // 7. AI RESPONSE SAVE
        // ====================================================

        const responseMessage = await messageModel.create({
          chat: message.chat_id,
          user: socket.user._id,
          content: response,
          role: "model",
        });

        // ====================================================
        // 8. ROOM ME MESSAGE EMIT
        // ====================================================
        // Sirf us room ke users ko response milega

        io.to(message.chat_id).emit("ai-response", {
          role: "model",
          content: response,
          chat_id: message.chat_id,
        });

        // ====================================================
        // 9. AI RESPONSE VECTOR GENERATE
        // ====================================================

        const responseVectors = await generateVector(response);

        // ====================================================
        // 10. AI RESPONSE KO LTM ME STORE KARNA
        // ====================================================

        await createMemory({
          vectors: responseVectors,
          messageId: responseMessage._id,
          metadata: {
            chat: message.chat_id.toString(),
            user: socket.user._id.toString(),
            text: response,
          },
        });
      } catch (err) {
        console.error(err);

        socket.emit("error", {
          message: "Something went wrong",
        });
      }
    });

    // ========================================================
    // DISCONNECT EVENT
    // ========================================================

    socket.on("disconnect", () => {
      console.log("User disconnected :", socket.user._id);
    });
  });
}

module.exports = initSocketServer;

// .......2

// const { Server } = require("socket.io");
// const cookie = require("cookie");
// const jwt = require("jsonwebtoken");
// const userModel = require("../models/user.model");
// const { generateResponse, generateVector } = require("../services/ai.service");
// const messageModel = require("../models/message.model");
// const { createMemory, queryMemory } = require("../services/vector.service");
// const { text } = require("express");

// function initSocketServer(httpServer) {
//   const io = new Server(httpServer, {
//     cors: {
//       origin: "http://localhost:5173",
//       credentials: true,
//     },
//   });

//   //  socket middleware for authentication aur make socket connection protected

//   io.use(async (socket, next) => {
//     const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

//     if (!cookies.token) {
//       next(new Error("Authentication error: No token provided"));
//     }
//     try {
//       const decoded = jwt.verify(cookies.token, process.env.JWT_SECRETE);
//       const user = await userModel.findById(decoded.id);

//       socket.user = user;
//       next();
//     } catch (err) {
//       next(new Error("Authentication error: Invaild token "));
//     }
//   });

//   // events

//   // gpt

//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.user._id);

//     socket.on("join-chat", ({ chatId }) => {
//       socket.join(chatId);
//     });

//     socket.on("leave-chat", ({ chatId }) => {
//       socket.leave(chatId);
//     });

//     socket.on("ai-message", async (message) => {
//       // USER MESSAGE SAVE
//       const question = await messageModel.create({
//         chat: message.chat_id,
//         user: socket.user._id,
//         content: message.content,
//         role: "user",
//       });

//       // STM
//       const chatHistory = (
//         await messageModel
//           .find({
//             chat: message.chat_id,
//           })
//           .sort({ createdAt: -1 })
//           .limit(20)
//           .lean()
//       ).reverse();

//       const stm = chatHistory.map((m) => ({
//         role: m.role,
//         parts: [{ text: m.content }],
//       }));

//       // LTM
//       const vectors = await generateVector(message.content);

//       // create memory in vector DB (pinepone)

//       await createMemory({
//         vectors: vectors,
//         messageId: question._id,
//         metadata: {
//           chat: message.chat_id,
//           user: socket.user._id,
//           text: message.content,
//         },
//       });

//       // query of vector memory
//       const memory = await queryMemory({
//         queryVector: vectors,
//         limits: 3,
//         metadata: { user: socket.user._id },
//       });

//       const ltm = [
//         {
//           role: "user",
//           parts: [
//             {
//               text: memory.map((m) => m.metadata.text).join("\n"),
//             },
//           ],
//         },
//       ];

//       const response = await generateResponse([...ltm, ...stm]);

//       // SAVE AI RESPONSE
//       const responseMessage = await messageModel.create({
//         chat: message.chat_id,
//         user: socket.user._id,
//         content: response,
//         role: "model",
//       });
//       // await messageModel.create({
//       //   chat: message.chat_id,
//       //   user: socket.user._id,
//       //   content: response,
//       //   role: "model"
//       // });

//       //     1️⃣ Bina room ke message kaise hota hai?
//       // (A) Sabko message bhejna (broadcast)
//       // io.emit("ai-response", data);

//       // 📌 Result:

//       // Saare connected users ko message mil jayega
//       // ❌ Chat app ke liye galat (privacy issue)

//       // (B) Sirf ek user ko (socket id se)
//       // io.to(socketId).emit("ai-response", data);

//       // 📌 Result:

//       // Sirf ek socket ko message milega
//       // ✔️ One-to-one possible
//       // ❌ Multiple tabs / devices ka issue

//       // 2️⃣ Room-based message kyu best hai? 🏆
//       // socket.join(chat_id);
//       // io.to(chat_id).emit(...)

//       // Fayde 👇

//       // ✔️ Multiple users ek chat me
//       // ✔️ Same user ke multiple tabs sync
//       // ✔️ Group chat easy
//       // ✔️ Clean architecture
//       // ✔️ Secure (sirf joined users)

//       // EMIT TO ROOM

//       io.to(message.chat_id).emit("ai-response", {
//         role: "model",
//         content: response,
//         chat_id: message.chat_id,
//       });

//       // LTM

//       const responseVectors = await generateVector(response);

//       await createMemory({
//         vectors: responseVectors,
//         messageId: responseMessage._id,
//         metadata: {
//           chat: message.chat_id,
//           user: socket.user._id,
//           text: response,
//         },
//       });
//     });
//   });
// }

// module.exports = initSocketServer;

// socket.on("ai-message", async (message) => {
//   // ==============================
//   // 1. USER MESSAGE SAVE + VECTOR GENERATE (Parallel)
//   // ==============================

//   // Dono operations ek dusre par depend nahi karte
//   // Isliye Promise.all() se parallel chalayenge
//   const [question, vectors] = await Promise.all([
//     messageModel.create({
//       chat: message.chat_id,
//       user: socket.user._id,
//       content: message.content,
//       role: "user",
//     }),

//     generateVector(message.content),
//   ]);

//   // ==============================
//   // 2. SHORT TERM MEMORY (Last 20 Messages)
//   // ==============================

//   const chatHistory = (
//     await messageModel
//       .find({
//         chat: message.chat_id,
//       })
//       .sort({ createdAt: -1 })
//       .limit(20)
//       .lean()
//   ).reverse();

//   // Gemini ke format me convert kar rahe hain
//   const stm = chatHistory.map((m) => ({
//     role: m.role,
//     parts: [
//       {
//         text: m.content,
//       },
//     ],
//   }));

//   // ==============================
//   // 3. LONG TERM MEMORY
//   // ==============================

//   // Current message ko vector DB me save karna
//   // aur similar memories fetch karna
//   // Dono parallel me ho sakte hain

//   const [, memory] = await Promise.all([
//     createMemory({
//       vectors,
//       messageId: question._id,
//       metadata: {
//         chat: message.chat_id,
//         user: socket.user._id,
//         text: message.content,
//       },
//     }),

//     queryMemory({
//       queryVector: vectors,
//       limits: 3,
//       metadata: {
//         user: socket.user._id,
//       },
//     }),
//   ]);

//   // ==============================
//   // 4. Gemini ke liye LTM format banana
//   // ==============================

//   const ltm = [
//     {
//       role: "user",
//       parts: [
//         {
//           text: memory
//             .map((m) => m.metadata.text)
//             .join("\n"),
//         },
//       ],
//     },
//   ];

//   // ==============================
//   // 5. AI RESPONSE GENERATE
//   // ==============================

//   // Pehle LTM
//   // Fir STM
//   // Fir current question ka context

//   const response = await generateResponse([
//     ...ltm,
//     ...stm,
//   ]);

//   // ==============================
//   // 6. AI RESPONSE SAVE + VECTOR GENERATE (Parallel)
//   // ==============================

//   const [responseMessage, responseVectors] = await Promise.all([
//     messageModel.create({
//       chat: message.chat_id,
//       user: socket.user._id,
//       content: response,
//       role: "model",
//     }),

//     generateVector(response),
//   ]);

//   // ==============================
//   // 7. ROOM ME RESPONSE BHEJNA
//   // ==============================

//   io.to(message.chat_id).emit("ai-response", {
//     role: "model",
//     content: response,
//     chat_id: message.chat_id,
//   });

//   // ==============================
//   // 8. AI RESPONSE KO VECTOR DB ME SAVE KARNA
//   // ==============================

//   await createMemory({
//     vectors: responseVectors,
//     messageId: responseMessage._id,
//     metadata: {
//       chat: message.chat_id,
//       user: socket.user._id,
//       text: response,
//     },
//   });
// });


