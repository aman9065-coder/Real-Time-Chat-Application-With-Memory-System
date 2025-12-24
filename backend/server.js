require('dotenv').config();
const app= require('./src/app');
const connectDB = require('./src/db/db');
const initSocketServer = require('./src/sockets/socket.server');
const httpServer=require('http').createServer(app)

connectDB()
initSocketServer(httpServer);
// server start

httpServer.listen(3000,()=>{
    console.log('server is running on port 3000')
})