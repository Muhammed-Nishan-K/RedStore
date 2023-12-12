const mongoose=require('mongoose')

const loggedschema = new mongoose.Schema({
    
    email:{
        type:String,
        unique:true
    }
}
)
const loggdb = mongoose.model('loggdb',loggedschema);

module.exports = loggdb;