const mongoose=require('mongoose')

const bannerSchema = new mongoose.Schema({
    image:{
        type:String,
        unique:true
    }

})

const bannerdb = mongoose.model('bannerdb',bannerSchema);



module.exports = bannerdb;