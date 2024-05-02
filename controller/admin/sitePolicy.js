let db = require("../../config/db");

exports.updateAddSitePolicy = async (req, res) => {
  const {
    shipping,
    tac,
    return_policy,
  } = req.body;
  let getQuery = "SELECT * FROM site_policy";
  db.query(getQuery, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        let updateQuery =
          "UPDATE site_policy SET shipping=?,return_policy=?,TAC=? WHERE id=?";
        db.query(
          updateQuery,
          [
            shipping,
            return_policy,
            tac,
            result[0].id,
          ],
          (err, updateResult) => {
            if (err) {
              console.log(err);
            } else {
              if (updateResult) {
                return res.send({
                  status: true,
                  message: "Site policy updated successfully",
                });
              }
            }
          }
        );
      } else {
        let insertQuery =
          "INSERT INTO site_policy(return_policy,shipping,TAC) VALUES(?,?,?)";
        db.query(
          insertQuery,
          [
            return_policy,
            shipping,
            tac,
          ],
          (err, insertResult) => {
            if (err) {
              console.log(err);
            } else {
              if (insertResult) {
                return res.send({
                  status: true,
                  message: "Site policy added successfully",
                });
              }
            }
          }
        );
      }
    }
  });
};

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