const axios=require('axios')
const productdb=require("../model/productSchema")
const session = require('express-session')
const Userdb = require('../model/usersSchema');
const otpcontroller=require("../controller/otpcontroller");
const otpdb = require('../model/otpschema');
const catdb = require('../model/categorySchema');
const wishdb = require('../model/wishlistschema');
const orderdb = require('../model/orderSchema');
const bannerdb = require("../model/bannerSchema");
const Razorpay = require('razorpay');
require('dotenv').config();




exports.userHome = (req,res)=>{
 axios.get(`http://localhost:3001/api/showproductuser`)
  .then(function(response){
    const a=response.data
    catdb.find({}).then((data1)=>{
        const category=data1;
        Userdb.find({email:req.session.email}).then((data)=>{
            bannerdb.find({}).then((banner)=>{
                if(data.length==0){
                    req.session.varify=false
                    res.render('userHome',{product:a,varify:false,category:category,searchQuery:'',banner:banner})
                    
                }else{
                    if(data[0].varify=="true"){
                        req.session.varify=true
                        res.render('userHome',{product:a,varify:true,category:category,searchQuery:'',banner:banner})
                        
                    }
                    else{
                        req.session.varify=true
                        res.render('userHome',{product:a,varify:false,category:category,searchQuery:'',banner:banner})
                        
                    }
                    
                }
            })
            
            
        })
    })
    
    
 })
 .catch(err=>{
     res.send(err);
 })
    
}
exports.address=(req,res)=>{
    res.render('address',{id:req.query.id})
}
exports.login=(req,res)=>{
    const isauth=req.session.isauth;
    const blocked=req.query.blocked;
    const nouser=req.query.nouser;
    
    axios.get(`http://localhost:3001/api/user?email=${req.session.email}`)
  .then(function(response){
    console.log(response.data);
     res.render('userlogin.ejs',{status:isauth,user:response.data,blocked:blocked,nouser:nouser})
  })
  .catch(err=>{
      res.send(err);
  })
    // console.log("last");
    // console.log(req.query.user)
    // res.render('userlogin',{status:req.query.status,user:req.query.user})
}

exports.register=(req,res)=>{
    res.render('userRegister')
} 



exports.productdetalis=(req,res)=>{
    const id=req.query.productId
    console.log(id);
    productdb.findOne({_id:id})
    
    .then(data=>{
        const data1=data
        Userdb.find({email:req.session.email}).then((data)=>{
            console.log(data.length);
            if(data.length==0){
                res.render("singleproduct",{product:data1,varify:false})
            }else{
                if(data[0].varify=="true"){
                    res.render("singleproduct",{product:data1,varify:true})
                }
                else{
                    res.render("singleproduct",{product:data1,varify:false})
                }
                
            }
            
        })
        // if(varify=="true"){
        //     res.render("singleproduct",{product:data,varify:true})
        // }else{
        //     res.render("singleproduct",{product:data,varify:false})
        // }
        
    })
    
}
exports.logout=(req,res)=>{
    req.session.isauth=false;
    axios.get(`http://localhost:3001/api/logout?email=${req.query.email}`).then()
    req.session.email='';
    res.redirect("/");
    
}
exports.cartshow=(req,res)=>{
    axios.get(`http://localhost:3001/api/cartshow?email=${req.session.email}`)
  .then(function(response){
    const a=response.data
    catdb.find({deleted:true}).then((data)=>{
    let sum=0;
    let discount=0;

    for(let i=0;i<a.length;i++){
        let b=parseInt(a[i].price)
        let c=a[i].quantity
        let d=a[i].discount
        sum=sum+(b*c);
        discount=discount+(d*c)
    }
    
     res.render('cartpage',{cart:a,sum:sum,discount:discount})
    })
    
    
    
    
  })
  .catch(err=>{
      res.send(err);
  })
}
exports.listshow=(req,res)=>{
    axios.get(`http://localhost:3001/api/listshow?email=${req.session.email}`)
  .then(function(response){
    const a=response.data
    wishdb.find({deleted:true}).then((data)=>{
        console.log(data+"this is a data");
    let sum=0;
    for(let i=0;i<a.length;i++){
        let b=parseInt(a[i].price)
        sum=sum+b;
    }
    
    
     res.render('wishlist',{cart:a,sum:sum})
    })
    
    
    
    
  })
  .catch(err=>{
      console.log(err);
  })
}
exports.otp=(req,res)=>{
    const email=req.query.email;
    const id=req.query.id;
    
    res.render('otp',{email:email,id:id})

}
exports.sendotp=(req,res)=>{
    const id=req.query.id
    const email=req.query.email;
    otpcontroller.sendOtp(id,email,res)
    res.render('sendotp',{email:email,id:id})

}
exports.forgetsendotp=(req,res)=>{
    const email=req.query.email;
    Userdb.find({email:email}).then((data)=>{
        const email=data[0].email;
        const id=data[0]._id
        otpcontroller.sendOtp(id,email,res)
        res.render('forgetvarifyotp',{email:email,id:id,status:false})
    })
    
    

}
exports.resendotp=(req,res)=>{
    const id=req.query.id;
    const email=req.query.email;
    console.log(id+" "+email)
    otpdb.deleteOne({email:email}).then()
    otpcontroller.sendOtp(id,email,res)
    res.render('sendotp',{email:email,id:id})

}
exports.forgetpass=(req,res)=>{
    const status=req.query.status;
    console.log(status);
    res.render('forgetpass',{status:status})
}
exports.forgetotp=(req,res)=>{
    const email=req.query.email;
    res.render('forgetotp',{email:email})
}

exports.checkout=(req,res)=>{
    req.session.order=true;
    const index=req.query.index??0
    const id=req.query.id??""
    console.log(req.body.price);
    console.log(req.body.discount);
    Userdb.findOne({email:req.session.email}).then((data)=>{
        res.render('paymentpage',{user:data,index:index,price:req.body.price,discount:req.body.discount,id:id});
    })
}
exports.payment=(req,res)=>{
    const coupon=req.query.coupon??0
    const id=req.query.id??""
    Userdb.findOne({email:req.session.email}).then((data)=>{
        res.render('paymentpage1',{index:req.query.index,price:req.body.total,id:id,coupon:coupon,wallet:data.wallet,couponcode:'none'})
    })

   
}
exports.payment1=(req,res)=>{
    const coupon=req.query.coupon??0
    const id=req.query.id??""
    Userdb.findOne({email:req.session.email}).then((data)=>{
   res.render('paymentpage1',{index:req.query.index,price:req.query.total,id:id,coupon:coupon,wallet:data.wallet,couponcode:req.query.couponcode})
})
}

exports.ourstore=(req,res)=>{
    const cat=req.query.category;
    const search=req.query.search
    axios.get(`http://localhost:3001/api/ourstore?category=${req.query.category}&search=${req.query.search}`)
    .then(function(response){
        const products=response.data;
        catdb.find({deleted:false}).then((data)=>{
            console.log(data);
            res.render('ourstore',{products:products,category:data,varify:req.session.varify,cat:cat})
        })
      
       
    })
    .catch(err=>{
        res.send(err);
    })
}
exports.filter=(req,res)=>{
    const min=req.body.min;
    const max=req.body.max;
    if(req.query.cat=='all'){
        productdb.find({price:{$lt:max,$gt:min}}).then((data2)=>{
            const data=data2;
            catdb.find({deleted:false}).then((data1)=>{
                res.render('ourstore',{products:data,category:data1,cat:req.query.cat})
            })
        })
    }else{
        productdb.find({price:{$lt:max,$gt:min},category:req.query.cat}).then((data2)=>{
            const data=data2;
            catdb.find({deleted:false}).then((data1)=>{
                res.render('ourstore',{products:data,category:data1,cat:req.query.cat})
            })
        })
    }
    

}
exports.userorders=(req,res)=>{
    axios.get(`http://localhost:3001/api/userorder?email=${req.session.email}`)
    .then(function(response){
      console.log(response.data);
      res.render('user-orders',{order:response.data})
   })
   .catch(err=>{
       res.send(err);
   })

}
exports.cancelorder=(req,res)=>{
    orderdb.updateOne({_id:req.query.id},{$set:{status:'Canceled'}}).then((data)=>{
        console.log(data);
    })
    axios.get(`http://localhost:3001/api/userorder?email=${req.session.email}`)
    .then(function(response){
      console.log(response.data);
      res.render('user-orders',{order:response.data})
   })
   .catch(err=>{
       res.send(err);
   })
}

exports.orderdetail=(req,res)=>{
    const index=parseInt(req.query.index)
    orderdb.findOne({_id:req.query.id}).then((data)=>{
        res.render('orderdetail',{order:data,index:index})
    })
}



let key_id=process.env.key_id
const razorpayInstance = new Razorpay({
    key_id:key_id,
    key_secret:process.env.key_secret,
});

exports.submitorder = async (req, res) => {
    const totalAmount = req.query.price;
    const randomOrderID = Math.floor(Math.random() * 1000000).toString();
    const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: randomOrderID,
    };

    try {
        const response = await razorpayInstance.orders.create(options);
        console.log("RazorPay Response:", response);

        // Handle success and send the response to the client
        res.status(200).send({
            razorSuccess: true,
            msg: "order created",
            amount: totalAmount * 100,
            key_id: process.env.key_id, // Correct key_id
        });
    } catch (error) {
        console.error("Razorpay Error:", error);

        // Handle error and send an appropriate response to the client
        res.status(400).send({
            razorSuccess: false,
            msg: "Error creating order with Razorpay",
        });
    }
};
exports.deposit = async (req, res) => {
    const totalAmount = req.body.price;
    console.log(totalAmount);
    const randomOrderID = Math.floor(Math.random() * 1000000).toString();
    const options = {
        amount: totalAmount*100,
        currency: "INR",
        receipt: randomOrderID,
    };

    try {
        const response = await razorpayInstance.orders.create(options);
        console.log("RazorPay Response:", response);

        // Handle success and send the response to the client
        res.status(200).send({
            razorSuccess: true,
            msg: "order created",
            amount: response.amount,
            key_id: process.env.key_id, // Correct key_id
        });
    } catch (error) {
        console.error("Razorpay Error:", error);

        // Handle error and send an appropriate response to the client
        res.status(400).send({
            razorSuccess: false,
            msg: "Error creating order with Razorpay",
        });
    }
};


exports.ordersuccess=(req,res)=>{
    req.session.order=false;
    res.render('order-success');
}


exports.userwallet=(req,res)=>{
    Userdb.findOne({email:req.session.email}).then((data)=>{
        res.render('user-wallet',{user:data})
    })
    
}
exports.addtowallet=(req,res)=>{
    res.render('addtowallet');
}

exports.addreview=(req,res)=>{
    res.render('review',{id:req.query.id});
}