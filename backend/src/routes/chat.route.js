const express=require('express')
const authUser = require('../middlewares/auth.middleware')
const { createChat, getChat } = require('../controllers/chat.controller')
const messageModel = require('../models/message.model')
const Chatmodel = require('../models/chat.model')

const router= express.Router()

// api
router.post('/',authUser,createChat)

router.get('/',authUser,getChat)

// GET /api/chat/:chatId/messages
router.get("/:chatId/messages", authUser, async (req, res) => {
  // const messages = await messageModel
  //   .find({ chat: req.params.chatId })
  //   .sort({ createdAt: 1 });

  // res.json(messages);

  const chat = await Chatmodel.findOne({
  _id: req.params.chatId,
  user: req.user._id
});

if (!chat) {
  return res.status(403).json({ message: "Access denied" });
}

const messages = await messageModel
  .find({ chat: chat._id })
  .sort({ createdAt: 1 });

res.json(messages);

});


module.exports=router