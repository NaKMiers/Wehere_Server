const MessageModel = require('../models/MessageModel')

class MessageController {
   // [GET]: /messages/:conversationId
   getMessage = async function (req, res, next) {
      console.log('newMessage')
      try {
         const messages = await MessageModel.find({ conversationId: req.params.conversationId })

         res.status(500).json(messages)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [POST]: /messages/new-message
   newMessage = async function (req, res, next) {
      console.log('newMessage')
      try {
         const newMessage = new MessageModel(req.body)
         const savedMessage = await newMessage.save()

         res.status(500).json(savedMessage)
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new MessageController()
