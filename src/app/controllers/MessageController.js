const MessageModel = require('../models/MessageModel')

class MessageController {
   // [GET]: /messages/:conversationId
   getMessage = async function (req, res, next) {
      console.log('getMessage')
      try {
         const messages = await MessageModel.find({ conversationId: req.params.conversationId })

         res.status(200).json(messages)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [POST]: /messages/new-message
   newMessage = async function (req, res, next) {
      console.log('newMessage')
      const message = req.body.message
      try {
         const newMessage = new MessageModel(message)
         const savedMessage = await newMessage.save()

         res.status(200).json(savedMessage)
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new MessageController()
