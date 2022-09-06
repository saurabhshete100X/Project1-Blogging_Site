const blogSchema = require("../Model/blogsModel");
const authorModel = require("../Model/authorModel");
let { isValid } = require("../Validation/validatorBlog");
const createBlogs = async function (req, res) {
  try {
    const data = req.body;
    const { title, body, authorId, category } = data;
    if (Object.keys(data).length === 0)
      return res
        .status(400)
        .send({ status: false, data: "The body Can't be Empty" });

    if (!title)
      res.status(400).send({ status: false, data: "title is required" });
    if (!body)
      res.status(400).send({ status: false, data: "body is required" });
    if (!authorId)
      res.status(400).send({ status: false, data: "authorId is required" });
    if (!category)
      res.status(400).send({ status: false, data: "category is required" });

    let Author = await authorModel.findById(authorId);
    if (!Author)
      return res
        .status(400)
        .send({ status: false, message: "Author_Id not found In DB" });

    if (!isValid(title))
      return res
        .status(400)
        .send({ status: false, message: "Title can't be Empty" });
    if (!isValid(body))
      return res
        .status(400)
        .send({ status: false, message: "body can't be Empty" });
    if (!isValid(authorId))
      res.status(400).send({ status: false, data: "authorId can't br Empty" });
    if (!isValid(category))
      return res
        .status(400)
        .send({ status: false, message: "Category can't be Empty" });

    const createBlog = await blogSchema.create(data);
    res.status(201).send({ status: true, data: createBlog });
  } catch (err) {
   return res.status(500).send({ status: false, data: err.message });
  }
};

//Get Blogs
const getAllBlogs = async function (req, res) {
  try {
    let data = req.query;
    let { authorId, tags, category, subcategory } = data;

    // let Author = await authorModel.findById(authorId);
    // if (!Author) return res.status(400).send({ status: false, message: "Author_Id not found In DB" });

    let alldetails = await blogSchema.find({
      isDeleted: false,
      isPublished: true,
    }); //find array of object
    if (!alldetails.length > 0) {
      return res.status(404).send({ status: false, data: "No document found" });

      //   console.log(alldetails)
    } else {
      // return res.status(200).send({status:true,data:alldetails})
      let search = await blogSchema.find({
        $or: [
          { authorId: authorId },
          { tags: tags },
          { category: category },
          { subcategory: subcategory },
        ],
      });
      let validatorAuthorId=await blogSchema.findById({authorId:authorId}).select({authorId:1})
      console.log(validatorAuthorId)
      if(validatorAuthorId){ return res.status(200).send({ status: true, data: search }) }
      else if(!validatorAuthorId){
        return res.status(404).send({ status: false, data: "the author id not found" });
    }
    else{
        if(!isValid(authorId)){ return res.status(400).send({ status: false, data: "the author Id is required" });}
    }
        // if (tags==="") {
        //     return res.status(400).send({ status: false, msg: "tags are empty!" })
        // }

    //   console.log(validatorAuthorId)
    
   
      // if(Object.keys(data)===0) return res.status(400).send({ status: false, message: "The query can't be Empty" });

    }
}
   catch (error) {
   return res.status(500).send(error.message);
  }
}

const updateBlog = async function (req, res) {
  try {
    // let data = req.body;
    // let { tags, body, title, subcategory } = data;
    // let saveddata= await blogSchema.findOneAndUpdate({_id:req.params.blogId},{title,body,$addToSet:{subcategory:subcategory,tags:tags}},{new:true})
    // let saveddata= await blogSchema.findOneAndUpdate({_id:req.params.blogId},{title,body,$push:{subcategory:subcategory,tags:tags}},{new:true})
    // let updated=await blogSchema.findOneAndUpdate({_id:req.params.blogId},{$set:{isPublished:true,publishedAt:new Date()}},{new:true})
    // let updatePublish = {publishedat:Date.now},{isPublished:true}

    const blogId = req.params.blogId;
    const blogData = req.body;
    let blog = await blogSchema.findOneAndUpdate(
      { _id: blogId, isDeleted: false },
      {
        $set: {
          isPublished: true,
          body: blogData.body,
          title: blogData.title,
          publishedAt: new Date(),
        },
        $push: { tags: blogData.tags, subcategory: blogData.subcategory },
      },
      { new: true }
    );

    return res.status(200).send({ status: true, data: blog });
  } catch (error) {
   return res.status(500).send(error.message);
  }
};

const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let deletedoc = await blogSchema
      .findOne({ _id: blogId })
      .select({ isDeleted: 1,_id:0 });

    if (!deletedoc.isDeleted == false)
      return res.status(404).send({ status: false, data: "the id Does't Exist" });

    let deleteDoc = await blogSchema.findOneAndUpdate(
      { _id: blogId },
      { $set: { isDeleted: true } },
      { new: true }
    );
    res.status(200).send();
  } catch (err) {
    return res.status(500).send({ status: false, data: err.message });
  }
};

const deleteByKeys = async function (req, res) {
    try{
  let body = req.query;
  let { category, authorId, tags, subcategory, isPublished } = body;
  let deleteBykey = await blogSchema.find({
    $or: [
      { category: category },
      { authorId: authorId },
      { tags: tags },
      { subcategory: subcategory },
      { isPublished: isPublished },
    ],
  });
// console.log(deleteBykey)
  if(!deleteBykey.isDeleted==false) return res.status(404).send({status:false,data:"the Blog is already Deleted"})
let arr=[]
for(let i=0;i<deleteBykey.length;i++){
    let arr1=deleteBykey[i]._id.toString()
    arr.push(arr1)
}
// console.log(arr)
  let deleteOne=await blogSchema.findByIdAndUpdate({_id:arr}, 
    {$set:{isDeleted:true}},
        {new:true})
 return res.status(200).send({status:true,data:deleteOne})

}
catch(err){
  return  res.status(500).send({status:false,data:err.message})
}
}

module.exports = { createBlogs, getAllBlogs, updateBlog, deleteBlog,deleteByKeys };
