const Chatmodel = require("../models/chat.model");

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
module.exports={
    createChat,getChat
};