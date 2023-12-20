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
    catdb.find({deleted:false}).then((data1)=>{
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
            }).catch((err)=>{
                res.redirect('/err');
            })
            
            
        }).catch((err)=>{
            res.render('/err');
        })
    }).catch((err)=>{
        res.render('/err');
    })
    
    
 })
 .catch(err=>{
     res.render('/err');
 })
    
}
exports.address=(req,res)=>{
    res.render('address')
}
exports.login=async(req,res)=>{
    const isauth=req.session.isauth;
    const blocked=req.session.blocked;
    const nouser=req.session.nouser;
    req.session.status='true'
    const category= await catdb.find({deleted:false})
    
    axios.get(`http://localhost:3001/api/user?email=${req.session.email}`)
  .then(function(response){
    
     res.render('userlogin.ejs',{status:isauth,user:response.data,blocked:blocked,nouser:nouser,category:category})
  })
  .catch(err=>{
      res.render('errorpage');
  })
    // console.log("last");
    // console.log(req.query.user)
    // res.render('userlogin',{status:req.query.status,user:req.query.user})
}

exports.register=(req,res)=>{
    const message=''
    res.render('userRegister', {message:message})
} 



exports.productdetalis=(req,res)=>{
    const id=req.query.productId
    req.session.prid=id
    console.log(id);
    productdb.findOne({_id:id})
    
    .then(data=>{
        const data1=data
        req.session.sum=data1.discount;
        req.session.discount=data1.discount-data1.price
        Userdb.find({email:req.session.email}).then((data)=>{
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
            
        }).catch((err)=>{
            res.redirect(('/err'))
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
    axios.get(`http://localhost:3001/api/logout?email=${req.session.email}`).then().catch((err)=>{
        res.redirect(('/err'))
    })
    req.session.email='';
    res.redirect("/");
    
}
exports.cartshow=async(req,res)=>{
    const category= await catdb.find({deleted:false})
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
    req.session.sum=discount;
    req.session.discount=discount-sum;
    
     res.render('cartpage',{cart:a,sum:sum,discount:discount,category:category})
    }).catch((err)=>{
        res.redirect(('/err'))
    })
    
    
    
    
  })
  .catch(err=>{
      res.redirect('/err')
  })
}
exports.listshow=async(req,res)=>{
    const category= await catdb.find({deleted:false})
    axios.get(`http://localhost:3001/api/listshow?email=${req.session.email}`)
  .then(function(response){
    const a=response.data
    wishdb.find({deleted:true}).then((data)=>{
    let sum=0;
    for(let i=0;i<a.length;i++){
        let b=parseInt(a[i].price)
        sum=sum+b;
    }
    
    
     res.render('wishlist',{cart:a,sum:sum,category:category})
    }).catch((err)=>{
        res.redirect(('/err'))
    })
    
    
    
    
  })
  .catch(err=>{
     res.redirect('/err')
  })
}
exports.otp=async(req,res)=>{
    const category=await catdb.find({deleted:true})
    const email=req.session.email;
    await otpdb.deleteMany({email:email})
    
    res.render('otp',{email:email,category:category})

}
exports.sendotp=async(req,res)=>{
    const category=await catdb.find({deleted:true})
    const email=req.session.email;
    otpcontroller.sendOtp(email,res)
    res.render('sendotp',{email:email})

}
exports.forgetsendotp=(req,res)=>{
    const email=req.session.forgetemail;
    Userdb.find({email:email}).then((data)=>{
        const email=data[0].email;
        otpcontroller.sendOtp(email,res)
        res.render('forgetvarifyotp',{email:email,status:false})
    }).catch((err)=>{
        res.redirect('/err')
    })
    
    

}
exports.resendotp=(req,res)=>{
    const email=req.session.forgetemail;
    otpdb.deleteOne({email:email}).then().catch((err)=>{
        res.redirect('/err')
    }).catch((err)=>{
        res.redirect(('/err'))
    })
    otpcontroller.sendOtp(email,res)
    res.render('sendotp',{email:email,status:false})

}
exports.forgetpass=(req,res)=>{
    
    const status=req.session.status;
    res.render('forgetpass',{status:status})
}
exports.forgetotp=(req,res)=>{
    otpdb.deleteMany({email:req.session.forgetemail}).then((data)=>{

    }).catch((err)=>{
        res.redirect(('/err'))
    })
    const email=req.session.forgetemail
    res.render('forgetotp',{email:email})
}

exports.checkout=(req,res)=>{
    req.session.order=true;
    const index=req.query.index??0
    const id=req.query.id??""
    console.log(req.session.sum);
    console.log(req.session.discount);
    req.session.price=req.session.sum-req.session.discount
    const category=catdb.find({deleted:false})
    Userdb.findOne({email:req.session.email}).then((data)=>{
        res.render('paymentpage',{user:data,index:index,price:req.session.sum,discount:req.session.discount,id:id,category:category});
    }).catch((err)=>{
        res.redirect(('/err'))
    })
}
exports.payment=(req,res)=>{
    const coupon=req.query.coupon??0
    const id=req.query.id??""
    const category=catdb.find({deleted:false}).then(data=>{

    }).catch((err)=>{
    res.redirect(('/err'))
})
    Userdb.findOne({email:req.session.email}).then((data)=>{
        res.render('paymentpage1',{index:req.query.index,price:req.session.price,id:id,coupon:coupon,wallet:data.wallet,couponcode:'none',category:category})
    }).catch((err)=>{
        res.redirect(('/err'))
    })

   
}
exports.payment1=(req,res)=>{
    const coupon=req.query.coupon??0
    const id=req.query.id??""
    const category=catdb.find({deleted:false}).then(data=>{

    }).catch((err)=>{
    res.redirect(('/err'))
})
    Userdb.findOne({email:req.session.email}).then((data)=>{
   res.render('paymentpage1',{index:req.query.index,price:req.session.price,id:id,coupon:coupon,wallet:data.wallet,couponcode:req.query.couponcode,category:category})
}).catch((err)=>{
    res.redirect(('/err'))
})
}

exports.ourstore=async(req,res)=>{
    const cat=req.query.category;
    const search=req.query.search
    axios.get(`http://localhost:3001/api/ourstore?category=${req.query.category}&search=${req.query.search}`)
    .then(function(response){
        const products=response.data;
        catdb.find({deleted:false}).then((data)=>{

            res.render('ourstore',{products:products,category:data,varify:req.session.varify,cat:cat,searchQuery:req.query.search})
        })
      
       
    })
    .catch(err=>{
        res.redirect('/err')
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
            }).catch((err)=>{
                res.redirect(('/err'))
            })
        }).catch((err)=>{
            res.redirect(('/err'))
        })
    }else{
        productdb.find({price:{$lt:max,$gt:min},category:req.query.cat}).then((data2)=>{
            const data=data2;
            catdb.find({deleted:false}).then((data1)=>{
                res.render('ourstore',{products:data,category:data1,cat:req.query.cat})
            })
        }).catch((err)=>{
            res.redirect(('/err'))
        })
    }
    

}
exports.userorders=async(req,res)=>{
    const category=await catdb.find({deleted:false})
    axios.get(`http://localhost:3001/api/userorder?email=${req.session.email}`)
    .then(function(response){
        res.render('user-orders',{order:response.data,category:category})
   })
   .catch(err=>{
       res.send(err);
   })

}
exports.cancelorder=async(req,res)=>{
    orderdb.updateOne({_id:req.query.id},{$set:{status:'Canceled'}}).then((data)=>{
        
    })
    const amound=await orderdb.findOne({_id:req.query.id})
    const currentDate = new Date();
    const wallet={
        amount:amound.price,
        date: currentDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
        time: currentDate.toTimeString().split(' ')[0] ,
        mode:"cancelorder"
    }
    await Userdb.updateOne({email:req.session.email},{$push:{walletdetails:wallet}})
    Userdb.updateOne({email:req.session.email},{$inc:{wallet:amound.price}}).then((data)=>{

    }).catch(err=>{
        res.redirect('/err')
    })
    res.redirect('/userorders')
}

exports.orderdetail=async(req,res)=>{
    const category= await catdb.find({deleted:false})
    const index=parseInt(req.query.index)
    orderdb.findOne({_id:req.query.id}).then((data)=>{
        res.render('orderdetail',{order:data,index:index,category:category})
    }).catch(err=>{
        res.redirect('/err')
    })
}



let key_id=process.env.key_id
const razorpayInstance = new Razorpay({
    key_id:key_id,
    key_secret:process.env.key_secret,
});

exports.submitorder = async (req, res) => {
    const totalAmount = req.session.price;
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


exports.userwallet=async(req,res)=>{
    const category= await catdb.find({deleted:false})
    Userdb.findOne({email:req.session.email}).then((data)=>{
        res.render('user-wallet',{user:data,category:category})
    }).catch((err)=>{
        res.redirect('/err')
    })
    
}
exports.addtowallet=async(req,res)=>{
    const category= await catdb.find({deleted:false}).then((data)=>{

    }).catch(err=>{
        res.redirect('/err')
    })
    res.render('addtowallet',{category:category})
}

exports.addreview=(req,res)=>{
    res.render('review',{id:req.query.id});
}

exports.blogs=async(req,res)=>{
    try{
        const category= await catdb.find({deleted:false})
        res.render('blogpage',{category:category})
    }catch{
        res.redirect('/err')
    }
    
    
}

exports.contactus=async(req,res)=>{
    try{
        const category= await catdb.find({deleted:false})
        res.render('contactus',{category:category})
    }catch{
        res.redirect('/err');
    }
    
}

exports.err=(req,res)=>{
    res.render('errorpage');
}