let db = require("../../config/db");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);
const { activeType } = require("../../config/enum");

exports.getSitePolicy = async (req, res) => {
  let getQuery = "SELECT * FROM site_policy";
  db.query(getQuery, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        return res.send({
          status: true,
          data: result,
          message: "Record found successfully",
        });
      } else {
        return res.send({ status: false, message: "No record found" });
      }
    }
  });
};

exports.getFooterCollection=async(req,res)=>{
  try {
      const query="SELECT * FROM sub_category WHERE status=?"
      const getData=await dbQueryAsync(query,[activeType.active])
      if(getData){
          return res.send({status:true, message:"Record found successfully",data:getData})
      }
      else{
          return res.send({status:false, message:"NO record found",data:getData})
      }
  } catch (error) {
      return res.status(400).send({status:false,message:error})
  }

}