let db = require("../../config/db");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);

exports.getSocialMedia=async(req,res)=>{
    try {
        const getQuery="SELECT * FROM social_media"
        const getData=await dbQueryAsync(getQuery)
        if(getData.length>0){
            return res.send({status:true,message:"Record found successfully",data:getData})
        }
        else{
                return res.send({status:false,message:"No record found"}) 
        }
    } catch (error) {
        return res.send({status:false,message:error})
    }
}