//require express, express router, the models, and function
const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const getTotalAmount = require('../../getTotalAmount')

//create page
router.get('/new', ((req, res) => {
  res.render('new')
}))

//create new expense
router.post('/', ((req, res) => {
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


//edit page
router.get('/:id/edit', ((req, res) => {
  const id = req.params.id
  Record.findById(id)
    .lean()
    .then(record => res.render('edit', { record }))
    .catch(error => console.log(error))
}))

//edit expense
router.put('/:id', ((req, res) => {
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

//delete expense
router.delete('/:id', ((req, res) => {
  const id = req.params.id
  Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
}))

//analysis page
router.get('/analysis', ((req, res) => {
  Record.aggregate([{
    "$group": {
      _id: "$category", totalAmount: { "$sum": "$amount" }
    }
  }])
    .sort({ totalAmount: "desc" })
    .then(results => {
      res.render('analysis', { results })
    })
}))

//search by category
router.get('/search_by_category/:category', ((req, res) => {
  const keyword = req.params.category
  Record.find({ category: keyword })
    .lean()
    .then(records => {
      if (records[0]) {
        getTotalAmount(keyword)
          .then(result => {
            let totalAmount = result[0].sum
            res.render('index', { records, totalAmount })
          })
          .catch(error => console.log(error))
      } else {
        res.render('noSearchResult')
      }
    })
    .catch(error => console.log(error))
}))

//export router
module.exports = router