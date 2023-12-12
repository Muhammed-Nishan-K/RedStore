const mongoose=require('mongoose')

const couponSchema = new mongoose.Schema({
    couponcode:{
        type:String
    },
    discount:{
        type:Number
    },
    expdate:{
        type:String
    },
    status:{
        type:String
    }

})

const coupondb = mongoose.model('coupondb',couponSchema);



module.exports = coupondb;