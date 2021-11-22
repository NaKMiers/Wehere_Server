const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoListModel = new Schema(
   {
      title: String,
      status: { type: String, default: 'ready' },
      point: { type: Number, default: 0 },
      important: { type: Boolean, default: false },
   },
   { timestamps: true }
)

module.exports = mongoose.model('Todolist', TodoListModel)
