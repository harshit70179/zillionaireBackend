let db = require("../../config/db");
const util = require("util");
const { userType } = require("../../config/enum");
const dbQueryAsync = util.promisify(db.query).bind(db);

exports.getUsers=async (req,res)=>{
   let query="SELECT id,first_name,last_name,email FROM user WHERE user_type !=? AND user_type!=?"
   const getData=await dbQueryAsync(query,[userType.Admin,userType.Staff])
   if(getData.length>0){
     return res.send({status:true,message:"Record found successfully",data:getData})
   }
   else{
    return res.send({status:false,message:"No record found"})
   }
}