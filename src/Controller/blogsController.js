const blogSchema=require('../Model/blogsModel')
const authorModel=require('../Model/authorModel')
const isValid=require('../Validation/validatorBlog')
const createBlogs=async function(req,res){
    try{
    const data=req.body
    const {title,body,authorId,category}=data
    
    if(!title) res.status(400).send({status:false,data:"title is required"})
    if(!body) res.status(400).send({status:false,data:"body is required"})
    if(!authorId) res.status(400).send({status:false,data:"authorId is required"})
    if(!category) res.status(400).send({status:false,data:"category is required"})

    let Author = await authorModel.findById(authorId);
    if (!Author) return res.status(400).send({ status: false, message: "Author_Id not found In DB" });
    
    if(!isValid(title)) return res.status(400).send({ status: false, message: "Title can't be Empty" });
    if(!isValid(body)) return res.status(400).send({ status: false, message: "body can't be Empty" });
    if(!isValid(authorId)) res.status(400).send({status:false,data:"authorId can't br Empty"})
    if(!isValid(category)) return res.status(400).send({ status: false, message: "Category can't be Empty" });

    const createBlog=await blogSchema.create(data)
    res.status(201).send({status:true,data:createBlog})
}
catch(err){ 
    res.status(500).send({status:false,data:err.message})
}
}

module.exports.createBlogs=createBlogs