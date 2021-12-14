const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoListModel = new Schema(
   {
      userId: String,
      title: String,
      status: { type: String, default: 'ready' },
      point: { type: Number, default: 1 },
      important: { type: Boolean, default: false },
   },
   { timestamps: true }
)

module.exports = mongoose.model('Todolist', TodoListModel)
