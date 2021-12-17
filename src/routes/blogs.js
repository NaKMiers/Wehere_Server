const express = require('express')
const router = express.Router()

const BlogController = require('../app/controllers/BlogController')
const authMiddleware = require('../app/middlewares/authMiddleware')

router.post('/post', authMiddleware, BlogController.postBlogStatus)

module.exports = router
