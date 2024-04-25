let db = require("../../config/db");
const util = require("util");
const { activeType, showBannerType } = require("../../config/enum");
const dbQueryAsync = util.promisify(db.query).bind(db);

exports.getBanner = async (req, res) => {
  const query = "SELECT * FROM banner WHERE status=? ORDER BY id DESC";
  const getData = await dbQueryAsync(query, [activeType.active])
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

exports.getTopBanner = async (req, res) => {
  const query = "SELECT * FROM banner WHERE status=? AND show_banner=? ORDER BY id DESC";
  const getData = await dbQueryAsync(query, [activeType.active, showBannerType.top])
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
exports.getMiddleBanner = async (req, res) => {
  const query = "SELECT * FROM banner WHERE status=? AND show_banner=? ORDER BY id DESC";
  const getData = await dbQueryAsync(query, [activeType.active, showBannerType.middle])
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
exports.getLowerBanner = async (req, res) => {
  const query = "SELECT * FROM banner WHERE status=? AND show_banner=? ORDER BY id DESC";
  const getData = await dbQueryAsync(query, [activeType.active, showBannerType.lower])
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