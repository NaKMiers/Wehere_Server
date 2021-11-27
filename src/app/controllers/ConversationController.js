const ConversationModel = require('../models/ConversationModel')

class ConversationController {
   // [GET]: /conversation/:userId
   getConversation = async function (req, res, next) {
      console.log('getConversation')
      try {
         const conversation = await ConversationModel.find({
            members: { $in: [req.params.userId] },
         })

         res.status(200).json(conversation)
      } catch (err) {
         res.status(500).json(200)
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
