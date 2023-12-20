const productdb = require("../model/productSchema");
const wishadb = require("../model/wishlistschema");

exports.create=(req,res)=>{
    const id=req.query.id;
    productdb.findOne({_id:id}).then((data)=>{
        console.log("a");
        console.log(data);
        console.log(req.session.email);
        
        const wishdb = new wishadb({
            productName: data.productName,
            category: data.category,
            description: data.description,
            price: data.price,
            quantity: data.quantity,
            image:data.image,
            email:req.session.email,
            deleted:data.deleted,
            catstatus:data.catstatus
         
         
        });
        wishadb.find({email:req.session.email,productName:data.productName}).then((data)=>{
            if(data.length==0){
        wishdb.save().then((data)=>{
            res.redirect(`/wishlist`)
        }).catch((err)=>{
            res.redirect(`/wishlist`)
        })
        }
        else{
            res.redirect(`/wishlist`)
        }
    })
      

    
    }).catch((err)=>{
        console.log(err);
    })
    
}
exports.find=(req,res)=>{
    const user=req.query.email
    console.log(user+"no data");
    wishadb.find({email:user}).then((data)=>{
        res.send(data);
    })
}
exports.delete=(req,res)=>{
    wishadb.deleteOne({_id:req.query.id}).then((data)=>{
        res.redirect("/wishlist");
    }).catch((err)=>{
        res.send(err)
    })
}

exports.findid=(req,res)=>{

    wishadb.findOne({_id:req.query.productId}).then((data)=>{
        productdb.findOne({productName:data.productName}).then((data)=>{
            const id=data._id;
            res.redirect(`/product-details?productId=${id}`);
        })
    })
}
exports.findid1=(req,res)=>{

    wishadb.findOne({_id:req.query.productId}).then((data)=>{
        productdb.findOne({productName:data.productName}).then((data)=>{
            const id=data._id;
            res.redirect(`/api/addtocart?id=${id}`);
        })
    })
}