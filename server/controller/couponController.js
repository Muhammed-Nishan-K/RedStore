const coupondb = require("../model/couponSchema");

exports.create=(req,res)=>{
    const newcoupon = new coupondb({
        couponcode:req.body.couponCode,
        discount:req.body.discountPercentage,
        expdate:req.body.expirationDate,
        status:'active'
    });
    newcoupon.save().then((data)=>{
        res.redirect('/admin-ofer')
    })
}

exports.delete=(req,res)=>{
    coupondb.updateOne({_id:req.query.id},{$set:{status:"disable"}}).then((data)=>{
        res.redirect('/admin-ofer')
    })
}
exports.aplaycoupon=(req,res)=>{
    const couponCode=req.body.cpn;

    coupondb.find({couponcode:couponCode,status:"active"}).then((data)=>{
        
        req.session.price=req.session.price-data[0].discount;
        res.redirect(`/payment?coupon=${data[0].discount}&id=${req.query.id}&index=${req.query.index}&total=${req.query.total}&couponcode=${couponCode}`);
    })
}