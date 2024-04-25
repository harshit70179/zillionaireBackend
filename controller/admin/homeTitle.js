let db = require("../../config/db");
const util = require("util");
const { activeType } = require("../../config/enum");
const dbQueryAsync = util.promisify(db.query).bind(db);

exports.addHomeTitle = async (req, res) => {
    try {
        const { title } = req.body
        const getQuery = "SELECT * FROM home_title WHERE title=?"
        const getData = await dbQueryAsync(getQuery, [title])
        if (getData.length > 0) {
            return res.send({ status: false, message: "This title already exists" })
        }
        const query = "INSERT INTO home_title(title) VALUES(?)"
        const insertRow = await dbQueryAsync(query, [title])
        if (insertRow) {
            return res.send({ status: true, message: "Title added successfully" })
        }
    } catch (error) {
        return res.send({ status: false, message: error })
    }
}

exports.getHomeTitle = async (req, res) => {
    try {
        const getQuery = "SELECT * FROM home_title"
        const getData = await dbQueryAsync(getQuery)
        if (getData.length > 0) {
            return res.send({ status: true, message: "Record found successfully", data: getData })
        }
        else {
            return res.send({ status: false, message: "No record found" })
        }
    } catch (error) {
        return res.send({ status: false, message: error })
    }
}

exports.deleteHomeTitle = async (req, res) => {
    try {
        const id = req.params.id
        const query = "DELETE FROM home_title WHERE id=?"
        const deleteRow = await dbQueryAsync(query, [id])
        if (deleteRow) {
            return res.send({ status: true, message: "Title deleted successfully" })
        }
    } catch (error) {
        return res.send({ status: false, message: error })
    }
}

exports.updateHomeTitle = async (req, res) => {
    try {
        const { title, id } = req.body
        const query = "UPDATE home_title SET title=? WHERE id=?"
        const updateRow = await dbQueryAsync(query, [title, id])
        if (updateRow) {
            return res.send({ status: true, message: "Title update successfully" })
        }
    } catch (error) {
        console.log(error)
        return res.send({ status: false, message: error })
    }
}

exports.updateHomeTitleStatus = async (req, res) => {
    try {
        const id = req.params.id
        const getQuery = "SELECT * FROM home_title WHERE id=?"
        const getData = await dbQueryAsync(getQuery, [id])
        if (getData.length > 0) {
            var status;
            if (getData[0].status == activeType.active) {
                status = activeType.inActive;
            }
            if (getData[0].status == activeType.inActive) {
                status = activeType.active;
            }
            const query = "UPDATE home_title SET status=? WHERE id=?"
            const updateRow = await dbQueryAsync(query, [status, id])
            if (updateRow) {
                return res.send({ status: true, message: "Title status update successfully" })
            }
        }
    } catch (error) {
        return res.send({ status: false, message: error })
    }
}

exports.getHomeTitleById = async (req, res) => {
    try {
        const id=req.params.id
        const getQuery = "SELECT * FROM home_title WHERE id=?"
        const getData = await dbQueryAsync(getQuery,[id])
        if (getData.length > 0) {
            return res.send({ status: true, message: "Record found successfully", data: getData })
        }
        else {
            return res.send({ status: false, message: "No record found" })
        }
    } catch (error) {
        return res.send({ status: false, message: error })
    }
}

exports.addHomeProduct = async (req, res) => {
    try {
        const { product_ids, total_products, id } = req.body
        const updateQuery = "UPDATE home_title SET product_ids=?,total_products=? WHERE id=?"
        const updateRow = await dbQueryAsync(updateQuery, [product_ids, total_products, id])
        if (updateRow) {
            return res.send({ status: true, message: "Add home product successfully" })
        }
    } catch (error) {
        return res.send({ status: false, message: error })
    }
}
