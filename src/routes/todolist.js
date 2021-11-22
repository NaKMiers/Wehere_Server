const express = require('express')
const routes = require('.')
const router = express.Router()

const TodolistController = require('../app/controllers/TodolistController')

router.post('/', TodolistController.getAllTask)
router.post('/add-task', TodolistController.addTask)
router.post('/edit-task/:taskId', TodolistController.editTask)
router.delete('/delete-task/:taskId', TodolistController.deleteTask)

module.exports = router
