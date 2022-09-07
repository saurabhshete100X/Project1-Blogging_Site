const blogSchema = require("../Model/blogsModel");
const authorModel = require("../Model/authorModel");
let { isValid } = require("../Validation/validatorBlog");
let mongoose = require("mongoose");
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
    const data = req.query;

    //Validating data is empty or not
    if (Object.keys(data).length == 0) {
      const blog = await blogSchema.find({
        isPublished: true,
        isDeleted: false,
      });
      if (blog.length == 0) {
        return res
          .status(404)
          .send({
            status: false,
            msg: "Blog doesn't Exists, field is required.",
          });
      }
      res.status(200).send({ status: true, data: blog });
    }
    //get data by query param
    if (Object.keys(data).length != 0) {
      data.isPublished = true;
      data.isDeleted = false;
      //console.log(data)
      let getBlog = await blogSchema.find(data).populate("authorId");
      if (getBlog.length == 0) {
        return res
          .status(404)
          .send({
            status: false,
            msg: "No such blog exist, Please provide correct data.",
          });
      }
      res.status(200).send({ status: true, data: getBlog });
    }
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};

const updateBlog = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    if (!blogId)
      return res
        .status(400)
        .send({ status: true, data: "the blogId is requried" });
    let blogIdValid = await blogSchema.findById(blogId);
    if (!blogIdValid)
      return res
        .status(400)
        .send({ status: true, data: "the blog does not Exist" });
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
    if (!blog)
      return res
        .status(404)
        .send({ status: false, data: "the document already deleted" });
    return res.status(200).send({ status: true, data: blog });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let blogIdValid = await blogSchema.findById(blogId);
    if (!blogIdValid)
      return res
        .status(400)
        .send({ status: true, data: "the blog does not Exist" });

    //     const isValidObjectId = function (ObjectId) {
    //       return mongoose.Types.ObjectId.isValid(ObjectId)
    //   }
    //   if (!isValidObjectId(blogId)) {
    //     return res.send({ status: false, msg: "Please Enter Valid ID" })
    // }

    let deletedoc = await blogSchema
      .findOne({ _id: blogId })
      .select({ isDeleted: 1, _id: 0 });

    if (deletedoc.isDeleted === true)
      return res
        .status(404)
        .send({ status: false, data: "the blog is alreday deleted" });

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
  try {
    let data = req.query
    let authorId=data.authorId
    let validAid=mongoose.Types.ObjectId.isValid(authorId)
    if(!validAid) return res.status(404).send({ status: false, msg:"Give the valid authorID" })
  
    let filter = { ...data }   //stores the query params in the object obj-destructure-object literals
    let checkBlog = await blogSchema.findOne(filter)
  
    if (!checkBlog)
      return res.status(404).send({ status: false, msg: "no such blog exist...! " })

    if (checkBlog.isDeleted === true)
      return res.status(400).send({ status: false, msg: "blog is already deleted...!" })

    let blogId = checkBlog._id
    // console.log(blogId )
    let deleteBlog = await blogSchema.findOneAndUpdate(
      filter,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    )
    res.status(201).send({ status: true, data: deleteBlog })

  } catch (err) {
    res.status(500).send({ status: false, msg: err.message })
  }

}


module.exports = {
  createBlogs,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  deleteByKeys,
};
