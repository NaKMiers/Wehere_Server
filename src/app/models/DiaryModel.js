const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DiaryModel = new Schema(
   {
      userId: String,
      title: String,
      description: String,
      content: String,
      textColor: { type: String, default: '#333' },
      background: { type: String, default: '' },
   },
   { timestamps: true }
)

module.exports = mongoose.model('Diaries', DiaryModel)
