const express = require('express')
const router = express.Router()

const BlogController = require('../app/controllers/BlogController')
const authMiddleware = require('../app/middlewares/authMiddleware')

router.get('/get-blogs-newfeed', authMiddleware, BlogController.getBlogsNewfeed)
router.post('/post', authMiddleware, BlogController.postBlogStatus)
router.patch('/like', authMiddleware, BlogController.likeBlogStatus)
router.delete('/delete-blog/:blogId', authMiddleware, BlogController.deleteBlogStatus)

module.exports = router
