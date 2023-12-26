const mongoose=require('mongoose')

const offerSchema = new mongoose.Schema({
    category:{
        type:String
    },
    discount:{
        type:Number
    },
    expdate:{
        type:String
    },
    min:{
        type:Number
    },
    status:{
        type:String
    }

})

const offerdb = mongoose.model('offerdb',offerSchema);



module.exports = offerdb;