const TodoListModel = require('../models/TodoListModel')

class TodolistController {
   // [post]: /todolist
   getAllTask = async function (req, res, next) {
      console.log('getAllTask')
      try {
         const taskList = await TodoListModel.find({ _id: { $in: req.body.taskList } })
         res.status(200).json(taskList)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [POST]: /todo-list/add-task
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

   // [PUT]: /todo-list/edit-task/:taskId
   editTask = async function (req, res, next) {
      console.log('editTask')
      try {
         const { data } = req.body
         const taskEditedList = await data.map(async task => {
            return await TodoListModel.findOneAndUpdate({ _id: task._id }, task, {
               new: true,
            })
         })
         res.status(200).json(taskEditedList)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [DELETE]: /todo-list/delete-task/:taskId
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
