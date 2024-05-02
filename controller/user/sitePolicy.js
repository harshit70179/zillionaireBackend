let db = require("../../config/db");

exports.getSitePolicy = async (req, res) => {
  let getQuery = "SELECT * FROM site_policy";
  db.query(getQuery, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        return res.send({
          status: true,
          data: result,
          message: "Record found successfully",
        });
      } else {
        return res.send({ status: false, message: "No record found" });
      }
    }
  });
};