const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const restaurantsList = require('./restaurant.json').results

const app = express()

const port = 3000

//- 資料庫設定
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
})
//- /資料庫設定

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

//- 根目錄，瀏覽全部所有餐廳
app.get('/', (req, res) => {
  // 傳入的 key 和 value 名稱一樣，可以簡寫
  res.render('index', { restaurantsList })
})

//- 瀏覽一家餐廳的詳細資訊
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant_id = req.params.restaurant_id
  const restaurantFound = restaurantsList.find(restaurant => restaurant.id.toString() === restaurant_id)

  res.render('show', { restaurant: restaurantFound })
})

//- 搜尋餐廳
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  // 若 keyword 沒有輸入內容，重新導向 / 路由(根目錄)
  if (!keyword) {
    return res.redirect('/')
  }
  const restaurantFiltered = restaurantsList.filter(restaurant => restaurant.name.toLowerCase().includes(keyword) ||
    restaurant.category.toLowerCase().includes(keyword))

  res.render('index', { restaurantsList: restaurantFiltered, keyword })
})









app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})