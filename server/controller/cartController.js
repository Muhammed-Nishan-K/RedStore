
const cartdb = require("../model/cartschema");
const productdb = require("../model/productSchema");
const dotenv=require("dotenv")
dotenv.config({path:"config.env"})
const cartadb = require("../model/cartschema");


exports.create=(req,res)=>{
    const id=req.query.id;
    console.log(id+"A");
    productdb.findOne({_id:id}).then((data)=>{
        console.log(data);
        
        const cartdb = new cartadb({
            productName: data.productName,
            category: data.category,
            description: data.description,
            price: data.price,
            quantity: 1,
            image:data.image,
            email:req.session.email,
            deleted:data.deleted,
            catstatus:data.catstatus,
            discount:data.discount
         
         
        });
        cartadb.find({email:req.session.email,productName:data.productName}).then((data)=>{
            if(data.length==0){
                cartdb.save().then((data)=>{
                    res.redirect(`/cartpage`)
                }).catch((err)=>{
                    res.redirect(`/cartpage`)
                })
            }else{
                res.redirect(`/cartpage`)
            }
        })
        
      

    
    }).catch((err)=>{
        res.send(err);
    })
    
}
exports.find=(req,res)=>{
    const user=req.query.email

    cartdb.find({email:user}).then((data)=>{
        res.send(data);
    })
}

exports.delete=(req,res)=>{
    console.log(req.query.id);
    cartdb.deleteOne({_id       :req.query.id}).then((data)=>{
        res.redirect("/cartpage");
    }).catch((err)=>{
        res.send(err)
    })
}

exports.findid=(req,res)=>{
    console.log(req.query.productId+"A");
    cartadb.findOne({_id:req.query.productId}).then((data)=>{
        console.log(data+"B");
        productdb.findOne({productName:data.productName}).then((data)=>{
            console.log(data+"C");
            const id=data._id;
            res.redirect(`/product-details?productId=${id}`);
        })
    })
}
exports.findid1=(req,res)=>{
    cartadb.findOne({_id:req.query.productId}).then((data)=>{
        productdb.findOne({productName:data.productName}).then((data)=>{
            const id=data._id;
            res.redirect(`/api/wishlist?id=${id}`);
        })
    })
}

exports.quantityUpdate=async(req,res)=>{
    const prId=req.query.prId
    const delta=Number(req.query.delta)
    try {
  
       const cartdata=await cartdb.findOne({_id:prId})
       console.log(cartdata)
       const productdata=await productdb.findOne({productName:cartdata.productName})
        console.log(3)
       if(!cartdata){
        res.json({success:false, messege:"no cartdata"})
        return
       }
     
       const newQuantity=cartdata.quantity+delta
       const curruntStock=productdata.quantity
       

       if(newQuantity >=1 && newQuantity<= curruntStock){
        await cartdb.updateOne({_id:prId},{$set:{quantity:newQuantity}})
        const cart=await cartdb.find({email:req.session.email})
        res.json({success:true , messege:"newQuantity updated",newQuantity:newQuantity,productdata:productdata,cart:cart})
       }else{
        res.json({success:false, messege:"quantity must need 1 more"})
       }
        
    } catch (error) {
        console.log("this is try catch error in update session")
        res.json({success:false, messege:"Internal Server Error"})
    }
  
}