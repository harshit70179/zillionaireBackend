let db = require("../../config/db");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);

exports.getHeader = async (req, res) => {
    try {
        const getQuery = "SELECT * FROM main_category"
        const getData = await dbQueryAsync(getQuery)
        if (getData.length > 0) {
            let arr = []
            for (const mainCategory of getData) {
                let categoryData = await getCategory(mainCategory.id)
                let categoryArr = []
                if (categoryData.length > 0) {
                    for (const category of categoryData) {
                        let subCategoryData = await getSubCategory(mainCategory.id, category.id)
                        if (subCategoryData.length > 0) {
                            categoryArr.push({ category_id: category.id, category_name: category.name, sub_category: subCategoryData })
                        }
                        else {
                            categoryArr.push({ category_id: category.id, category_name: category.name, sub_category: [] })
                        }
                    }
                    arr.push({ id: mainCategory.id, main_category_name: mainCategory.name, category: categoryArr })
                }
                else {
                    arr.push({ id: mainCategory.id, main_category_name: mainCategory.name, category: categoryArr })
                }
            }
            return res.send({ status: true, data: arr, message: "Record found successfully" })
        }
        else {
            return res.send({ status: false, message: "No record found" })
        }
    } catch (error) {
        return res.send({ status: false, message: "Internal server error" })
    }
}

const getCategory = async (main_category_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = "SELECT * FROM category WHERE main_category_id=?"
            let getData = await dbQueryAsync(query, [main_category_id])
            resolve(getData)
        } catch (error) {
            reject(error)
        }
    })
}

const getSubCategory = async (main_category_id, category_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = "SELECT * FROM sub_category WHERE main_category_id=? AND category_id=?"
            let getData = await dbQueryAsync(query, [main_category_id, category_id])
            resolve(getData)
        } catch (error) {
            reject(error)
        }
    })
}