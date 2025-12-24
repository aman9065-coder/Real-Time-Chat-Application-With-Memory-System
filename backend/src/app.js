const express=require('express')
const AuthRouter=require('../src/routes/auth.route')
const ChatRouter=require('./routes/chat.route')
const cookieParser=require('cookie-parser')
const cors = require("cors");

// server create
const app= express();

// middleware
app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use('/api/auth',AuthRouter)
app.use('/api/chat',ChatRouter)



module.exports=app