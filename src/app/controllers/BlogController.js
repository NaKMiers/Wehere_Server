const BlogModel = require('../models/BlogModel')
const UserModel = require('../models/UserModel')

class BlogController {
   // [POST]: /blogs/post
   postBlogStatus = async function (req, res) {
      console.log('postBlogStatus')
      const userId = req.user._id
      const data = req.body
      try {
         // get author
         const author = await UserModel.findById(userId)

         // post vides
         const blogStatus = BlogModel({ ...data, userId })
         const newBlogStatus = await blogStatus.save()

         res.status(200).json({ blog: newBlogStatus, author })
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [GET]: /blogs/get-blogs-newfeed
   getBlogsNewfeed = async function (req, res) {
      console.log('getBlogNewFeed')
      const userId = req.user._id
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

   // [PATCH]: /blogs/like
   likeBlogStatus = async function (req, res) {
      console.log('getBlogNewFeed')

      const { blogId, userId, value } = req.body
      try {
         if (value) {
            await BlogModel.updateOne({ _id: blogId }, { $addToSet: { hearts: userId } })
         } else {
            await BlogModel.updateOne({ _id: blogId }, { $pull: { hearts: userId } })
         }
         res.status(200).json()
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [DELETE]: /blogs/delele-blog/:blogId
   deleteBlogStatus = async function (req, res) {
      console.log('deleteBlogStatus')

      const blogId = req.params.blogId
      try {
         const blogDeleted = await BlogModel.findByIdAndDelete(blogId)
         res.status(200).json(blogDeleted)
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new BlogController()
