const blogSchema = require("../Model/blogsModel");
const authorModel = require("../Model/authorModel");
let {
  isValidString,
  isValidtagsandSubcategory,
  keyValid,
  idCharacterValid,
} = require("../Validation/validator");
let mongoose = require("mongoose");
let jwt = require("jsonwebtoken");

const createBlogs = async function (req, res) {
  try {
    const data = req.body;

    if (!keyValid(data))
      return res
        .status(400)
        .send({ status: false, data: "The body Can't be Empty" });

    const { title, body, authorId, category } = data;

    if (!title)
      return res.status(400).send({ status: false, data: "title is required" });
    if (!body)
      return res.status(400).send({ status: false, data: "body is required" });
    if (!authorId)
      return res
        .status(400)
        .send({ status: false, data: "authorId is required" });
    if (!category)
      return res
        .status(400)
        .send({ status: false, data: "category is required" });

    if (!idCharacterValid(authorId))
      return res
        .status(400)
        .send({ status: false, data: "Please Enter valid author id" });

    let Author = await authorModel.findById(authorId);
    if (!Author)
      return res
        .status(400)
        .send({ status: false, message: "Author_Id not found In DB" });

    if (!isValidString(title))
      return res
        .status(400)
        .send({ status: false, data: "title is not valid String" });
    if (!isValidString(body))
      return res
        .status(400)
        .send({ status: false, data: "Body is not valid String" });
    if (!isValidString(category))
      return res
        .status(400)
        .send({ status: false, data: "Category is not valid String" });
    if (!isValidString(authorId))
      return res
        .status(400)
        .send({ status: false, data: "authorID is not valid String" });

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
    if (!keyValid(data)) {
      const blog = await blogSchema.find({
        isPublished: true,
        isDeleted: false,
      });
      if (blog.length == 0) {
        return res.status(404).send({
          status: false,
          msg: "Blog doesn't Exists,Alredy deleted",
        });
      }
      res.status(200).send({ status: true, data: blog });
    }
    //get data by query param
    if (keyValid(data)) {
      data.isPublished = true;
      data.isDeleted = false;
      //console.log(data)
      let getBlog = await blogSchema.find(data).populate("authorId");
      if (getBlog.length == 0) {
        return res.status(404).send({
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
    const blogData = req.body;
    let { title, body, tags, subcategory } = blogData;
    
    if (!idCharacterValid(blogId))
      return res.status(400).send({ status: false, msg: "blogId is invalid!" });

    let blogIdValid = await blogSchema.findById(blogId);
    if (!blogIdValid)
      return res
        .status(400)
        .send({ status: true, data: "the blog does not Exist" });

    if (!keyValid(blogData))
      return res 
        .status(400)
        .send({ status: false, data: "the body input is requried" });

    if (!title)
      return res
        .status(400)
        .send({ status: false, data: "the title is required" });
    if (!body)
      return res
        .status(400)
        .send({ status: false, data: "the body is required" });
    if (!tags)
      return res
        .status(400)
        .send({ status: false, data: "the tags is required" });
    if (!subcategory)
      return res
        .status(400)
        .send({ status: false, data: "the subcategory is required" });

    if (!isValidString(title))
      return res
        .status(400)
        .send({ status: false, data: "the title is not valid string" });
    if (!isValidString(body))
      return res
        .status(400)
        .send({ status: false, data: "the body is not valid string" });
    if (!isValidtagsandSubcategory(tags))
      return res
        .status(400)
        .send({ status: false, data: "the title is not valid string" });
    if (!isValidtagsandSubcategory(subcategory))
      return res
        .status(400)
        .send({ status: false, data: "the subcategory is not valid string" });

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

    let deletedoc = await blogSchema
      .findOne({ _id: blogId })
      .select({ isDeleted: 1, _id: 0 });

    if (deletedoc.isDeleted === true)
      return res
        .status(404)
        .send({ status: false, data: "the blog is alreday deleted" });

    let deleteBlog = await blogSchema.findOneAndUpdate(
      { _id: blogId },
      { $set: { isDeleted: true } },
      { new: true }
    );
    res.status(200).send();
  } catch (err) {
    return res.status(500).send({ status: false, data: err.message });
  }
};

// const deleteByKeys = async function (req, res) {
//   try {
//     let data = req.query 
//     let authorId=data.authorId
//     let validAid=mongoose.Types.ObjectId.isValid(authorId)
//     if(!validAid) return res.status(404).send({ status: false, msg:"Give the valid authorID" })

//     let filter = { ...data }   //stores the query params in the object obj-destructure-object literals
//     let checkBlog = await blogSchema.findOne(filter)

//     if (!checkBlog)
//       return res.status(404).send({ status: false, msg: "no such blog exist...! " })

//     if (checkBlog.isDeleted === true)
//       return res.status(400).send({ status: false, msg: "blog is already deleted...!" })

//     let blogId = checkBlog._id
//     // console.log(blogId )
//     let deleteBlog = await blogSchema.findOneAndUpdate(
//       filter,
//       { $set: { isDeleted: true, deletedAt: new Date() } },
//       { new: true }
//     )
//     res.status(201).send({ status: true, data: deleteBlog })

//   } catch (err) {
//     res.status(500).send({ status: false, msg: err.message })
//   }

// }

const deleteByKeys = async function (req, res) {
  try {
    let data = req.query;
    if (!keyValid(data))
      return res
        .status(400)
        .send({ status: true, data: "the input is required" });
    let { authorId, tags, subcategory, category, isPublished } = data;
    const finddata = await blogSchema
      .find(data)
      .select({ authorId: 1, isDeleted: 1, _id: 0 });

    if (!finddata)
      return res
        .status(404)
        .send({ status: false, msg: "no such blog exist...! " });

    let storeId = finddata.map((x) => x.authorId.toString());

    let token = req.headers["x-api-key"];
    if (!token) {
      token = req.headers["x-Api-Key"];
    }
    if (!token) {
      return res
        .status(400)
        .send({ status: false, data: "Header is required" });
    }
    let decodedToken = jwt.verify(token, "our_first_project");
    if (!decodedToken)
      return res.status(400).send({ status: false, data: "token is Invalid" });

    let gettokenId = decodedToken.userId.toString();

    for (let i = 0; i < storeId.length; i++) {
      if (gettokenId == storeId[i]) {
        let deleteBlog = await blogSchema.findOneAndUpdate(
          data,
          { $set: { isDeleted: true, deletedAt: new Date() } },
          { new: true }
        );
        if (deleteBlog.isDeleted == true &&deleteBlog.isPublished==true)
          return res
            .status(400)
            .send({ status: false, msg: "blog is already deleted and you can't delete the published blog" });

        return res.status(200).send({ status: true, data: deleteBlog });
      } else {
        return res
          .status(404)
          .send({
            status: false,
            data: "You can't delete the other user data",
          });
      }
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = {
  createBlogs,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  deleteByKeys,
};
