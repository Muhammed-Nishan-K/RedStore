const express = require("express");
const router = express.Router();

const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const fileExtension = path.extname(file.originalname);
    cb(null, file.originalname);
    return file;
  },
});

const upload = multer({ storage: storage });

const adminController = require("../controller/adminController");
const userController = require("../controller/userController");
const blockController = require("../controller/bController");
const adminServices = require("../services/adminRender");
const addproduct = require("../controller/productController");
const isadmin=require("../middleware/authmiddleware");
const catcontroller=require("../controller/catController")
const orderController=require("../controller/orderController")
const banner=require('../controller/bannerController')
const coupon=require("../controller/couponController")
const offer=require('../controller/offerController')

router.get("/adminlogin", adminServices.adminlogin); //adminlogin loginpage render
router.get("/adminlogout", adminServices.adminlogout); //adminlogin loginpage render

router.post("/adminlogin", adminServices.isAdmin);

router.get("/admin-dash",isadmin.adminauthMiddleware,adminServices.admindash);
router.get("/admin-order",isadmin.adminauthMiddleware, adminServices.adminorder);
router.get("/admin-products",isadmin.adminauthMiddleware, adminServices.adminproduct);
router.get("/admin-users",isadmin.adminauthMiddleware, adminServices.adminusers);
router.get("/admin-category",isadmin.adminauthMiddleware, adminServices.category);
router.get("/addcoupon",isadmin.adminauthMiddleware, adminServices.addcoupon);
router.get("/addoffer",isadmin.adminauthMiddleware, adminServices.addoffer);
router.get("/admin-banner",isadmin.adminauthMiddleware, adminServices.banner);
router.get("/admin-ofer",isadmin.adminauthMiddleware, adminServices.offer);
router.get("/addproduct",isadmin.adminauthMiddleware, adminServices.addproduct);
router.get("/uplaod",isadmin.adminauthMiddleware, adminServices.addimg);
router.get("/updatepage",isadmin.adminauthMiddleware, adminServices.updatepage);
router.get("/deleted-items",isadmin.adminauthMiddleware,adminServices.deleteditems);
router.get("/deletedcat",isadmin.adminauthMiddleware,adminServices.deletedcat);
router.post("/filter",isadmin.adminauthMiddleware,adminServices.filter);
router.get('/orderdetailsad',adminServices.orderdetailad)
router.post("/download-pdf", adminServices.createpdf);


router.get("/api/users",adminController.find);
router.get("/api/countUsers",adminController.countuser)
router.get("/api/users/users", adminController.finduser);
router.get("/api/block",blockController.create);
router.post("/api/addproduct",upload.array("image"), addproduct.create);
router.post("/api/addbanner",upload.array("image"), banner.create);

router.get("/api/showproduct",addproduct.find);
router.get("/api/showdeletedproduct",addproduct.finddelete)
router.get("/api/showcat",catcontroller.find);
router.get("/api/inactiveoffer",offer.inactive);
router.get("/api/activeoffer",offer.active);
router.get("/api/showcatdelete",catcontroller.finddelete);
router.get("/api/deletecoupon",coupon.delete);
router.get("/api/deleteproduct",addproduct.delete);
router.get("/api/restore",addproduct.restore);
router.get("/api/findorder",orderController.findad);
router.get("/api/countOrders",orderController.findod);
router.get("/api/restoretrue",catcontroller.restore);
router.get("/api/deletecat",catcontroller.delete);
router.get("/api/bannerdlt",banner.delete);
router.get("/api/deletecattrue",catcontroller.deletetrue);
router.get("/api/deleteproducttrue",addproduct.deletetrue);
router.post("/api/updateproduct", addproduct.update) ; 
router.post("/api/addcoupon", coupon.create) ; 
router.post("/api/addoffer", offer.create) ; 
router.post("/api/updateproduct", addproduct.update) ; 
router.post("/api/addcat", catcontroller.create) ; 
router.get("/api/findcat", catcontroller.find) ; 
router.get("/api/deleteimg", addproduct.deleteimg) ; 
router.post("/api/img",upload.array("image"), addproduct.addimg);
router.post("/change/status",orderController.change);

router.get("/api/findproduct",addproduct.findproduct);

router.get("/user/details",adminServices.userdetails);

module.exports = router;
