let db = require("../../config/db");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);

exports.addSocialMedia=async(req,res)=>{
    try {
        const {title,url}=req.body
        const getQuery="SELECT * FROM social_media WHERE title=?"
        const getData=await dbQueryAsync(getQuery,[title])
        if(getData.length>0){
            return res.send({status:false,message:"This title already exist"})
        }
        else{
            const insertQuery="INSERT INTO social_media(title,url) VALUES(?,?)"
            const insertRow=await dbQueryAsync(insertQuery,[title,url])
            if(insertRow){
                return res.send({status:true,message:"Social media added successfully"})
            }
        }
        
    } catch (error) {
        return res.send({status:false,message:error})
    }
}

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

exports.updateSocialMedia=async(req,res)=>{
    try {
        const {title,url,id}=req.body
        const updateQuery="UPDATE social_media SET title=?,url=? WHERE id=?"
        const updateRow=await dbQueryAsync(updateQuery,[title,url,id])
        if(updateRow){
            return res.send({status:true,message:"Social media updated successfully"})
        }
    } catch (error) {
        return res.send({status:false,message:error})
    }
}

exports.deleteSocialMedia=async(req,res)=>{
    try {
        const id=req.params.id
        const deleteQuery="DELECT FROM social_media WHERE id=?"
        const deleteRow=await dbQueryAsync(deleteQuery,[id])
        if(deleteRow){
            return res.send({status:true,message:"Social media deleted successfully"})
        }
    } catch (error) {
        return res.send({status:false,message:error})
    }
}