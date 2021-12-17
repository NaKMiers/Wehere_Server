const BlogModel = require('../models/BlogModel')

class BlogController {
   // [POST]: /blogs/post
   postBlogStatus = async function (req, res) {
      console.log('postBlogStatus')
      const userId = req.user._id
      const data = req.body
      try {
         const blogStatus = BlogModel({ ...data, userId })
         await blogStatus.save()
         res.status(200).json('BlogStatus has been created.')
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new BlogController()
