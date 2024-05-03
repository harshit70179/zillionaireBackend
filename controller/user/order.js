let db = require("../../config/db");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);

function generateOrderId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let orderId = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        orderId += characters[randomIndex];
    }

    return orderId;
}

exports.addOrder = async (req, res) => {
    try {
        const userId = req.loginUserId;
        const { email, first_name, last_name, mobile_number, address, total, grand_total, discount, shipping, product_items } = req.body
        const order_id = "#" + generateOrderId(8)
        const insertQuery = "INSERT INTO order_history(user_id,order_id,email,first_name,last_name,mobile_number,address,total,grand_total,discount,shipping,product_items,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)"
        const insertRow = await dbQueryAsync(insertQuery, [userId, order_id, email, first_name, last_name, mobile_number, address, total, grand_total, discount, shipping, product_items, "Pending"])
        if (insertRow) {
            return res.send({ status: true, message: "Order Place successfully" })
        }
    } catch (error) {
        return res.send({ status: false, message: error })
    }
}

exports.getOrderHistory = async (req, res) => {
    try {
        const userId = req.loginUserId;
        const getQuery = "SELECT * FROM order_history WHERE user_id=? ORDER BY id DESC"
        const getData = await dbQueryAsync(getQuery, [userId])
        if (getData.length > 0) {
            return res.send({ status: true, message: "Record found successfully", data: getData })
        }
        else {
            return res.send({ status: false, message: "No record found", data: getData })
        }
    } catch (error) {
        return res.send({ status: false, message: error })
    }
}
