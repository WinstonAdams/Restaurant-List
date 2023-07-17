const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

//- 首頁 (根目錄)，瀏覽全部所有餐廳
router.get('/', (req, res) => {
  const UserId = req.user._id
  Restaurant.find({ UserId })
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
  const UserId = req.user._id
  // sort 被賦值為 dropdown box 選擇到的元素的 value
  const { keyword, sort } = req.query

  // 若 keyword 沒有輸入內容，重新導向 / 路由(根目錄)
  if (!keyword) {
    return res.redirect('/')
  }

  Restaurant.find({
    UserId,
    $or: [  // $or：符合其中一個條件即可
      { name: { $regex: keyword, $options: 'ix' } },  // i：不分大小寫； x：忽略所有空白字符
      { category: { $regex: keyword, $options: 'ix' } }
    ]
  })
    .lean()
    .sort(sort)
    .then(restaurants => {
      if (restaurants.length) {
        res.render('index', { restaurantsList: restaurants, keyword, sort })
      } else {
        res.render('searchNoResult', { keyword, sort })
      }
    })
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

module.exports = router