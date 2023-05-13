//* 載入外部的套件
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

//* 載入自己設定的檔案
// 載入路由器 (自動尋找資料夾中的 index.js)
const routes = require('./routes')
// 載入 mongoose 相關的程式碼 (資料庫連線設定)
require('./config/mongoose')

const port = 3000

const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))

// 設定每一筆 request 都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))

// 將 request 導入路由器
app.use(routes)


app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`)
})