let db = require("../../config/db");
const util = require("util");
const { activeType } = require("../../config/enum");
const dbQueryAsync = util.promisify(db.query).bind(db);

exports.insertFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const query = "INSERT INTO faq(question,answer) VALUES(?,?)";
    const addRow = await dbQueryAsync(query, [question, answer]);
    if (addRow) {
      return res.send({ status: true, message: "Faq added successfully" });
    }
  } catch (error) {
    return res.send({ status: false, message: error });
  }
};

exports.getFaq = async (req, res) => {
  try {
    const query = "SELECT * FROM faq ORDER BY id DESC";
    const getData = await dbQueryAsync(query);
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

exports.deleteFaq = async (req, res) => {
  try {
    const id = req.params.id;
    const query = "DELETE FROM faq WHERE id=?";
    const deleteRow = await dbQueryAsync(query, [id]);
    if (deleteRow) {
      return res.send({ status: true, message: "Faq deleted successfully" });
    }
  } catch (error) {
    return res.send({ status: false, message: error });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const getQuery = "SELECT * FROM faq WHERE id=?";
    const getData = await dbQueryAsync(getQuery, [id]);
    if (getData.length > 0) {
      let status;
      if (getData[0].status == activeType.active) {
        status = activeType.inActive;
      } else {
        status = activeType.active;
      }
      const updateQuery = "UPDATE faq SET status=? WHERE id=?";
      const updateRow = await dbQueryAsync(updateQuery, [status, id]);
      if (updateRow) {
        return res.send({
          status: true,
          message: "Status updated successfully",
        });
      }
    } else {
      return res.send({ status: false, message: "No record found" });
    }
  } catch (error) {
    return res.send({ status: false, message: error });
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const { id, question, answer } = req.body;
    const query = "UPDATE faq SET question=?,answer=? WHERE id=?";
    const updateRow = await dbQueryAsync(query, [question, answer, id]);
    if (updateRow) {
      return res.send({ status: true, message: "Faq updated successfully" });
    }
  } catch (error) {
    return res.send({ status: false, message: error });
  }
};
