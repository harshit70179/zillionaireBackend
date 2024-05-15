let db = require("../../config/db");
const bcrypt = require("bcryptjs");
const { userType } = require("../../config/enum");

exports.getRoleList = async (req, res) => {
    let query = "SELECT * FROM user WHERE user_type=?";
    db.query(query, [userType.Staff], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length > 0) {
                return res.send({
                    status: true,
                    message: "Record found successfully",
                    data: result,
                });
            } else {
                return res.send({ status: false, message: "No record found" });
            }
        }
    });
};

exports.addRole = async (req, res) => {
    const {
        user_name,
        email,
        mobile_number,
        password,
        is_dashboard,
        is_user_management,
        is_order_history,
        is_explore,
        is_products,
        is_hometitle,
        is_category,
        is_banner,
        is_faq,
        is_sitepolicy
    } = req.body;
    if (!user_name) {
        return res.send({ status: false, message: "Name is required" });
    }
    if (!email) {
        return res.send({ status: false, message: "Email is required" });
    }
    if (!mobile_number) {
        return res.send({ status: false, message: "Mobile number is required" });
    }
    if (!password) {
        return res.send({ status: false, message: "Password is required" });
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hashpassword = await bcrypt.hashSync(password, salt);
    let checkEmail = "SELECt * FROM user WHERE email=?";
    let checkMobile = "SELECt * FROM user WHERE mobile_number=?";
    db.query(checkEmail, [email], (err, emailRes) => {
        if (err) {
            console.log(err);
        } else {
            if (emailRes.length > 0) {
                return res.send({ status: false, message: "This email already exist" });
            } else {
                db.query(checkMobile, [email], (err, mobileRes) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (mobileRes.length > 0) {
                            return res.send({
                                status: false,
                                message: "This mobile number already exist",
                            });
                        } else {
                            let insertQuery =
                                "INSERT INTO user(user_name,email,mobile_number,password,is_dashboard ,is_user_management,is_order_history,is_explore,is_products,is_hometitle,is_category,is_banner,is_faq,is_sitepolicy,user_type) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                            db.query(
                                insertQuery,
                                [
                                    user_name,
                                    email,
                                    mobile_number,
                                    hashpassword,
                                    is_dashboard,
                                    is_user_management,
                                    is_order_history,
                                    is_explore,
                                    is_products,
                                    is_hometitle,
                                    is_category,
                                    is_banner,
                                    is_faq,
                                    is_sitepolicy,
                                    userType.Staff,
                                ],
                                (err, result) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        return res.send({
                                            status: true,
                                            message: "Role added successfully",
                                        });
                                    }
                                }
                            );
                        }
                    }
                });
            }
        }
    });
};

exports.deleteRole = async (req, res) => {
    let query = "DELETE FROM user WHERE id=?";
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            return res.send({ status: true, message: "Role deleted successfully" });
        }
    });
};

exports.getRoleById = async (req, res) => {
    let query = "SELECT * FROM user WHERE id=?";
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length > 0) {
                return res.send({
                    status: true,
                    message: "Record found successfully",
                    data: result,
                });
            } else {
                return res.send({ status: false, message: "No record found" });
            }
        }
    });
};

exports.updateRole = async (req, res) => {
    const {
        password,
        is_dashboard,
        is_user_management,
        is_order_history,
        is_explore,
        is_products,
        is_hometitle,
        is_category,
        is_banner,
        is_faq,
        is_sitepolicy,
        id,
    } = req.body;
    if (password) {
        const saltRounds = 10;
        const salt = await bcrypt.genSaltSync(saltRounds);
        const hashpassword = await bcrypt.hashSync(password, salt);
        let updatequery =
            "UPDATE user SET password=?,is_dashboard=?,is_user_management=?,is_order_history=?,is_explore=?,is_products=?,is_hometitle=?,is_category=?,is_banner=?,is_faq=?,is_sitepolicy=? WHERE id=?";
        db.query(
            updatequery,
            [
                hashpassword,
                is_dashboard,
                is_user_management,
                is_order_history,
                is_explore,
                is_products,
                is_hometitle,
                is_category,
                is_banner,
                is_faq,
                is_sitepolicy,
                id,
            ],
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    return res.send({
                        status: true,
                        message: "Role updated successfully",
                    });
                }
            }
        );
    } else {
        let updatequery =
            "UPDATE user SET is_dashboard=?,is_user_management=?,is_order_history=?,is_explore=?,is_products=?,is_hometitle=?,is_category=?,is_banner=?,is_faq=?,is_sitepolicy=? WHERE id=?";
        db.query(
            updatequery,
            [
                is_dashboard,
                is_user_management,
                is_order_history,
                is_explore,
                is_products,
                is_hometitle,
                is_category,
                is_banner,
                is_faq,
                is_sitepolicy,
                id,
            ],
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    return res.send({
                        status: true,
                        message: "Role updated successfully",
                    });
                }
            }
        );
    }
};
