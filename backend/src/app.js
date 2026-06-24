const express=require('express')
const AuthRouter=require('../src/routes/auth.route')
const ChatRouter=require('./routes/chat.route')
const cookieParser=require('cookie-parser')
const cors = require("cors");
const path = require('path');

// server create
const app= express();

// middleware
app.use(express.json())
app.use(cookieParser())

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));

// deploy

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use('/api/auth',AuthRouter)
app.use('/api/chat',ChatRouter)

/* static files (if any frontend build served from backend) */
// app.use(express.static(path.join(__dirname, "../public")));


// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/index.html'));
// });



module.exports=app

