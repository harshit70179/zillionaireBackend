let db = require("../../config/db");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);

exports.getHomeProduct=async(req,res)=>{
    try {
        const getQuery="SELECT * FROM home_title ORDER BY id DESC"
        const getData=await dbQueryAsync(getQuery)
        if(getData.length>0){
            let arr=[]
            for(let i=0;i<getData.length;i++){
                let productIds=JSON.parse(getData[i].product_ids)
                if(productIds.length>0){
                    const idList = productIds.join(',');
                    const productList=await getProducts(idList)
                    arr.push({title:getData[i].title,products:productList})
                }else{
                    arr.push({title:getData[i].title,products:[]})
                }
            }
            return res.send({status:true,message:"Record found successfully",data:arr})
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