const express = require('express');

const router = express.Router();
const authorController=require('../Controller/authorController')
const blogsController=require('../Controller/blogsController')
// const midEmail=require('../middleWare/validator')

router.post('/authors',authorController.createAuthor)

router.post('/blogs',blogsController.createBlogs)

module.exports = router;
