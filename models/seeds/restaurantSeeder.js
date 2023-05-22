const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

const restaurantSeeds = require('../../restaurant.json').results

db.once('open', () => {
  Restaurant.create(restaurantSeeds) // .create 可以傳入一個陣列，一次新增多筆資料
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
    .finally(() => db.close()) // 執行完後關閉db connection

  console.log('done!')
})