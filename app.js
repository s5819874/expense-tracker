//require packages
const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Record = require('./models/record')
const Category = require('./models/category')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

//function
//計算金額
function getTotalAmount(keyword) {
  if (keyword) {
    return (Record.aggregate([
      {
        $match: { category: keyword }
      },
      {
        $group: {
          _id: '',
          sum: { $sum: "$amount" }
        }
      }
    ]))
  } else {
    return (Record.aggregate([
      {
        $group: {
          _id: '',
          sum: { $sum: "$amount" }
        }
      }
    ]))
  }
}

//加入Icon屬性的值
function addIconValue(record) {
  Category.find({ name: record.category })
    .lean()
    .then(category => {
      record.icon = category[0].icon
    })
    .catch(error => console.log(error))
  return record
}


//connect database
mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected')
})

//set template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//set routers
//瀏覽首頁含總金額
app.get('/', ((req, res) => {
  Record.find()
    .lean()
    .then(records => {
      getTotalAmount()
        .then(result => {
          let totalAmount = result[0].sum
          res.render('index', { records, totalAmount })
        })
    })
    .catch(error => console.log(error))
}))

app.get('/records/new', ((req, res) => {
  res.render('new')
}))

app.get('/records/:id/edit', ((req, res) => {
  const id = req.params.id
  Record.findById(id)
    .lean()
    .then(record => res.render('edit', { record }))
    .catch(error => console.log(error))
}))

app.post('/records', ((req, res) => {
  let record = req.body
  Category.find({ name: record.category })
    .lean()
    .then(category => {
      record.icon = category[0].icon
      Record.create(record)
      res.redirect('/')
    })
    .catch(error => console.log(error))
}))

//編輯送出
app.put('/records/:id', ((req, res) => {
  const id = req.params.id
  let recordEdited = req.body
  recordEdited.name = recordEdited.name.trim()
  let attributes = Object.keys(recordEdited)
  Record.findById(id)
    .then(record => {
      attributes.forEach(key => {
        record[key] = recordEdited[key]
      })
      Category.find({ name: recordEdited.category })
        .then(category => {
          record.icon = category[0].icon
          record.save()
          return record
        })
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
}))

//刪除

app.delete('/records/:id', ((req, res) => {
  const id = req.params.id
  Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
}))


//瀏覽類別搜尋含金額
app.get('/records/search_by_category/:category', ((req, res) => {
  const keyword = req.params.category
  Record.find({ category: keyword })
    .lean()
    .then(records => {
      getTotalAmount(keyword)
        .then(result => {
          let totalAmount = result[0].sum
          res.render('index', { records, totalAmount })
        })
    })
    .catch(error => console.log(error))
}))

//start and listen on the server
app.listen(port, () => {
  console.log('Express is now listening on the server!')
})