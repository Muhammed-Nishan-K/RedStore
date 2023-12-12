const mongoose=require('mongoose')

const wishschema = new mongoose.Schema({
    productName:{
        type:String,
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
    }

})

const wishdb = mongoose.model('wishdb1',wishschema);



module.exports = wishdb;