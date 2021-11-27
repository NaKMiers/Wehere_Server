const express = require('express')
const router = express.Router()

const TodolistController = require('../app/controllers/TodolistController')

router.post('/', TodolistController.getAllTask)
router.post('/add-task', TodolistController.addTask)
router.put('/edit-task', TodolistController.editTask)
router.delete('/delete-task/:taskId', TodolistController.deleteTask)

module.exports = router
