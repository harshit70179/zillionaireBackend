const express = require("express");
const loginCtrl= require("../controller/user/auth");
const bannerCtrl= require("../controller/user/banner");
const headerCtrl= require("../controller/user/header");
const productCtrl= require("../controller/user/products");
const VerifyToken=require("../middleware/VerifyToken")

const router = express.Router();

router.post("/user-register",loginCtrl.userRegister);
router.post("/user-login",loginCtrl.userLogin);
router.post("/user-change-password",VerifyToken,loginCtrl.userChangePassword);

//============================== Banner =================
router.get("/get-top-banner",bannerCtrl.getTopBanner)
router.get("/get-middle-banner",bannerCtrl.getMiddleBanner)
router.get("/get-lower-banner",bannerCtrl.getLowerBanner)

//============================== Header ================= 
router.get("/get-header",headerCtrl.getHeader)

//=============================== Products ===================
router.post("/get-products",productCtrl.getProducts)
router.get("/get-product-by-id/:id",productCtrl.getProductById)


module.exports = router;