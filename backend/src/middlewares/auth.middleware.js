const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

async function authUser(req,res,next){
    const {token}=req.cookies;

    if(!token){
        return res.status(400).json({
            message:"token empty login first"
        })
        
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRETE)
        const user=await userModel.findById(decoded.id)
        req.user=user;
        next()


    }
    catch(err){
        res.json({
            message:"wrong token",
            err
        })
    }

    
    
}

module.exports=authUser