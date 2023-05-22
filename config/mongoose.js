const mongoose = require('mongoose')


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 設定連線到 MongoDB (MONGODB_URL 設定在 .env 檔案)
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db