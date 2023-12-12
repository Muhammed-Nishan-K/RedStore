const { log } = require('console');
const productdb = require('../model/productSchema');
const multer=require('multer');
const path=require('path');
const fs=require('fs');
const cartdb = require('../model/cartschema');
const wishdb = require('../model/wishlistschema');

exports.create=(req, res) => {

 





  
    // Create a new product instance using the request data
    const newProduct = new productdb({
        productName: req.body.productName,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        image:req.files[0].filename,
        deleted:false,
        catstatus:true,
        discount:req.body.Discount,
        reviews:[],
        rating:5
     
     
    });
  
    // Save the product to the database
    newProduct.save()
      .then(data => {

        // Product was successfully saved, redirect to the desired page
        res.redirect("/admin-dash");
      })
      .catch(err => {
        // Handle the error in a way that suits your application
        console.error("Error saving product:", err);
        res.status(500).send("Error occurred while saving the product.");
      });
  }

exports.find=(req,res)=>{
    productdb.find({deleted:false,catstatus:true}).then((data)=>{
        res.send(data);
    })
}
exports.finddelete=(req,res)=>{
    productdb.find({deleted:true,catstatus:true}).then((data)=>{
        res.send(data);
    })
}


exports.delete=(req,res)=>{
  const eid=req.query.id;

  productdb.updateOne({_id:eid},{$set:{deleted:true}}).then((data)=>{
    productdb.findOne({_id:eid}).then((data)=>{
      
      cartdb.updateOne({productName:data.productName},{$set:{deleted:true}}).then()
    }).then()
    res.send("<script>alert('Deleted successfully!'); window.location='/admin-products';</script>");
  }).catch((err)=>{
    res.send(err)
  })
}
exports.restore=(req,res)=>{
  const eid=req.query.id;

  productdb.updateOne({_id:eid},{$set:{deleted:false}}).then((data)=>{
    productdb.findOne({_id:eid}).then((data)=>{
      
      cartdb.updateOne({productName:data.productName},{$set:{deleted:false}}).then()
    }).then()
    res.redirect('/deleted-items')
  }).catch((err)=>{
    res.send(err)
  })
}
exports.deletetrue=(req,res)=>{
  const eid=req.query.id;

  productdb.deleteOne({_id:eid}).then((data)=>{
    fs.unlinkSync(`images/${req.query.img}`)
    res.send("<script>alert('Deleted successfully!'); window.location='/deleted-items';</script>");
  }).catch((err)=>{
    res.send(err)
  })
}

exports.update=(req,res)=>{
  const eid=req.query.id;
    productdb.findOne({_id:eid}).then((data)=>{
      cartdb.updateMany({productName:data.productName},{$set:{productName: req.body.productName,category: req.body.category,description: req.body.description,price: req.body.price,discount:req.body.Discount,quantity:1}}).then((data)=>{

      })
})
    productdb.findOne({_id:eid}).then((data)=>{
      wishdb.updateMany({productName:data.productName},{$set:{productName: req.body.productName,category: req.body.category,description: req.body.description,price: req.body.price,discount:req.body.Discount,quantity:1}}).then((data)=>{

      })
})
    productdb.updateOne({_id:eid},{$set:{productName: req.body.productName,category: req.body.category,description: req.body.description,price: req.body.price,quantity: req.body.quantity,discount:req.body.Discount}})
    .then(data => {
      // Product was successfully saved, redirect to the desired page
      res.redirect("/admin-products");
    })
    .catch(err => {
      // Handle the error in a way that suits your application
      console.error("Error saving product:", err);
      res.status(500).send("Error occurred while saving the product.");
    });

//   fs.unlinkSync(`images/${req.query.img}`)
//   productdb.deleteOne({_id:eid}).then((req,res)=>{
    
//   })
  
//   const newProduct = new productdb({
//     productName: req.body.productName,
//     category: req.body.category,
//     description: req.body.description,
//     price: req.body.price,
//     quantity: req.body.quantity
//     
 
 
// });

// // Save the product to the database
// newProduct.save()
  
  
}

exports.findproduct=(req,res)=>{
  const eid=req.query.id;
  productdb.find({_id:eid,deleted:false}).then((data)=>{
    res.send(data)
  })
}
exports.addimg=(req,res)=>{
  const id=req.query.id
  const image=req.files[0].filename
  productdb.updateOne({_id:id},{$push:{image:image}}).then((data)=>{
    res.redirect('/admin-products');
  })
}
exports.deleteimg=(req,res)=>{
  const id=req.query.id;
  const img=req.query.imgOne;

  productdb.updateOne(
    {_id: id},
    {$pull:{ image:{$in:[img]} }}
  ).then((data) => {
    res.redirect(`/uplaod?id=${id}`);
  }).catch((error) => {
    console.error("Error updating document:", error);
    // Handle the error, e.g., send an error response to the client
  });
  
}

exports.ourstore=(req,res)=>{
    const search=req.query.search
    console.log(search+"  this is search")
    if(req.query.search!=''){
      productdb.aggregate([
        {$match:{productName:{$regex:search}}}
      ])
      .then(data1=>{
       console.log(data1+"   its aggregate data")
       res.send(data1)
      })
    }else{
    
      if(req.query.category=="all"){
        productdb.find({deleted:false}).then((data)=>{
          console.log(data+" its data")
          res.send(data);
        })
      }else{
        productdb.find({deleted:false,category:req.query.category}).then((data)=>{
          console.log(data+" its data")
          res.send(data);
        })
      }
    }

  
}

exports.addreview=(req,res)=>{
  const rating=parseInt(req.body.rating)
  const review={
    review:req.body.review,
    rating:rating,
    email:req.session.email
  }
  productdb.updateOne({_id:req.query.id},{$push:{reviews:review}}).then((data)=>{
    res.redirect( `/product-details?productId=${req.query.id}`)
  })

}