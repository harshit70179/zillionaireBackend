const express = require("express");
const loginCtrl= require("../controller/user/auth");
const bannerCtrl= require("../controller/user/banner");
const headerCtrl= require("../controller/user/header");
const productCtrl= require("../controller/user/products");
const homeCtrl= require("../controller/user/homeProduct");
const sitePolicyCtrl= require("../controller/user/sitePolicy");
const faqCtrl= require("../controller/user/faq");
const orderCtrl= require("../controller/user/order");
const socialCtrl= require("../controller/user/social");
const exploreCtrl= require("../controller/user/explore");
const VerifyToken=require("../middleware/VerifyToken")

const router = express.Router();

router.post("/user-register",loginCtrl.userRegister);
router.post("/user-login",loginCtrl.userLogin);
router.post("/user-change-password",VerifyToken,loginCtrl.userChangePassword);
router.get("/get-user-detail",VerifyToken,loginCtrl.getUserDetail)
router.get("/get-wish-list",VerifyToken,loginCtrl.getWishList)
router.post("/add-wish-list",VerifyToken,loginCtrl.addWishList)
router.post("/forget-password",loginCtrl.forgotPassowrd)
router.post("/user-verification",loginCtrl.userVerified)

//============================== Banner =================
router.get("/get-top-banner",bannerCtrl.getTopBanner)
router.get("/get-middle-banner",bannerCtrl.getMiddleBanner)
router.get("/get-lower-banner",bannerCtrl.getLowerBanner)

//============================== Header ================= 
router.get("/get-header",headerCtrl.getHeader)

//=============================== Products ===================
router.post("/get-products",productCtrl.getProducts)
router.get("/get-product-by-id/:id",productCtrl.getProductById)
router.get("/get-all-products",productCtrl.getAllProducts)

//========================= Home ==================
router.get("/get-home-product",homeCtrl.getHomeProduct)

//========================= Home ==================
router.get("/get-faq",faqCtrl.getFaq)

//========================= SitePolicy ==================
router.get("/get-sitepolicy",sitePolicyCtrl.getSitePolicy)
router.get("/footer-collection",sitePolicyCtrl.getFooterCollection)

//============================Order =======================
router.post("/add-order",VerifyToken,orderCtrl.addOrder)
router.get("/get-order",VerifyToken,orderCtrl.getOrderHistory)
router.get("/get-pdf/:id",VerifyToken,orderCtrl.getPdf)

//=========================== Social ========================
router.get("/get-social-media",socialCtrl.getSocialMedia)

//========================= Explore===================
router.get("/get-explore",exploreCtrl.getExplore)

module.exports = router;