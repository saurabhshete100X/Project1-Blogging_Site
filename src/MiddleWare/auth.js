let jwt = require("jsonwebtoken");
const blogsModel = require("../Model/blogsModel");
let mongoose=require('mongoose')
let{idCharacterValid}=require('../Validation/validator')

let authentication = async function (req, res, next) {
  try {
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

    next();
  } catch (err) {
    return res.status(500).send({ status: false, data: err.message });
  }
};

let authorization = async function (req, res, next) {
  try {
    
    let token = req.headers["x-api-key"];
    let decodedToken = jwt.verify(token, "our_first_project");
    let blogId = req.params.blogId;
    if (!blogId)
      return res
        .status(400)
        .send({ status: true, data: "the blogId is requried" });
    if (!idCharacterValid(blogId))  return res.status(400).send({ status: false, msg: "blogId is invalid!" });

    let findBlogId = await blogsModel
      .findById(blogId)
      .select({ authorId: 1, _id: 0 });
    if (!findBlogId)
      return res.status(400).send({ status: false, msg: "blogId is invalid!" });
    let userLoggedIn = decodedToken.userId;
    if (findBlogId.authorId != userLoggedIn)
      return res
        .status(400)
        .send({
          status: false,
          msg: "Author logged is not allowed to modify the requested author's blog data",
        });

    next();
  } catch (err) {
    return res.status(500).send({ status: false, data: err.message });
  }
};



module.exports.authentication = authentication;
module.exports.authorization = authorization;
