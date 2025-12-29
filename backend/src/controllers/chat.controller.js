const Chatmodel = require("../models/chat.model");
const messageModel = require('../models/message.model');

async function createChat(req,res){
    const {title}=req.body;
    const user=req.user;
    const chat= await Chatmodel.create({
        user:user._id,
        title
    });

    res.status(201).json({
        message:"chat created successfully",
        chat:{
            _id:chat._id,
            title:chat.title,
            lastActivity:chat.lastActivity,
            user:chat.user


        }
    });

}

async function getChat(req,res){
    const user=req.user;
    console.log(user)
    const chat =await Chatmodel.find({
        user:user._id
    })
    // console.log(chat)
    res.status(200).json({
        user:user._id,
        chat:chat
    })
}

async function deleteChat(req, res) {
  const user = req.user;
  const chatId = req.params.id;

  const chat = await Chatmodel.findOne({ _id: chatId, user: user._id });
  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  // remove messages belonging to this chat
  await messageModel.deleteMany({ chat: chat._id });

  // remove the chat
  await Chatmodel.deleteOne({ _id: chat._id });

  return res.status(200).json({ message: 'Chat deleted' });
}

module.exports={
    createChat,getChat, deleteChat
};