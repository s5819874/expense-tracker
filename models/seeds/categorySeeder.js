const Category = require('../category')
const categoryList = require('./categoryList').categoryList
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {

  Category.create(categoryList)
    .then(() => {
      console.log('category seeds established!')
      return db.close()
    })
    .then(() => {
      console.log('database disconnected!')
    })

})

