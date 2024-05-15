let db = require("../../config/db");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);
const multer = require("multer");
const path = require("path");
const { baseurl } = require("../../config/baseUrl");
const { activeType } = require("../../config/enum");
exports.addExplore = async (req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/explore/");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  let upload = multer({ storage: storage }).fields([{ name: "explore_image" }]);
  upload(req, res, async function (err) {

    var exploreimages = req.files.explore_image[0].filename;
    let exploreLink = baseurl + "explore/" + exploreimages
    const getQuery="SELECT * FROM explore WHERE main_category_id=?"
    const getData=await dbQueryAsync(getQuery,[req.body.main_category_id])
    if(getData.length>0){
       return res.send({status:false,message:"This category already exist"})
    }
    const query =
      "insert into explore(main_category_id,image) values(?,?)";
    const insertRow = await dbQueryAsync(query, [req.body.main_category_id, exploreLink])
    if (insertRow) {
      return res.send({
        status: true,
        message: "Explore added successfully",
        data: insertRow,
      });
    }
  });
};

exports.getExplore = async (req, res) => {
  const query = "SELECT explore.*,main_category.name FROM explore LEFT JOIN main_category ON main_category.id=explore.main_category_id ORDER BY explore.id DESC";
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

exports.deteleExplore = async (req, res) => {
  const query = "DELETE FROM explore WHERE id=?";
  const deleteRow = await dbQueryAsync(query, [req.params.id])
  if (deleteRow) {
    return res.send({
      status: true,
      message: "Explore deleted successfully",
      data: deleteRow,
    });
  }
};

exports.updateExporeStatus = async (req, res) => {
  const id = req.params.id
  const checkquery = "SELECT * FROM explore WHERE id=?";
  const checkData = await dbQueryAsync(checkquery, [id])
  if (checkData.length > 0) {
    var status;
    if (checkData[0].status == activeType.active) {
      status = activeType.inActive;
    }
    if (checkData[0].status == activeType.inActive) {
      status = activeType.active;
    }
    const updateQuery = "UPDATE explore SET status = ?  WHERE id =?";
    const updateRow = await dbQueryAsync(updateQuery, [status, id])
    if (updateRow) {
      return res.send({
        status: true,
        message: "Explore status updated successfully",
        data: updateRow,
      });
    }

  } else {
    return res.send({ status: false, message: "No records found" });
  }
};


