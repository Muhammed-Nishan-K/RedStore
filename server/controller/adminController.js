const Userdb = require('../model/usersSchema');

exports.find = (req, res) => {

    
        Userdb.find()
        .then(user=>{
            console.log(user,"this is data");
            res.send(user)
        })
        .catch(err=>{
            res.status(500).send({message:err.message||"Error occured while retrieving User info"})
        })


  
}
exports.finduser = (req, res) => {

    
    Userdb.find({email:req.query.email})
    .then(user=>{
        res.send(user)
    })
    .catch(err=>{
        res.status(500).send({message:err.message||"Error occured while retrieving User info"})
    })
}
exports.logout=(req,res)=>{
    Userdb.updateOne({email:req.query.email},{$set:{status:"inActive"}}).then((data)=>{
        req.session.email=''
        res.redirect("/")
    })
}
exports.findusers = (req, res) => {

    
    Userdb.find({email:req.query.email})
    .then(user=>{
        res.send(user)
    })
    .catch(err=>{
        res.status(500).send({message:err.message||"Error occured while retrieving User info"})
    })
}

exports.countuser=(req,res)=>{
    Userdb.find({}).then((data)=>{
        res.send(data);
    })
}