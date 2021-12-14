const TodoListModel = require('../models/TodoListModel')

class TodolistController {
   // [post]: /todolist
   getAllTask = async function (req, res, next) {
      console.log('getAllTask')
      const userId = req.user._id
      try {
         const taskList = await TodoListModel.find({ userId })
         res.status(200).json(taskList)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [POST]: /todo-list/add-task
   addTask = async function (req, res, next) {
      console.log('addTask')
      const data = req.body
      try {
         const task = new TodoListModel(data)
         const newTask = await task.save()
         res.status(200).json(newTask)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [PUT]: /todo-list/edit-task/:taskId
   editTask = async function (req, res, next) {
      console.log('editTask')
      const { data } = req.body
      if (data.length === 1) {
         try {
            const taskEdited = await TodoListModel.findOneAndUpdate({ _id: data[0]._id }, data[0], {
               new: true,
            })
            res.status(200).json([taskEdited])
         } catch (err) {
            res.json(err)
         }
      } else {
         try {
            const taskEditedList = data.map(
               async task =>
                  await TodoListModel.findOneAndUpdate({ _id: task._id }, task, {
                     new: true,
                  })
            )
            res.status(200).json(taskEditedList)
         } catch (err) {
            res.json(err)
         }
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
