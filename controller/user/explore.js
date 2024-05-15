let db = require("../../config/db");
const util = require("util");
const { activeType } = require("../../config/enum");
const dbQueryAsync = util.promisify(db.query).bind(db);

exports.getExplore = async (req, res) => {
  const query = "SELECT explore.*,main_category.name FROM explore LEFT JOIN main_category ON main_category.id=explore.main_category_id WHERE explore.status=?";
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