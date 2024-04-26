let db = require("../../config/db");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);

exports.getProducts = async (req, res) => {
    try {
        const { main_category_id, category_id, sub_category_id } = req.body
        let query;
        let data;
        if (main_category_id && category_id && sub_category_id) {
            query = "SELECT * FROM products WHERE main_category_id=? AND category_id=? AND sub_category_id=? ORDER BY id DESC"
            data = [main_category_id, category_id, sub_category_id]
        }
        else if (main_category_id && category_id) {
            query = "SELECT * FROM products WHERE main_category_id=? AND category_id=? ORDER BY id DESC"
            data = [main_category_id, category_id]
        }
        else if (main_category_id) {
            query = "SELECT * FROM products WHERE main_category_id=? ORDER BY id DESC"
            data = [main_category_id]
        }
        let getData = await dbQueryAsync(query, data)
        if (getData.length > 0) {
            return res.send({ status: true, message: "Record found successfully" })
        }
        else {
            return res.send({ status: false, message: "No record found" })
        }
    } catch (error) {
        return res.send({ status: false, message: error })
    }
}

exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id
        const query = "SELECT * FROM products WHERE id=?"
        const data = [id]
        let getData = await dbQueryAsync(query, data)
        if (getData.length > 0) {
            return res.send({ status: true, message: "Record found successfully" })
        }
        else {
            return res.send({ status: false, message: "No record found" })
        }
    } catch (error) {
        return res.send({ status: false, message: error })
    }
}