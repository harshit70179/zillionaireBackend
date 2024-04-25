const express = require("express");
const loginCtrl= require("../controller/admin/login");
const bannerCtrl= require("../controller/admin/banner");
const userCtrl= require("../controller/admin/user");
const mainCatCtrl= require("../controller/admin/mainCategory");
const catCtrl= require("../controller/admin/category");
const subCatCtrl= require("../controller/admin/subCategory");
const productCtrl= require("../controller/admin/products");
const homeTitleCtrl= require("../controller/admin/homeTitle");
const dashboardCtrl= require("../controller/admin/dashboard");
const VerifyToken=require("../middleware/VerifyToken");

const router = express.Router();

router.post("/login",loginCtrl.login);
router.post("/change-password",VerifyToken,loginCtrl.changePassword);

//=========================== Banner ============================
router.get("/get-dashboard",VerifyToken,dashboardCtrl.dashboard)

//=========================== Banner ============================
router.post("/insert-banner",VerifyToken,bannerCtrl.addBanner)
router.get("/get-banner",VerifyToken,bannerCtrl.getBanner)
router.delete("/delete-banner/:id",VerifyToken,bannerCtrl.deteleBanner)
router.put("/update-banner/:id/:show_banner",VerifyToken,bannerCtrl.updateBannerStatus)

//========================= User ================================
router.get("/get-users",VerifyToken,userCtrl.getUsers)

//========================== Main Category ==========================
router.post("/insert-main-category",VerifyToken,mainCatCtrl.addMainCategory)
router.get("/get-main-category",VerifyToken,mainCatCtrl.getMainCategory)
router.put("/update-main-category",VerifyToken,mainCatCtrl.updateMainCategory)

//==========================Category ==========================
router.post("/insert-category",VerifyToken,catCtrl.addCategory)
router.get("/get-category",VerifyToken,catCtrl.getCategory)
router.put("/update-category",VerifyToken,catCtrl.updateCategory)

//========================== Sub Category ==========================
router.post("/insert-sub-category",VerifyToken,subCatCtrl.addSubCategory)
router.get("/get-sub-category",VerifyToken,subCatCtrl.getSubCategory)
router.put("/update-sub-category",VerifyToken,subCatCtrl.updateSubCategory)

//========================== Products =========================== 
router.post("/insert-product",VerifyToken,productCtrl.addProducts)
router.get("/get-products",VerifyToken,productCtrl.getProducts)
router.get("/get-product-by-id/:id",VerifyToken,productCtrl.getProductById)

//============================ Home Title =======================
router.post("/insert-home-title",VerifyToken,homeTitleCtrl.addHomeTitle)
router.get("/get-home-title",VerifyToken,homeTitleCtrl.getHomeTitle)
router.get("/get-home-title-by-id/:id",VerifyToken,homeTitleCtrl.getHomeTitleById)
router.delete("/delete-home-title/:id",VerifyToken,homeTitleCtrl.deleteHomeTitle)
router.put("/update-home-title-staus/:id",VerifyToken,homeTitleCtrl.updateHomeTitleStatus)
router.put("/update-home-title",VerifyToken,homeTitleCtrl.updateHomeTitle)
router.post("/add-home-product",VerifyToken,homeTitleCtrl.addHomeProduct)

module.exports = router;