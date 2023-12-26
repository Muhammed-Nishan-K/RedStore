const offerdb = require("../model/offerSchema");
const productdb = require("../model/productSchema");

exports.create=(req,res)=>{
    const newoffer = new offerdb({
        category:req.body.category,
        discount:req.body.discountPercentage,
        expdate:req.body.expirationDate,
        min:req.body.min,
        status:'inactive'
    });
    newoffer.save().then((data)=>{
        res.redirect('/admin-ofer')
    })
}
exports.inactive=async(req,res)=>{
    const offer=await offerdb.findOne({_id:req.query.id})
    await productdb.updateMany({category:offer.category,price:{$gt:offer.min}},{$inc:{price:offer.discount}})
    await offerdb.updateOne({_id:req.query.id},{status:'inactive'})
    res.redirect('/admin-ofer')
}
exports.active=async(req,res)=>{
    const offer=await offerdb.findOne({_id:req.query.id})
    await productdb.updateMany({category:offer.category,price:{$gt:offer.min}},{$inc:{price:-offer.discount}})
    await offerdb.updateOne({_id:req.query.id},{status:'active'})
    res.redirect('/admin-ofer')
}