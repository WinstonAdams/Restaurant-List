const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

const restaurantSeeds = require('../../restaurant.json').results

db.once('open', () => {
  Restaurant.create(restaurantSeeds)
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
    .finally(() => db.close()) // 執行完後關閉db connection

  console.log('done!')
})