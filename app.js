const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant')
const e = require('express')
const restaurant = require('./models/restaurant')

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

app.use(bodyParser.urlencoded({ extended: true }))


//- 根目錄，瀏覽全部所有餐廳
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurantsList => res.render('index', { restaurantsList }))
    .catch(error => console.log(error))
})

//- 進入新增餐廳頁面
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

//- 新增餐廳
app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//- 瀏覽一家餐廳的詳細資訊
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

//- 搜尋餐廳
app.get('/search', (req, res) => {
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

//- 進入 edit 頁面
app.get("/restaurant/:id/edit", (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

//- 修改餐廳 (實際上要使用 PUT)
app.post('/restaurant/:id/edit', (req, res) => {
  const id = req.params.id
  // 找到特定資料並更新
  Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//- 刪除餐廳
app.post("/restaurant/:id/delete", (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})



app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})