const ConversationModel = require('../models/ConversationModel')
const UserModel = require('../models/UserModel')

class ConversationController {
   // [GET]: /conversation/:userId
   getConversation = async function (req, res, next) {
      console.log('getConversation')
      const curUserId = req.params.userId
      try {
         const curUser = await UserModel.findById(curUserId)
         let conversation = await ConversationModel.find({
            members: { $in: [curUserId] },
         })

         // check if is friend then acept, is not friend then deny
         conversation = conversation.filter(c => {
            const friendId = c.members.filter(m => m !== curUserId)
            return curUser.friends.includes(friendId)
         })

         res.status(200).json(conversation)
      } catch (err) {
         res.status(500).json(200)
      }
   }

   // [GET]: /conversations/get-one-conversation/:curUserId/:friendId
   getOneConversation = async function (req, res) {
      console.log('getOneConversation')
      const curUserId = req.params.curUserId
      const friendId = req.params.friendId
      try {
         const conversation = await ConversationModel.findOne({
            members: { $in: [curUserId], $in: [friendId] },
         })
         res.status(200).json(conversation)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [POST]: /conversation/new-conversation
   newConversation = async function (req, res, next) {
      console.log('newConversation')
      try {
         const newConversation = new ConversationModel({
            members: [req.body.senderId, req.body.receiverId],
         })
         const savedConversation = await newConversation.save()

         res.status(200).json(savedConversation)
      } catch (err) {
         res.status(500).json(200)
      }
   }
}

module.exports = new ConversationController()
