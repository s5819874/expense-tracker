const Record = require('../record')
const categoryList = require('./categoryList').categoryList
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  for (let i = 0; i < 5; i++) {
    let ran_index = Math.floor(Math.random() * categoryList.length)
    let date = (new Date()).toDateString()
    Record.create({
      name: 'name-' + i,
      category: categoryList[ran_index].name,
      date: date,
      amount: 100
    })
  }
  console.log('record seeds established!')
})
