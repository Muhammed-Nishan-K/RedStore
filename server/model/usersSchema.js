const mongoose=require('mongoose')

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String
    },
    confirmpassword:{
        type:String
    },
    phone:{
        type:Number
    },
    block:{
        type:String
    },
    status:{
        type:String
    },
    varify:{
        type:String
    },
    address:{
        type:Array
    },
    walletdetails:{
        type:Array
    },
    wallet:{
        type:Number
    }
})
const Userdb = mongoose.model('userdb',schema);

module.exports = Userdb;