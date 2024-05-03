let db = require("../../config/db");
const util = require("util");
const { activeType } = require("../../config/enum");
const dbQueryAsync = util.promisify(db.query).bind(db);

exports.getFaq = async (req, res) => {
  try {
    const query = "SELECT question AS title,answer AS content FROM faq WHERE status=? ORDER BY id DESC";
    const getData = await dbQueryAsync(query,[activeType.active]);
    if (getData.length > 0) {
      return res.send({
        status: true,
        message: "Record found successfully",
        data: getData,
      });
    } else {
      return res.send({ status: false, message: "No record found" });
    }
  } catch (error) {
    return res.send({ status: false, message: error });
  }
};

