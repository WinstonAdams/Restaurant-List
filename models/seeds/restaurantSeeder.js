const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurant = require('../restaurant')

const restaurantSeeds = require('../../restaurant.json').results

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')

  restaurantSeeds.forEach(restaurant => {
    Restaurant.create(restaurant)
      .then(() => console.log('success!'))
      .catch(error => console.log(error))
  })

  console.log('done!')
})