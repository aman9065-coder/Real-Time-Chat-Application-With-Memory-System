const express= require('express');
const {registerUser,loginUser,logoutUser, meUser} = require('../controllers/auth.controller');
const authUser = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/logout', logoutUser)
router.get('/me', authUser, meUser)

module.exports=router; 