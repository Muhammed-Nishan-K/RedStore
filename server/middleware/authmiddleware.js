const express=require("express");


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
