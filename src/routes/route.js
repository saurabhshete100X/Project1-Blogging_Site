const express = require('express');

const router = express.Router();
const authorController=require('../Controller/authorController')
const blogsController=require('../Controller/blogsController')
// const midEmail=require('../middleWare/validator')

router.post('/authors',authorController.createAuthor)

router.post('/blogs',blogsController.createBlogs)

router.get('/blogs',blogsController.getAllBlogs)

router.put('/blogs/:blogId',blogsController.updateBlog)

router.delete('/blogs/:blogId',blogsController.deleteBlog)


router.delete('/blogs',blogsController.deleteByKeys)


module.exports = router;
