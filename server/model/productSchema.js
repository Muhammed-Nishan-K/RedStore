const mongoose=require('mongoose')

const productschema = new mongoose.Schema({
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
        type:Number
    },
    quantity:{
        type:Number
    },
    image:{
        type:Array
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
    reviews:{
        type:Array
    },
    rating:{
        type:Number
    }

})

const productdb = mongoose.model('productdb',productschema);



module.exports = productdb;
