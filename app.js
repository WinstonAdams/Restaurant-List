const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const restaurantsList = require('./restaurant.json').results
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main.handlebars' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {
  // 傳入的 key 和 value 名稱一樣，可以簡寫
  res.render('index.handlebars', { restaurantsList })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant_id = req.params.restaurant_id
  const restaurantFound = restaurantsList.find(restaurant => restaurant.id.toString() === restaurant_id)

  res.render('show.handlebars', { restaurant: restaurantFound })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  // 若 keyword 沒有輸入內容，重新導向 / 路由(根目錄)
  if (!keyword) {
    return res.redirect('/')
  }
  const restaurantFiltered = restaurantsList.filter(restaurant => restaurant.name.toLowerCase().includes(keyword) ||
    restaurant.category.toLowerCase().includes(keyword))

  res.render('index.handlebars', { restaurantsList: restaurantFiltered, keyword })
})


app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})