let db = require("../../config/db");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userType, activeType } = require("../../config/enum");
const configFile=require("../../config/jwt_config");
const { sendMail } = require("../common/common");
const CryptoJS = require("crypto-js");
const userBaseKey=process.env.encryptKey
async function decryptApiKey(apiKey) {
    new Promise((resolve, reject) => {
        try {
            const newKey = apiKey
            .replace(/p1L2u3S/g, "+")
            .replace(/s1L2a3S4h/g, "/")
            .replace(/e1Q2u3A4l/g, "=");
          const newApi = CryptoJS.AES.decrypt(newKey, userBaseKey);
          resolve(newApi.toString(CryptoJS.enc.Utf8))
        } catch (error) {
            reject(error)
        }
    })

  }

async function encryptKey(email){
    new Promise((resolve, reject) => {
        try {
            let encryptedApi = CryptoJS.AES.encrypt(email, userBaseKey).toString();
            encryptedApi = encryptedApi
              .replace(/\+/g, "p1L2u3S")
              .replace(/\//g, "s1L2a3S4h")
              .replace(/=/g, "e1Q2u3A4l");
              resolve(encryptedApi)
        } catch (error) {
            reject(error)
        }
    })
  
}  

const generatePassword = () => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#%?^-_/$&*]).{8,}$/;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#%?^-_/$&*';
    let password = '';
  
    do {
      password = '';
      for (let i = 0; i < 12; i++) { // Generating a 12-character password
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
      }
    } while (!regex.test(password));
  
    return password;
  };

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
                const subject="registration Link"
                const html=`<html><body><h3>Thank you for registration.</h3>
                <p>Please click this link and your account is activated.</p>
                <p><a href="${process.env.redirectUrl}registration-seccessfully/${encryptKey(lowerEmail)}">${process.env.redirectUrl}registration-seccessfully/${encryptKey(lowerEmail)}</a></p>
                </body></html>`
                const sendmail=await sendMail(subject,html,lowerEmail,first_name)
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
            if(checkResult[0].status===activeType.inActive){
                   return res.send({status:false,message:"Your email is not activate please check you mail"})
            }
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
                    status: false,
                    message: "Please try to correct old password",
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
                        status: false,
                        message: "Please enter different password",
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

exports.forgotPassowrd=async(req,res)=>{
    try {
        const { email } = req.body
        const lowerEmail = email.toLowerCase()
        const query = "SELECT * FROM user WHERE email=?"
        const getData = await dbQueryAsync(query, [lowerEmail])
        if(getData.length>0){
            if(checkResult[0].status===activeType.inActive){
                return res.send({status:false,message:"Your email is not activate please check you mail"})
         }
            const password = generatePassword()
            let saltRounds = 10;
            const salt = await bcrypt.genSaltSync(saltRounds);
            const hashPassowrd = await bcrypt.hashSync(password, salt);
            const updateQuery="UPDATE user SET password=? WHERE id=?"
            const updateRow=await dbQueryAsync(updateQuery,[hashPassowrd,getData[0].id])
            if(updateRow){
                const subject="Forget passowrd"
                const html=`<html><body><h3>Your password hasbeen reset.</h3>
                <p>Please try new password.</p>
                <p><b>Your new passowrd : ${password}</b></p>
                </body></html>`
                const sendmail=await sendMail(subject,html,lowerEmail,getData[0]?.first_name)
                return res.send({ status: true, message: "Your password has been reset please check your mail" })
            }
        }
        else{
            return res.send({status:false,message:"This email does not registered"})
        }
    } catch (error) {
        return res.send({status:false,message:error})
    }
}

exports.userVerified=async(req,res)=>{
    try {
        const decryptedData = await decryptApiKey(req.body.id);
        const getQuery="SELECT * FROM user WHERE email=?"
        const getData=await dbQueryAsync(getQuery,[decryptedData])
        if(getData.length>0){
            if(getData[0].status===activeType.active){
                return res.send({status:true,message:"Your account is already verify"})
            }
            else{
                const updateQuery="UPDATE user SET status=? WHERE email=?"
                const updateRow=await dbQueryAsync(updateQuery,[activeType.active,decryptedData])
                if(updateRow){
                    return res.send({status:true,message:"Your account is verified please login"})
                }
            }
        }
        else{
          return res.send({status:false,message:"No record found"})
        }
    } catch (error) {
        return res.send({status:false,message:error})
    }
}
