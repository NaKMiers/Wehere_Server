const BlogModel = require('../models/BlogModel')
const UserModel = require('../models/UserModel')

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

   // [GET]: /blogs/get-blogs-newfeed
   getBlogsNewfeed = async function (req, res) {
      console.log('getBlogNewFeed')
      const userId = req.user._id
      console.log('userId: ', userId)
      try {
         // get a friendList
         const curUser = await UserModel.findById(userId)

         // get users from friendList
         let friends = await UserModel.find({ _id: { $in: curUser.friends } })
         friends = friends.concat(curUser)

         // get blogs with each friend from friendList and from my blogs
         const originBlogs = await BlogModel.find({
            $or: [{ userId: { $in: curUser.friends } }, { userId: userId }],
         })

         const completedBlogs = originBlogs.map(b => {
            let friendMatch = friends.find(f => {
               return f._id.toString() === b.userId
            })

            let { createdAt, password, ...other } = friendMatch._doc
            return { blog: b, author: other }
         })

         res.status(200).json(completedBlogs)
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new BlogController()
