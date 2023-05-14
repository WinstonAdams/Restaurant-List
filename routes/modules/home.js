const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

//- 首頁 (根目錄)，瀏覽全部所有餐廳
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' }) // 排序，根據 _id 升冪排序，(降冪排序用 'desc')
    .then(restaurantsList => res.render('index', { restaurantsList }))
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

//- 搜尋餐廳
router.get('/search', (req, res) => {
  // sort 被賦值為 dropdown box 選擇到的元素的 value
  const { keyword, sort } = req.query
  const keywordLowerCase = req.query.keyword.trim().toLowerCase()

  // 若 keyword 沒有輸入內容，重新導向 / 路由(根目錄)
  if (!keyword) {
    return res.redirect('/')
  }

  Restaurant.find()
    .lean()
    .sort(sort)
    .then(restaurants => {
      const restaurantFiltered = restaurants.filter(
        restaurant =>
          restaurant.name.toLowerCase().includes(keywordLowerCase) || restaurant.category.toLowerCase().includes(keywordLowerCase))

      if (restaurantFiltered.length) {
        res.render('index', { restaurantsList: restaurantFiltered, keyword })
      } else {
        res.render('searchNoResult', { keyword })
      }
    })
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

module.exports = router