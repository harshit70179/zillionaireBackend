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
                    const idList = productIds.map(id => `'${id}'`).join(',');
                    const productList=getProducts(idList)
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
             let query=`SELECT * FROM products WHERE id IN (${idList});`;
             console.log(query)
             let getData=await dbQueryAsync(query)
             resolve(getData)
           } catch (error) {
            reject(error)
           }
    })
}