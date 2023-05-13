const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

const restaurantSeeds = require('../../restaurant.json').results

db.once('open', () => {
  restaurantSeeds.forEach(restaurant => {
    Restaurant.create(restaurant)
      .then(() => console.log('success!'))
      .catch(error => console.log(error))
  })

  console.log('done!')
})