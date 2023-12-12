const mongoose=require('mongoose')

const catschema = new mongoose.Schema({
    
    catname:{
        type:String,
        unique:true
    },
    deleted:{
        type:Boolean,
    }
}
)
const catdb = mongoose.model('catdb',catschema);

module.exports = catdb;