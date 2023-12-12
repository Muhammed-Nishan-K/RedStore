const mongoose=require('mongoose')

const otpschema = new mongoose.Schema({
    
    email:String,
    otp:String,
    createAt:Date,
    expireAt:Date
}
)
const otpdb = mongoose.model('otpdb',otpschema);

module.exports = otpdb;