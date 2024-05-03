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
const sitePolicyCtrl= require("../controller/admin/sitePolicy");
const faqCtrl= require("../controller/admin/faq");
const orderCtrl= require("../controller/admin/order");
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
router.put("/update-main-category-status/:id",VerifyToken,mainCatCtrl.updateMainCategoryStatus)

//==========================Category ==========================
router.post("/insert-category",VerifyToken,catCtrl.addCategory)
router.get("/get-category",VerifyToken,catCtrl.getCategory)
router.put("/update-category",VerifyToken,catCtrl.updateCategory)
router.put("/update-category-status/:id",VerifyToken,catCtrl.updateCategoryStatus)

//========================== Sub Category ==========================
router.post("/insert-sub-category",VerifyToken,subCatCtrl.addSubCategory)
router.get("/get-sub-category",VerifyToken,subCatCtrl.getSubCategory)
router.put("/update-sub-category",VerifyToken,subCatCtrl.updateSubCategory)
router.put("/update-sub-category-status/:id",VerifyToken,subCatCtrl.updateSubCategoryStatus)

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

//========================== Site Policy ===============================
router.post("/add-update-sitepolicy",VerifyToken,sitePolicyCtrl.updateAddSitePolicy)
router.get("/get-sitepolicy",VerifyToken,sitePolicyCtrl.getSitePolicy)

//=================== FAQ =================== 
router.post("/add-faq",VerifyToken,faqCtrl.insertFaq);
router.get("/get-faq",VerifyToken,faqCtrl.getFaq);
router.delete("/delete-faq/:id",VerifyToken,faqCtrl.deleteFaq)
router.put("/update-faq-status/:id",VerifyToken,faqCtrl.updateStatus)
router.put("/update-faq",VerifyToken,faqCtrl.updateFaq)

//=================== Order ======================
router.get("/get-order/:status",VerifyToken,orderCtrl.getOrder)

module.exports = router;
