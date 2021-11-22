const TodoListModel = require('../models/TodoListModel')

class TodolistController {
   // [post]: /todolist
   getAllTask = async function (req, res, next) {
      console.log('getTask')
      try {
         const tasks = await TodoListModel.find({ _id: { $in: req.body.taskList } })
         res.status(500).json(tasks)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [POST]: /add-task
   addTask = async function (req, res, next) {
      console.log('addTask')
      try {
         const task = new TodoListModel(req.body)
         const newTask = await task.save()
         res.status(200).json(newTask)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [PUT]: /edit-task/:taskId
   editTask = async function (req, res, next) {
      console.log('editTask')
      try {
         const taskEdited = await TodoListModel.findOneAndUpdate(
            { _id: req.params.taskId },
            req.body,
            { new: true }
         )
         res.status(200).json(taskEdited)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [DELETE]: /delete-task/:taskId
   deleteTask = async function (req, res, next) {
      console.log('deleteTask')
      try {
         const taskDeleted = await TodoListModel.findOneAndDelete({ _id: req.params.taskId })
         res.status(200).json(taskDeleted)
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new TodolistController()
