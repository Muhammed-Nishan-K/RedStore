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
        if(data.length==0){
            req.session.status=false
            res.redirect(`/payment`)

        }else{
            req.session.price=req.session.price-data[0].discount;
            req.session.couponvalue=data[0].discount
            req.session.status=true
            req.session.couponCode=couponCode
        res.redirect(`/payment`);
        }
        
        
    })
}
exports.removecoupon=(req,res)=>{
    const couponvalue =req.session.couponvalue
    req.session.price=req.session.price+couponvalue;
    req.session.couponCode='';
    req.session.couponvalue='0';
    req.session.status=true;
    res.redirect('/payment')
    
}
// exports.removecoupon=(req,res)=>{
//     const couponCode=req.body.cpn;

//     coupondb.find({couponcode:couponCode,status:"active"}).then((data)=>{
//         if(data.length==0){
//             req.session.status=false
//             res.redirect(`/payment?id=${req.query.id}&index=${req.query.index}&couponcode=${couponCode}`)

//         }else{
//             req.session.price=req.session.price+data[0].discount;
//             req.session.status=true
//         res.redirect(`/payment?coupon=${data[0].discount}&index=${req.query.index}&couponcode=${couponCode}`);
//         }
        
        
//     })
// }