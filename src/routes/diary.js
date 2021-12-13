const express = require('express')
const router = express.Router()

const DiaryController = require('../app/controllers/DiaryController')

router.get('/', DiaryController.getDiaries)
router.post('/create', DiaryController.createDiary)
router.put('/edit/:diaryId', DiaryController.editDiary)
router.delete('/delete/:diaryId', DiaryController.deleteDiary)

module.exports = router
