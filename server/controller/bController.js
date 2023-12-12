
const session = require('express-session');
const blockdb = require('../model/blockSchema');
const userdb = require('../model/usersSchema');

exports.create = (req, res) => {

    const nemail=req.query.email;
    console.log(nemail);
    blockdb.create({email:nemail})
    
    .then(user=>{
        
        userdb.updateOne({email:nemail},{$set:{block:"true"}}).then(()=>{
            res.redirect("/admin-users");
        })
            
    }).catch((err)=>{
        blockdb.deleteOne({email:nemail}).then((user)=>{
            userdb.updateOne({email:nemail},{$set:{block:"false"}}).then((data)=>{
                res.redirect("/admin-users")
            })
            
        }).catch((err)=>{
    
            res.send(err);
        })
    })
    
    



}
