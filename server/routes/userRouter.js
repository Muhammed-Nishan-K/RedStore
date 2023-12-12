const express= require('express')
const router = express.Router()
const userServices = require('../services/userRender')
const adminServices = require('../controller/adminController')
const userController = require('../controller/userController')
const addproduct = require("../controller/productController");
const adminController = require("../controller/adminController");
const cartContoller = require("../controller/cartController");
const otpContoller = require("../controller/otpcontroller");
const wishlist=require("../controller/wishController")
const orderController=require("../controller/orderController")
const userauth=require("../middleware/authmiddleware")
const coupon=require("../controller/couponController")




router.get('/',userServices.userHome)//home
router.get('/login',userServices.login)//home
router.get('/logout',userServices.logout)//home
router.get('/register',userServices.register) //home
router.get('/product-details',userServices.productdetalis)// add user to another collction
router.get('/cartpage',userauth.userauthMiddleware,userServices.cartshow)// add user to another collction
router.post('/checkout',userauth.userauthMiddleware,userServices.checkout)// add user to another collction
// router.get('/checkout',userauth.userauthMiddleware,userServices.checkout)// add user to another collction
router.post('/payment',userauth.orderauth,userServices.payment)// add user to another collction
router.get('/payment',userauth.orderauth,userServices.payment1)// add user to another collction
router.get('/wishlist',userauth.userauthMiddleware,userServices.listshow)// add user to another collction
router.get('/ourstore',userServices.ourstore)// add user to another collction
router.get('/otp',userServices.otp)// add user to another collction
router.get('/sendotp',userServices.sendotp)// add user to another collction
router.get('/resendotp',userServices.resendotp)// add user to another collction
router.get('/address',userServices.address)// add user to another collction
router.get('/forgot-password',userServices.forgetpass)// add user to another collction
router.get('/forgetotp',userServices.forgetotp)// add user to another collction
router.get('/forgetsendotp',userServices.forgetsendotp)// add user to another collction
router.get('/userorders',userServices.userorders)// add user to another collction
router.get('/orderdetails',userServices.orderdetail)// add user to another collction
router.get('/user-wallet',userServices.userwallet)// add user to another collction
router.get('/addreview',userServices.addreview)// add user to another collction
router.get('/addtowallet',userServices.addtowallet)// add user to another collction
router.get('/order-sucess',userauth.orderauth,userServices.ordersuccess)// add user to another collction
router.post('/submit-order',userServices.submitorder)// add user to another collction
router.post('/deposit',userServices.deposit)// add user to another collction



//API



router.post('/api/registeruser',userController.newuser) //For creating new user
router.post('/api/reset-password',userController.resetpass) //For creating new user
router.post('/api/address',userController.addaddress) //For creating new user
router.post('/api/forgot-password',userController.forgetpass) //For creating new user
router.post('/api/aplaycoupon',coupon.aplaycoupon) //For creating new user
router.get('/api/deleteaddress',userController.deleteaddress) //For creating new user
router.get('/api/addtowallet',orderController.userwallet) //For creating new user
router.post('/api/login',userController.isUser) //For login the user
router.get("/api/userorder",orderController.userod);
router.get("/api/showproductuser", addproduct.find);
router.get('/api/cancelorder',userServices.cancelorder)
router.get("/api/ourstore", addproduct.ourstore);
router.get("/api/user", adminController.findusers);
router.get("/api/logout", adminController.logout);
router.get("/api/addtocart",cartContoller.create);
router.get("/api/wishlist",wishlist.create);
router.get("/api/removecart",cartContoller.delete);
router.get("/api/removewish",wishlist.delete);
router.get("/api/cartshow",cartContoller.find);
router.get("/api/listshow",wishlist.find);
router.get("/api/product-details",cartContoller.findid);
router.get("/api/wishid",wishlist.findid);
router.get("/api/addwtoc",wishlist.findid1);
router.get("/api/addctow",cartContoller.findid1);
router.get("/api/order",orderController.create);
router.get("/count-update",cartContoller.quantityUpdate);
router.get("/api/compare",otpContoller.compare);
router.get("/api/invoice",orderController.createpdf);
router.post("/api/forgetcompare",otpContoller.forgetcompare);
router.post("/api/pricefilter",userServices.filter);
router.post('/api/review',addproduct.addreview)// add user to another collction








module.exports = router
