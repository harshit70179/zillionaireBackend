let db = require("../../config/db");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);

exports.getProducts = async (req, res) => {
    try {
        const { main_category_id, category_id, sub_category_id } = req.body
        let query;
        let data;
        if (main_category_id && category_id && sub_category_id) {
            query = "SELECT products.*,main_category.name AS main_category_name,category.name AS category_name,sub_category.name AS sub_category_name FROM products LEFT JOIN main_category ON main_category.id=products.main_category_id LEFT JOIN category ON category.id=products.category_id LEFT JOIN sub_category ON sub_category.id=products.sub_category_id WHERE products.main_category_id=? AND products.category_id=? AND products.sub_category_id=? ORDER BY products.id DESC"
            data = [main_category_id, category_id, sub_category_id]
        }
        else if (main_category_id && category_id) {
            query = "SELECT products.*,main_category.name AS main_category_name,category.name AS category_name,sub_category.name AS sub_category_name FROM products LEFT JOIN main_category ON main_category.id=products.main_category_id LEFT JOIN category ON category.id=products.category_id LEFT JOIN sub_category ON sub_category.id=products.sub_category_id WHERE products.main_category_id=? AND products.category_id=? ORDER BY products.id DESC"
            data = [main_category_id, category_id]
        }
        else if (main_category_id) {
            query = "SELECT products.*,main_category.name AS main_category_name,category.name AS category_name,sub_category.name AS sub_category_name FROM products LEFT JOIN main_category ON main_category.id=products.main_category_id LEFT JOIN category ON category.id=products.category_id LEFT JOIN sub_category ON sub_category.id=products.sub_category_id WHERE products.main_category_id=? ORDER BY products.id DESC"
            data = [main_category_id]
        }
        let getData = await dbQueryAsync(query, data)
        if (getData.length > 0) {
            return res.send({ status: true, message: "Record found successfully",data:getData })
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
        const query = "SELECT products.*,main_category.name AS main_category_name,category.name AS category_name,sub_category.name AS sub_category_name FROM products LEFT JOIN main_category ON main_category.id=products.main_category_id LEFT JOIN category ON category.id=products.category_id LEFT JOIN sub_category ON sub_category.id=products.sub_category_id WHERE products.id=?"
        const data = [id]
        let getData = await dbQueryAsync(query, data)
        if (getData.length > 0) {
            return res.send({ status: true, message: "Record found successfully",data:getData })
        }
        else {
            return res.send({ status: false, message: "No record found" })
        }
    } catch (error) {
        return res.send({ status: false, message: error })
    }
}