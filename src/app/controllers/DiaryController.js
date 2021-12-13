const DiaryModel = require('../models/DiaryModel')

class DiaryController {
   // [GET]: /diaries
   getDiaries = async function (req, res) {
      console.log('getDiaries')
      const userId = req.user._id
      console.log('userId:', userId)
      try {
         const diaries = await DiaryModel.find({ userId })
         res.status(200).json(diaries)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [POST]: /diaries/create
   createDiary = async function (req, res) {
      console.log('createDiary')
      const data = req.body
      console.log('data:', data)
      try {
         const diary = new DiaryModel(data)
         const newDiary = await diary.save()
         res.status(200).json(newDiary)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [PUT]: /diaries/edit/:diaryId
   editDiary = async function (req, res) {
      console.log('createDiary')
      const diaryId = req.params.diaryId
      const data = req.body
      console.log('diaryId: ', diaryId)
      try {
         const diaryUpdated = await DiaryModel.findOneAndUpdate({ _id: diaryId }, data, {
            new: true,
         })
         res.status(200).json(diaryUpdated)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [DELETE]: /diaries/delete
   deleteDiary = async function (req, res) {
      console.log('deleteDiary')
      const diaryId = req.params.diaryId
      try {
         const diaryDeleted = await DiaryModel.findByIdAndDelete(diaryId)
         res.status(200).json(diaryDeleted)
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new DiaryController()
