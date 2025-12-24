const mongoose=require('mongoose')

// schema

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        }
    },
    password:{
        type:String,
    }

},
{
    timestamps:true
})

// timestamps -> DB maintain krta h data kb create hua and kb update hua

// model

const userModel = mongoose.model('user',userSchema)

module.exports=userModel