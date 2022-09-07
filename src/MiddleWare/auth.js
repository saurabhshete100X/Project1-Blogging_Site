let jwt=require('jsonwebtoken')
const blogsModel = require('../Model/blogsModel')


let authentication=async function(req,res,next){
    try{
let token=req.headers['x-api-key']
if(!token){
    token=req.headers['x-Api-Key']
}
if(!token){
    return res.status(400).send({status:false,data:"Header is required"})
}
let decodedToken=jwt.verify(token,"our_first_project")

if(!decodedToken) return res.status(400).send({status:false,data:"token is Invalid"})

next()
    }
    catch(err){
        return res.status(500).send({status:false,data:err.message})
    }
}


let authorization=async function(req,res,next){
    try{
    let token=req.headers['x-api-key']
if(!token){
    token=req.headers['x-Api-Key']
}
if(!token){
    return res.status(400).send({status:false,data:"Header is required"})
}
let decodedToken=jwt.verify(token,"our_first_project")
let authorId=decodedToken.userId.toString()
    let blogId=req.params.blogId
    if(!blogId) {
        return res.status(400).send({status:false,data:"please enter the blog id"})
    }
    let checkBlogId=await blogsModel.findById({_id:blogId,isDeleted:false})
    if(!checkBlogId){
        return res.status(400).send({status:false,data:"the blog is already deleted  || this blog Id does't Exist"})
    }
    if(checkBlogId.authorId!=authorId) {
        return res.status(404).send({status:false,data:"You are not authorized"})
    }
  
    next() 
}
catch(err){
    return res.status(500).send({status:false,data:err.message})
}
}


module.exports.authentication=authentication
module.exports.authorization=authorization
