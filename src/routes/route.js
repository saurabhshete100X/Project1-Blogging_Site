const express = require('express');

const router = express.Router();
const authorController=require('../Controller/authorController')
const midEmail=require('../middleWare/validator')

router.post('/authors',authorController.createAuthor)

module.exports = router;
