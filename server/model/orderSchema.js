const mongoose=require('mongoose')

const orderschema = new mongoose.Schema({
    productName:{
        type:Array,
    },
    category:{
        type:String,
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
    },
    quantity:{
        type:Number,
    },
    image:{
        type:Array
    },
    email:{
        type:String
    },
    deleted:{
        type:Boolean
    },
    catstatus:{
        type:Boolean
    },
    discount:{
        type:Number
    },
    date:{
        type:String
    },
    time:{
        type:String
    },
    address:{
        type:Array
    },
    status:{
        type:String,
        default:'pending'
    },
    payment:{
        type:String
    },
    day:{
        type:Number
    },
    month:{
        type:Number
    },
    year:{
        type:Number
    }


})

const orderdb = mongoose.model('orderdb',orderschema);



module.exports = orderdb;
