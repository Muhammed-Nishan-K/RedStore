const mongoose=require('mongoose')

const blockschema = new mongoose.Schema({
    
    email:{
        type:String,
        unique:true

    }
}
)
const blockdb = mongoose.model('blockdb',blockschema);

module.exports = blockdb;