let db = require("../../config/db");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);

exports.getOrder=async(req,res)=>{
    try {
        const status=req.params.status
        const getQuery="SELECT * FROM order_history WHERE status=? ORDER BY id DESC"
        const getData=await dbQueryAsync(getQuery,[status])
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

exports.updateOderStatus=async(req,res)=>{
    try {
        const {status,id}=req.body
        const updateQuery="UPDATE order_history SET status=? WHERE id=?"
        const updateRow=await dbQueryAsync(updateQuery,[status,id])
        if(updateRow){
            return res.send({status:true,message:"Order updated successfully"})
        }
    } catch (error) {
        return res.send({status:false,message:error})
    }
}