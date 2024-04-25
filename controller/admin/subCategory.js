let db = require("../../config/db");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);

exports.addSubCategory=async(req,res)=>{
    try {
        const {name,main_category_id,category_id}=req.body
        const query="INSERT INTO sub_category(name,main_category_id,category_id) VALUES(?,?,?)"
        const insertRow=await dbQueryAsync(query,[name,main_category_id,category_id])
        if(insertRow){
            incrementMainCategory(main_category_id)
            incrementCategory(category_id)
            return res.send({status:true,messgae:"Sub category added successfully"})
        } 
    } catch (error) {
        return res.status(400).send({status:false,message:"Internal server error"})
    }
}

exports.getSubCategory=async(req,res)=>{
    try {
        const query="SELECT main_category.name AS main_category_name,category.name AS category_name,sub_category.* FROM sub_category LEFT JOIN main_category ON main_category.id=sub_category.main_category_id LEFT JOIN category ON category.id=sub_category.category_id"
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

exports.updateSubCategory=async(req,res)=>{
    try {
        const {name,main_category_id,category_id,id}=req.body
        const getQuery="SELECT * FROM sub_category WHERE name=? AND main_category_id=? AND category_id=?" 
        const getData=await dbQueryAsync(getQuery,[name,main_category_id,category_id])
        if(getData.length>0){
            return res.send({status:true,message:"Already updated"})
        }
        const query="UPDATE sub_category SET name=?,main_category_id=?,category_id=? WHERE id=?"
        const updateRow=await dbQueryAsync(query,[name,main_category_id,category_id,id])
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
        const query="UPDATE main_category SET total_sub_category=? WHERE id=?"
        const updateRow=await dbQueryAsync(query,[getData[0].total_sub_category+1,id])
    }
    
}
const incrementCategory=async(id)=>{
    const query="SELECT * FROM category WHERE id=?"
    const getData=await dbQueryAsync(query,id) 
    if(getData){
        const query="UPDATE category SET total_sub_category=? WHERE id=?"
        const updateRow=await dbQueryAsync(query,[getData[0].total_sub_category+1,id])
    }
    
}