const authorModel=require('../Model/authorModel')

const {emailRegex}=require('../middleWare/validator')//destructure
const createAuthor=async function(req,res){
    try{
        let {email}=req.body
    if(!emailRegex(email)) return res.status(400).send({status:false,data:"Email is Invalid"})
    const data=req.body
    const createA=await authorModel.create(data)
    res.status(201).send({status:true,data:createA})
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

module.exports.createAuthor=createAuthor