const express = require('express');

const router = express.Router();
const authorController=require('../Controller/authorController')
const blogsController=require('../Controller/blogsController')
const mid1=require('../MiddleWare/auth')
// const midEmail=require('../middleWare/validator')

router.post('/authors',authorController.createAuthor)

router.post('/login',authorController.loginAuthor)

router.post('/blogs',mid1.authentication,blogsController.createBlogs)

router.get('/blogs',mid1.authentication,blogsController.getAllBlogs)

router.put('/blogs/:blogId',mid1.authentication,mid1.authorization,blogsController.updateBlog)

router.delete('/blogs/:blogId',mid1.authentication,mid1.authorization,blogsController.deleteBlog)


router.delete('/blogs',mid1.authentication,mid1.authorization,blogsController.deleteByKeys)




module.exports = router;
