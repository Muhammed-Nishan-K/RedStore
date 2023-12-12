const bannerdb = require("../model/bannerSchema");


exports.create=(req,res)=>{
    const newbanner = new bannerdb({
        image:req.files[0].filename,
    });
    newbanner.save().then((data)=>{
        res.redirect('/admin-banner')
    }).catch((err)=>{

    })
}
exports.delete=(req,res)=>{
    const id=req.query.id;
    bannerdb.deleteOne({_id:id}).then((data)=>{
        res.redirect('/admin-banner')
    }).catch((err)=>{

    })
}