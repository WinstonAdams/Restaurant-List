const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

//- 首頁 (根目錄)，瀏覽全部所有餐廳
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurantsList => res.render('index', { restaurantsList }))
    .catch(error => console.log(error))
})

//- 搜尋餐廳
router.get('/search', (req, res) => {
  const keywords = req.query.keyword
  const keyword = req.query.keyword.trim().toLowerCase()

  // 若 keyword 沒有輸入內容，重新導向 / 路由(根目錄)
  if (!keyword) {
    return res.redirect('/')
  }

  Restaurant.find()
    .lean()
    .then(restaurants => {
      const restaurantFiltered = restaurants.filter(
        restaurant =>
          restaurant.name.toLowerCase().includes(keyword) || restaurant.category.toLowerCase().includes(keyword))

      res.render('index', { restaurantsList: restaurantFiltered, keywords })
    })
    .catch(error => console.log(error))
})

module.exports = router