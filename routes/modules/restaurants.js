const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

//- 進入新增餐廳頁面
router.get('/new', (req, res) => {
  res.render('new')
})

//- 新增餐廳
router.post('/', (req, res) => {
  const UserId = req.user._id
  console.log("🚀 ~ file: restaurants.js:16 ~ router.post ~ req.body:", req.body)
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body

  Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
    UserId
  })
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

//- 瀏覽一家餐廳的詳細資訊
router.get('/:id', (req, res) => {
  const _id = req.params.id
  const UserId = req.user._id

  Restaurant.findOne({ _id, UserId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

//- 進入 edit 頁面
router.get("/:id/edit", (req, res) => {
  const _id = req.params.id
  const UserId = req.user._id

  Restaurant.findOne({ _id, UserId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

//- 修改餐廳
router.put('/:id', (req, res) => {
  const _id = req.params.id
  const UserId = req.user._id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body

  Restaurant.findOne({ _id, UserId })
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

//- 刪除餐廳
router.delete("/:id", (req, res) => {
  const _id = req.params.id
  const UserId = req.user._id

  Restaurant.findOne({ _id, UserId })
    .then(restaurant => restaurant.deleteOne())
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

module.exports = router