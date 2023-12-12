const axios=require('axios')
const { response } = require('express')
const productdb = require('../model/productSchema')
const catdb=require("../model/categorySchema")
const orderdb = require('../model/orderSchema')
const Userdb = require('../model/usersSchema')
const bannerdb = require('../model/bannerSchema')
const coupondb = require('../model/couponSchema')
const fs = require('fs'); // Use the promises version of fs for async/await
   const path = require('path');
   const PDFDocument = require('pdfkit');

exports.adminlogin=(req,res)=>{
    res.render('adminlogin')
}
exports.adminlogout=(req,res)=>{
  req.session.adisauth=false;
    res.render('adminlogin')
}

exports.admindash=(req,res)=>{
  Userdb.find({})
      .then(response=>{
        const userCount=response.length
          orderdb.find({status:"pending"})
          .then(data=>{
              let totalsale=0
              console.log(response.data)
              const orderCount=data.length
              for(let i=0;i<data.length;i++){
                totalsale+=(data[i].quantity*data[i].price)
              }
              res.render("admindashboard",{usercount:userCount,ordercount:orderCount,totalsale:totalsale})
          }).catch(err=>{
            res.send(err)
     })
          
      }).catch(err=>{
          res.send(err)
   })
}
exports.addimg=(req,res)=>{
  const id=req.query.id;
  console.log(id);
  productdb.find({_id:id}).then((data)=>{
    const img= data[0].image;
    res.render('uploadimg',{id:id,img:img})
  })
}
// exports.uploadimg=(req,res)=>{
//   const id=req.query.id;
//   console.log(id);
//   productdb.find({_id:id}).then((data)=>{
//     console.log(data+"this is data");
//     const img= data[0].image;
//     res.render('uploadimg',{id:id,img:['0']})
//   })
  
// }

exports.adminorder=(req,res)=>{
    
  axios.get(`http://localhost:3001/api/findorder`)
  .then(function(response){
    console.log(response.data);
    res.render('adminOrder',{order:response.data})
 })
 .catch(err=>{
     res.send(err);
 })
}
exports.adminproduct=(req,res)=>{
  axios.get(`http://localhost:3001/api/showproduct`)
  .then(function(response){
    const data1=response.data
    console.log("first");
    console.log(data1);
    catdb.find({deleted:"false"}).then((data)=>{
      res.render('adminproduct',{product:data1,cat:data})
    })
    
 })
 .catch(err=>{
     res.send(err);
 })
    
}
exports.addproduct=(req,res)=>{
  axios.get(`http://localhost:3001/api/findcat`)
  .then(function(response){
    console.log(response.data);
    res.render('addproduct',{cat:response.data})
 })
 .catch(err=>{
     res.send(err);
 })
}
exports.updatepage=(req,res)=>{

  axios.get(`http://localhost:3001/api/findproduct?id=${req.query.id}`)
  .then(function(response){
    const data1=response.data[0]
    catdb.find({deleted:"false"}).then((data)=>{
    res.render('updateproduct',{product:data1,cat:data})
    })
    
 })
 .catch(err=>{
     res.send(err);
 })
    
}
exports.userdetails=(req,res)=>{
  axios.get(`http://localhost:3001/api/users/users?email=${req.query.email}`)
  .then(function(response){
     res.render('userdetails.ejs',{user:response.data})
  })
  .catch(err=>{
      res.send(err);
  })

}
exports.adminusers=(req,res)=>{
  axios.get('http://localhost:3001/api/users')
  .then(function(response){
      // console.log(response.data);
      res.render('adminusers.ejs',{users:response.data})
  })
  .catch(err=>{
      res.send(err);
  })
}

exports.deleteditems=(req,res)=>{
  axios.get(`http://localhost:3001/api/showdeletedproduct`)
  .then(function(response){
    res.render('deleteditems',{product:response.data})
 })
 .catch(err=>{
     res.send(err);
 })
    
}


exports.category=(req,res)=>{
  axios.get(`http://localhost:3001/api/showcat`)
  .then(function(response){
    res.render('category',{cat:response.data})
 })
 .catch(err=>{
     res.send(err);
 })
    
  
}


exports.deletedcat=(req,res)=>{
  axios.get(`http://localhost:3001/api/showcatdelete`)
  .then(function(response){
    res.render('deletedcat',{cat:response.data})
 })
 .catch(err=>{
     res.send(err);
 })
}

exports.filter=(req,res)=>{
  productdb.find({category:req.body.category}).then((data)=>{
    const data1=data;
    catdb.find({deleted:"false"}).then((data)=>{
      res.render('adminproduct',{product:data1,cat:data})
    })
  })
}

exports.orderdetailad=(req,res)=>{
  orderdb.findOne({_id:req.query.id}).then((data)=>{
      res.render('adminorderdetails',{order:data})
  })
}






const adminEmail = "admin@gmail.com";
const adminPassword = "1234";

exports.isAdmin = (req, res) => {
    const { email: inputEmail, password: inputPassword } = req.body;
    if (inputEmail === adminEmail && inputPassword === adminPassword) {
      req.session.adisauth=true;
        console.log(inputEmail);
      res.redirect("/admin-dash");
    } else {
      res.redirect("/adminlogin");
    }
  };

exports.banner=(req,res)=>{
  bannerdb.find({}).then((data)=>{
    res.render('adminbanner',{banner:data})
  })
  
}

exports.offer=(req,res)=>{
  coupondb.find().then((data)=>{
    res.render('adminoffer',{coupon:data});
  })
  
}
exports.addcoupon=(req,res)=>{
  res.render('addcoupon');
}

exports.createpdf=async(req,res)=>{

  const filter = req.body.dateFilter || 'default';  // Update this line based on your form data

  try {
      const filePath = await createpdf(filter);
      res.download(filePath, 'sales_report.pdf', async (err) => {
          // Delete the temporary PDF file after it has been sent
          if (err) {
              console.error(err);
              res.status(500).send('Internal Server Error');
          } else {
              await fs.unlinkSync(filePath);
          }
      });
  } catch (error) {
      console.error(`Error creating PDF: ${error}`);
      res.status(500).send('Internal Server Error');
  }
  
   
}

async function createpdf(filter) {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, 'sales_report.pdf');

  const stream = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
      stream.on('error', (err) => {
          reject(err);
      });

      stream.on('finish', () => {
          resolve(filePath);
      });

      doc.pipe(stream);
      doc.text('Sales Report', 50, 50);
      doc.text('Filter: ' + filter, 50, 80);
      doc.end();
  });
}
  