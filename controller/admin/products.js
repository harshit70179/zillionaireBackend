let db = require("../../config/db");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);
const multer = require("multer");
const path = require("path");
const { baseurl } = require("../../config/baseUrl");

exports.addProducts = async (req, res) => {
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "./public/product");
      },

      // By default, multer removes file extensions so let's add them back
      filename: function (req, file, cb) {
        var imageName =
          file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        cb(null, imageName);
      },
    });

    const upload = multer({
      storage: storage,
    }).fields([{ name: "images", maxCount: undefined }]);
    upload(req, res, async function (err) {
      const { title, description, price, main_category_id, category_id, sub_category_id,short_description } = req.body;
      let arr = [];

      for (let i = 0; i < req.files.images.length; i++) {
        arr.push(baseurl+"product/" + req.files.images[i].filename);
      }
      const insertQuery =
        "INSERT INTO products(title,description,images,price,main_category_id,category_id,sub_category_id,short_description) VALUES(?,?,?,?,?,?,?,?)";
      const inserRow = await dbQueryAsync(insertQuery, [
        title,
        description,
        JSON.stringify(arr),
        price,
        main_category_id, category_id, sub_category_id,short_description
      ]);
      if (inserRow) {
        return res.send({
          status: true,
          message: "Product added successfully",
        });
      }
    });
  } catch (error) {
    return req.send({ status: false, message: error });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const query = "SELECT products.*,main_category.name AS main_category_name,category.name AS category_name FROM products LEFT JOIN main_category ON products.main_category_id=main_category.id LEFT JOIN category ON category.id=products.category_id ORDER BY products.id DESC";
    const getData = await dbQueryAsync(query);
    if (getData.length > 0) {
      return res.send({
        status: true,
        message: "Record found successfully",
        data: getData,
      });
    } else {
      return res.send({
        status: false,
        message: "No record found",
        data: getData,
      });
    }
  } catch (error) {
    return res.send({ status: false, message: error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id
    const query = "SELECT * FROM products WHERE id=?";
    const getData = await dbQueryAsync(query, [id]);
    if (getData.length > 0) {
      return res.send({
        status: true,
        message: "Record found successfully",
        data: getData,
      });
    } else {
      return res.send({
        status: false,
        message: "No record found",
        data: getData,
      });
    }
  } catch (error) {
    return res.send({ status: false, message: error });
  }
};

exports.updateProducts = async (req, res) => {
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "./public/product");
      },

      // By default, multer removes file extensions so let's add them back
      filename: function (req, file, cb) {
        var imageName =
          file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        cb(null, imageName);
      },
    });

    const upload = multer({
      storage: storage,
    }).fields([{ name: "images", maxCount: undefined }]);
    upload(req, res, async function (err) {
      const { title, description, price, main_category_id, category_id, sub_category_id,short_description,id } = req.body;
      let arr = [];
      if(req.files?.images){
        for (let i = 0; i < req.files?.images.length; i++) {
          arr.push(baseurl+"product/" + req.files.images[i].filename);
        }
      }
      let dbImage = JSON.parse(req.body.db_image);
      let concatImage = arr.concat(dbImage);
      const updateQuery =
        "UPDATE products SET title=?,description=?,images=?,price=?,main_category_id=?,category_id=?,sub_category_id=?,short_description=? WHERE id=?";
      const updateRow = await dbQueryAsync(updateQuery, [
        title,
        description,
        JSON.stringify(concatImage),
        price,
        main_category_id, category_id, sub_category_id,short_description,id
      ]);
      if (updateRow) {
        return res.send({
          status: true,
          message: "Product updated successfully",
        });
      }
    });
  } catch (error) {
    return req.send({ status: false, message: error });
  }
};

