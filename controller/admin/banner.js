let db = require("../../config/db");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);
const multer = require("multer");
const path = require("path");
const { baseurl } = require("../../config/baseUrl");
const { activeType, showBannerType } = require("../../config/enum");
exports.addBanner = async (req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/banner/");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  let upload = multer({ storage: storage }).fields([{ name: "banner_image" }]);
  upload(req, res, async function (err) {

    var bannerimages = req.files.banner_image[0].filename;
    let bannerLink = baseurl + "banner/" + bannerimages
    const query =
      "insert into banner(title,image,type,show_banner) values(?,?,?,?)";
    const insertRow = await dbQueryAsync(query, [req.body.title, bannerLink, req.body.type, req.body.show_banner])
    if (insertRow) {
      return res.send({
        status: true,
        message: "Banner added successfully",
        data: insertRow,
      });
    }
  });
};

exports.getBanner = async (req, res) => {
  const query = "SELECT * FROM banner ORDER BY id DESC";
  const getData = await dbQueryAsync(query)
  if (getData.length > 0) {
    return res.send({
      status: true,
      message: "Record found successfully",
      data: getData,
    });
  } else {
    return res.send({
      status: false,
      message: "No records found",
      data: getData,
    });
  }
};

exports.deteleBanner = async (req, res) => {
  const query = "DELETE FROM banner WHERE id=?";
  const deleteRow = await dbQueryAsync(query, [req.params.id])
  if (deleteRow) {
    return res.send({
      status: true,
      message: "Banner deleted successfully",
      data: result,
    });
  }
};

exports.updateBannerStatus = async (req, res) => {
  const id = req.params.id
  const showBanner = req.params.show_banner
  const checkquery = "SELECT * FROM banner WHERE id=?";
  const checkData = await dbQueryAsync(checkquery, [id])
  if (checkData.length > 0) {
    if (showBanner != showBannerType.top) {
      const updateAllquery = "UPDATE banner SET status = ?  WHERE show_banner =?"
      const updateData = await dbQueryAsync(updateAllquery, [activeType.inActive, showBanner])
    }
    var status;
    if (checkData[0].status == activeType.active) {
      status = activeType.inActive;
    }
    if (checkData[0].status == activeType.inActive) {
      status = activeType.active;
    }
    const updateQuery = "UPDATE banner SET status = ?  WHERE id =?";
    const updateRow = await dbQueryAsync(updateQuery, [status, id])
    if (updateRow) {
      return res.send({
        status: true,
        message: "Banner status updated successfully",
        data: updateRow,
      });
    }

  } else {
    return res.send({ status: false, message: "No records found" });
  }
};


