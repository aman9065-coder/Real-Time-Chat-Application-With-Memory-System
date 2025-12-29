const express=require('express')
const authUser = require('../middlewares/auth.middleware')
const { createChat, getChat } = require('../controllers/chat.controller')
const messageModel = require('../models/message.model')
const Chatmodel = require('../models/chat.model')

const router= express.Router()

// api
router.post('/',authUser,createChat)

router.get('/',authUser,getChat)

router.delete('/:id', authUser, async (req, res) => {
  // delegate to controller's deleteChat for consistency
  const { deleteChat } = require('../controllers/chat.controller');
  return deleteChat(req, res);
});

// GET /api/chat/:chatId - return chat details (title, lastActivity)
router.get("/:chatId", authUser, async (req, res) => {
  try {
    const chat = await Chatmodel.findOne({
      _id: req.params.chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    return res.status(200).json({
      _id: chat._id,
      title: chat.title,
      lastActivity: chat.lastActivity,
      user: chat.user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

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