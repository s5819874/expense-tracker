const Category = require('../category')
const categoryList = require('./categoryList').categoryList
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  categoryList.forEach(category => {
    Category.create({
      name: category.name,
      name_ch: category.name_ch,
      icon: category.icon_class
    })
  })
  console.log('mongodb connected!')
})

