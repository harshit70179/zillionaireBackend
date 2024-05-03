let db = require("../../config/db");
const util = require("util");
const { activeType } = require("../../config/enum");
const dbQueryAsync = util.promisify(db.query).bind(db);

exports.addMainCategory = async (req, res) => {
    try {
        const { name } = req.body
        const query = "INSERT INTO main_category(name) VALUES(?)"
        const insertRow = await dbQueryAsync(query, [name])
        if (insertRow) {
            return res.send({ status: true, messgae: "Main category added successfully" })
        }
    } catch (error) {
        return res.status(400).send({ status: false, message: "Internal server error" })
    }
}

exports.getMainCategory = async (req, res) => {
    try {
        const query = "SELECT * FROM main_category"
        const getData = await dbQueryAsync(query)
        if (getData) {
            return res.send({ status: true, message: "Record found successfully", data: getData })
        }
        else {
            return res.send({ status: false, message: "NO record found", data: getData })
        }
    } catch (error) {
        return res.status(400).send({ status: false, message: "Internal server error" })
    }

}

exports.updateMainCategory = async (req, res) => {
    try {
        const { name, id } = req.body
        const query = "UPDATE main_category SET name=? WHERE id=?"
        const updateRow = await dbQueryAsync(query, [name, id])
        if (updateRow) {
            return res.send({ status: true, messgae: "Main category updated successfully" })
        }
    } catch (error) {
        return res.status(400).send({ status: false, message: "Internal server error" })
    }
}

exports.updateMainCategoryStatus = async (req, res) => {
    const id = req.params.id
    const checkquery = "SELECT * FROM main_category WHERE id=?";
    const checkData = await dbQueryAsync(checkquery, [id])
    if (checkData.length > 0) {
        var status;
        if (checkData[0].status == activeType.active) {
            status = activeType.inActive;
        }
        if (checkData[0].status == activeType.inActive) {
            status = activeType.active;
        }
        const updateQuery = "UPDATE main_category SET status = ?  WHERE id =?";
        const updateRow = await dbQueryAsync(updateQuery, [status, id])
        if (updateRow) {
            return res.send({
                status: true,
                message: "Main category status updated successfully",
                data: updateRow,
            });
        }

    } else {
        return res.send({ status: false, message: "No records found" });
    }
}; 