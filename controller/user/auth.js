let db = require("../../config/db");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userType } = require("../../config/enum");
const configFile=require("../../config/jwt_config")

exports.userRegister = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body
        const lowerEmail = email.toLowerCase()
        const query = "SELECT * FROM user WHERE email=?"
        const getData = await dbQueryAsync(query, [lowerEmail])
        if (getData.length == 0) {
            let saltRounds = 10;
            const salt = await bcrypt.genSaltSync(saltRounds);
            const hashPassowrd = await bcrypt.hashSync(password, salt);
            const inserQuery = "INSERT INTO user(first_name,last_name,email,password,user_type,wish_list) VALUES(?,?,?,?,?,?)"
            const insertRow = await dbQueryAsync(inserQuery, [first_name, last_name, lowerEmail, hashPassowrd, userType.USer,JSON.stringify([])])
            if (insertRow) {
                return res.send({ status: true, message: "Your account has been registered please check your mail" })
            }
        }
        else {
            return res.send({ status: false, message: "This email is already exist" })
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: "Interal server error" })
    }
}

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const lowerEmail = email.toLowerCase()
        
        const getQuery = "SELECT * FROM user WHERE email=? AND user_type=?";
        const checkResult = await dbQueryAsync(getQuery, [lowerEmail, userType.USer])
        if (checkResult.length > 0) {
            const passwordcompare = await bcrypt.compare(
                password,
                checkResult[0].password
            );
           
            if (!passwordcompare) {
                res.send({
                    status: false,
                    message: "Please try to login with corrent crediential",
                });
            } else {
                const data = {
                    id: checkResult[0].id,
                };
                const token = jwt.sign(data, configFile.secret);
                return res.send({
                    status: true,
                    authtoken: token,
                    type: checkResult[0].user_type,
                    wish_list:checkResult[0].wish_list,
                    message: "Your account login successfully",
                });
            }
        } else {
            return res.send({
                status: false,
                message: "Please try to login with corrent crediential",
            });
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: "Interal server error" });
    }
};

exports.userChangePassword = async (req, res) => {
    const userId = req.loginUserId;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    try {
        if (!oldPassword) {
            return res.send({
                status: false,
                message: "Current password is required",
            });
        }
        if (!newPassword) {
            return res.send({ status: false, message: "New password is required" });
        }
        if (!confirmPassword) {
            return res.send({
                status: false,
                message: "Confirm password is required",
            });
        }
        if (confirmPassword != newPassword) {
            return res.send({
                status: false,
                message: "Confirm password doesn't match",
            });
        }
        const getQuery = "SELECT * FROM user WHERE id=?";
        const getData = await dbQueryAsync(getQuery, [userId])
        if (getData.length > 0) {
            const passwordcompare = await bcrypt.compare(
                oldPassword,
                getData[0].password
            );
            if (!passwordcompare) {
                return res.send({
                    success: false,
                    error: "Please try to correct old password",
                });
            } else {
                const saltRounds = 10;
                const salt = await bcrypt.genSaltSync(saltRounds);
                const newhashpassword = await bcrypt.hashSync(newPassword, salt);
                const oldpasswordcompare = await bcrypt.compare(
                    oldPassword,
                    newhashpassword
                );
                if (oldpasswordcompare) {
                    return res.send({
                        success: false,
                        error: "Please enter different password",
                    });
                } else {
                    const updateQuery = "UPDATE user SET password=? WHERE id=?";
                    const updateRow = await dbQueryAsync(updateQuery, [newhashpassword, userId])
                    if (updateRow) {
                        return res.send({
                            status: true,
                            message: "Password changed successfully",
                        });
                    }
                }
            }
        }
        else {
            return res.send({ status: false, message: "No record found" })
        }
    } catch (error) {
        res.status(500).send({ staus: false, message: "Internalserver Error" });
    }
};

exports.getUserDetail=async(req,res)=>{
    try {
        const userId = req.loginUserId;
        const getQuery="SELECT first_name,last_name,email,user_type FROM user WHERE id=?"
        const getData=await dbQueryAsync(getQuery,[userId])
        if(getData.length>0){
            return res.send({status:true,message:"Record found successfully",data:getData})
        }
        else{
            return res.send({status:false,message:"No record found"})
        }
    } catch (error) {
         return res.status(400).send({status:false,message:error})
    }
}

exports.getWishList=async(req,res)=>{
    try {
        const userId = req.loginUserId;
        const getQuery="SELECT wish_list FROM user WHERE id=?"
        const getData=await dbQueryAsync(getQuery,[userId])
        if(getData.length>0){
            if(getData[0].wish_list){
                let productIds=JSON.parse(getData[0].wish_list)
                const idList = productIds.join(',');
                const productList=await getProducts(idList)
                return res.send({status:true,message:"Record found successfully",data:productList})
            }
            else{
                return res.send({status:false,message:"No record found"})
            }
        }
        else{
            return res.send({status:false,message:"No record found"})
        }
        
    } catch (error) {
      return res.send({status:false,message:error})  
    } 
}

const getProducts=async(idList)=>{
    return new Promise(async(resolve, reject) => {
           try {
             let query=`SELECT products.*,main_category.name AS main_category_name,category.name AS category_name,sub_category.name AS sub_category_name FROM products LEFT JOIN main_category ON main_category.id=products.main_category_id LEFT JOIN category ON category.id=products.category_id LEFT JOIN sub_category ON sub_category.id=products.sub_category_id WHERE products.id IN (${idList});`;
             let getData=await dbQueryAsync(query)
             resolve(getData)
           } catch (error) {
            reject(error)
           }
    })
}

exports.addWishList=async(req,res)=>{
    try {
        const userId = req.loginUserId;
        const {wish_list}=req.body
        const updateQuery="UPDATE user SET wish_list=? WHERE id=?"
        const updateData=await dbQueryAsync(updateQuery,[wish_list,userId])
        if(updateData){
            return res.send({status:true,message:"Wishlist added successfully"})
        }
    } catch (error) {
        return res.send({status:false,message:error})  
    }
}