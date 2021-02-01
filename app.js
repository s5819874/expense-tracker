//require packages
const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')

//connect database
mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected')
})