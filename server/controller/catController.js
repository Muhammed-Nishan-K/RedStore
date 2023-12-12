
const cartdb = require("../model/cartschema");
const catdb = require("../model/categorySchema");
const productdb = require("../model/productSchema");
const wishdb = require("../model/wishlistschema");

exports.find=(req,res)=>{
    catdb.find({deleted:"false"}).then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
    })
}
exports.finddelete=(req,res)=>{
    catdb.find({deleted:"true"}).then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
    })
}
exports.create=(req,res)=>{
    const catadb = new catdb({
        catname: req.body.Categoryname,
        deleted:false
     
     
    })
    catadb.save().then(()=>{
        res.redirect('/admin-category')
    })
}

exports.delete=(req,res)=>{
    const id=req.query.id;
    catdb.updateOne({_id:id},{deleted:"true"}).then(()=>{
        catdb.find({_id:id}).then((data)=>{
            productdb.updateMany({category:data[0].catname},{$set:{catstatus:false}}).then()
            cartdb.updateMany({category:data[0].catname},{$set:{catstatus:false}}).then()
            wishdb.updateMany({category:data[0].catname},{$set:{catstatus:false}}).then()
        })
        res.redirect('/admin-category');
    })
}
exports.deletetrue=(req,res)=>{
    const id=req.query.id;
    catdb.deleteOne({_id:id}).then(()=>{
        res.redirect('/deletedcat') 
    })
}
exports.restore=(req,res)=>{
    const eid=req.query.id;
  
    catdb.updateOne({_id:eid},{$set:{deleted:"false"}}).then((data)=>{
        catdb.find({_id:eid}).then((data)=>{
            productdb.updateMany({category:data[0].catname},{$set:{catstatus:true}}).then()
            wishdb.updateMany({category:data[0].catname},{$set:{catstatus:true}}).then()
            cartdb.updateMany({category:data[0].catname},{$set:{catstatus:true}}).then((data)=>{
                res.redirect('/deletedcat')
            })

        })
        
        
      
    }).catch((err)=>{
      res.send(err)
    })
  }