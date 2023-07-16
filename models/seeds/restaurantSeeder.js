const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant')
const User = require('../users')
const db = require('../../config/mongoose')

const restaurantSeeds = require('../../restaurant.json').results

const SEED_USER = [
  {
    name: 'User1',
    email: 'user1@example.com',
    password: '12345678',
    restaurantIndexes: [0, 1, 2],
  },
  {
    name: 'User2',
    email: 'user2@example.com',
    password: '12345678',
    restaurantIndexes: [3, 4, 5],
  }
]

db.once('open', () => {
  Promise.all(SEED_USER.map(USER => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(USER.password, salt))
      .then(hash => User.create({
        name: USER.name,
        email: USER.email,
        password: hash,
      }))
      .then(user => {
        const restaurantSeed = restaurantSeeds.filter((seed, index) => {
          for (let j of USER.restaurantIndexes) {
            if (index === j) {
              seed.UserId = user._id
              return seed
            }
          }
        })
        return Restaurant.create(restaurantSeed)
      })
      .catch(error => {
        console.log(error)
      })
  }))
    .then(() => {
      console.log('done!')
      process.exit()
    })
    .catch(error => {
      console.log(error)
    })
    .finally(() => db.close()) // 執行完後關閉db connection
})