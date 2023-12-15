
bcrypt=require('bcrypt')
const otpdb = require('../model/otpschema')
const nodemailer=require('nodemailer')

const path=require("path")
const userdb=require("../model/usersSchema")
const dotenv=require("dotenv")
dotenv.config({path:"config.env"})


console.log(process.env.APP_PASSWORD+" Passowrd");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {    
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.APP_PASSWORD,
},
  
  });

exports.sendOtp=async(email,res)=>{
    try{
        const otp=`${Math.floor(1000+Math.random()*9000)}`
        const mailoption={
            from:process.env.EMAIL_ADDRESS,
            to:email,
            subject:"verify your Email",
            html:`<p>The code of your Email to varify is <b>${otp}<br>The otp will expire in 5 minute</p>`
        }
        const saltRounds=10;
        const hashedOTP=bcrypt.hash(otp,saltRounds);

        const newVarification=new otpdb({
            email: email,
            otp: otp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        })
        await newVarification.save()
        await transporter.sendMail(mailoption,(err)=>{
            if(err){
                console.log(err+" send email error");
            }else{
                console.log("Otp send successfully");
            }
        })
       
    }
    catch(err){
            console.log(err);

    }
}

exports.compare=(req,res)=>{
    const a=req.query.a;
    const b=req.query.b;
    const c=req.query.c;
    const d=req.query.d;
    let sum=a+b+c+d;
    const email=req.session.forgetemail;

    otpdb.find({email:email}).then((data)=>{

        if(data){
            if(sum==data[0].otp){
                userdb.updateOne({email:data[0].email},{$set:{varify:"true"}}).then().catch((err)=>{
                    res.redirect('/err')
                })
            res.redirect("/")
            otpdb.deleteOne({email:email}).then().catch((data)=>{
                res.redirect('/err')
            })
            }
            else{
                
            }
            
            
        }
        else{
           res.redirect('/err')
        }
    })
}
exports.forgetcompare=(req,res)=>{
    const a=req.body.a;
    const b=req.body.b;
    const c=req.body.c;
    const d=req.body.d;
    let sum=a+b+c+d;

    const email=req.session.forgetemail;


    otpdb.find({email:email}).then((data)=>{
        if(data){
            if(sum==data[0].otp){
                
            res.render('newpassword',{email:email})
            otpdb.deleteOne({email:email}).then()
            }
            else{
                res.render('forgetvarifyotp',{email:email,id:id,status:true})
            }
            
            
        }
        else{
            res.render('sendotp',{email:email,status:true})
        }
    }).catch(()=>{
        res.render('errorpage');
    })
}