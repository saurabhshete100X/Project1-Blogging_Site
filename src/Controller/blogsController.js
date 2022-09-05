const blogSchema=require('../Model/blogsModel')
const authorModel=require('../Model/authorModel')
const createBlogs=async function(req,res){
    try{
    const data=req.body
    if(!data.authorId){
        res.send({status:false,data:"authorId is required"})
    }
    let Author = await authorModel.findById(data.authorId);
        if (!Author) {
            return res.status(400).send({ status: false, message: "Author_Id not found In DB" });
        }
    const createBlog=await blogSchema.create(data)
    res.status(201).send({status:true,data:createBlog})
}
catch(err){
    res.status(500).send({status:false,data:err.message})
}
}

module.exports.createBlogs=createBlogs