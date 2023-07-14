const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

//- 進入新增餐廳頁面
router.get('/new', (req, res) => {
  res.render('new')
})

//- 新增餐廳
router.post('/', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

//- 瀏覽一家餐廳的詳細資訊
router.get('/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

//- 進入 edit 頁面
router.get("/:id/edit", (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

//- 修改餐廳
router.put('/:id', (req, res) => {
  const id = req.params.id
  // 找到特定資料並更新
  Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

//- 刪除餐廳
router.delete("/:id", (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .then(restaurant => restaurant.deleteOne())
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

module.exports = router