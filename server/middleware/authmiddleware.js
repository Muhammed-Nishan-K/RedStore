const express=require("express");
const Userdb = require("../model/usersSchema");


exports.userauthMiddleware = (req, res, next) => {
    if (req.session.varify==true) {
      console.log('a');

        return next();
      
    }else{
      console.log('b');
      res.redirect('/login');
    }
    
  };
exports.adminauthMiddleware = (req, res, next) => {
    if (req.session.adisauth==true) {
      return next();
    }
    res.redirect('/');
  }
exports.orderauth=(req,res,next)=>{
  if(req.session.order==true){
    return next();
  }
  res.redirect('/');
}
exports.noaddress=(req,res,next)=>{
  const email=req.session.email;
  Userdb.findOne({email:email}).then((data)=>{
    if(data.address.length==0){
      res.redirect('/address')
    }else{
      return next()
    }
  })
}
