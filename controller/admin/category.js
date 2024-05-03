let db = require("../../config/db");
const util = require("util");
const { activeType } = require("../../config/enum");
const dbQueryAsync = util.promisify(db.query).bind(db);

exports.addCategory=async(req,res)=>{
    try {
        const {name,main_category_id,size,start,end,step,size_name}=req.body
        const query="INSERT INTO category(name,main_category_id,size,start,end,step,size_name) VALUES(?,?,?,?,?,?,?)"
        const insertRow=await dbQueryAsync(query,[name,main_category_id,size,start,end,step,size_name])
        if(insertRow){
            incrementMainCategory(main_category_id)
            return res.send({status:true,messgae:"Category added successfully"})
        } 
    } catch (error) {
        return res.status(400).send({status:false,message:"Internal server error"})
    }
}

exports.getCategory=async(req,res)=>{
    try {
        const query="SELECT main_category.name AS main_category_name,category.* FROM category LEFT JOIN main_category ON main_category.id=category.main_category_id"
        const getData=await dbQueryAsync(query)
        if(getData){
            return res.send({status:true, message:"Record found successfully",data:getData})
        }
        else{
            return res.send({status:false, message:"NO record found",data:getData})
        }
    } catch (error) {
        return res.status(400).send({status:false,message:"Internal server error"})
    }
  
}

exports.updateCategory=async(req,res)=>{
    try {
        const {name,main_category_id,id,size,start,end,step,size_name}=req.body
        const getQuery="SELECT * FROM sub_category WHERE name=? AND main_category_id=?" 
        const getData=await dbQueryAsync(getQuery,[name,main_category_id])
        if(getData.length>0){
            return res.send({status:true,message:"Already updated"})
        }
        const query="UPDATE category SET name=?,main_category_id=?,size=?,start=?,end=?,step=?,size_name=? WHERE id=?"
        const updateRow=await dbQueryAsync(query,[name,main_category_id,size,start,end,step,size_name,id])
        if(updateRow){
            return res.send({status:true,messgae:"Main category updated successfully"})
        } 
    } catch (error) {
        return res.status(400).send({status:false,message:"Internal server error"})
    }
}

const incrementMainCategory=async(id)=>{
    const query="SELECT * FROM main_category WHERE id=?"
    const getData=await dbQueryAsync(query,[id]) 
    if(getData){
        const query="UPDATE main_category SET total_category=? WHERE id=?"
        const updateRow=await dbQueryAsync(query,[getData[0].total_category+1,id])
    }
    
}

exports.updateCategoryStatus = async (req, res) => {
    const id = req.params.id
    const checkquery = "SELECT * FROM category WHERE id=?";
    const checkData = await dbQueryAsync(checkquery, [id])
    if (checkData.length > 0) {
      var status;
      if (checkData[0].status == activeType.active) {
        status = activeType.inActive;
      }
      else{
        status = activeType.active;
      }
      const updateQuery = "UPDATE category SET status = ?  WHERE id =?";
      const updateRow = await dbQueryAsync(updateQuery, [status, id])
      if (updateRow) {
        return res.send({
          status: true,
          message: "Category status updated successfully",
          data: updateRow,
        });
      }
  
    } else {
      return res.send({ status: false, message: "No records found" });
    }
  };