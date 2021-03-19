//require express, express router, the models, and function
const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const moment = require('moment')
const record = require('../../models/record')

//create page
router.get('/new', ((req, res) => {
  res.render('new')
}))

//create new expense
router.post('/', ((req, res) => {
  const userId = req.user._id
  let record = req.body
  Category.find({ name: record.category })
    .lean()
    .then(category => {
      record.icon = category[0].icon
      Record.create({ ...record, userId })
        .then(res.redirect('/'))
    })
    .catch(error => console.log(error))
}))


//edit page
router.get('/:id/edit', ((req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  Record.findOne({ _id, userId })
    .lean()
    .then(record => res.render('edit', { record }))
    .catch(error => console.log(error))
}))

//edit expense
router.put('/:id', ((req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  Record.findOne({ _id, userId })
    .then(record => {
      record = Object.assign(record, req.body)
      Category.find({ name: record.category })
        .then(category => {
          record.icon = category[0].icon
          return record.save()
        })
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
}))

//delete expense
router.delete('/:id', ((req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
}))

//analysis page
router.get('/analysis', ((req, res) => {
  const userId = req.user._id
  Record.aggregate([
    {
      $match: { userId }
    },
    {
      "$group": {
        _id: "$category", totalAmount: { "$sum": "$amount" }
      }
    }
  ])
    .sort({ totalAmount: "desc" })
    .then(results => {
      res.render('analysis', { results })
    })
}))

//filter of month and category
router.get('/filter', (req, res) => {
  const userId = req.user._id
  let { category, month } = req.query
  console.log(req.query)
  if (category && month) {
    Record.aggregate([
      { $addFields: { month: { $month: "$date" } } },
      { $match: { month: parseInt(month), category, userId } }
    ])
      .then(records => {
        let totalAmount = 0
        records.forEach(record => {
          totalAmount += record.amount
          record.date = moment(record.date).format("YYYY-MM-DD")
        })
        res.render('index', { records, totalAmount })
      })
  } else {
    Record.aggregate([
      { $addFields: { month: { $month: "$date" } } },
      { $match: { userId } },
      { $match: { $or: [{ month: parseInt(month) }, { category: category }] } }
    ])
      .then(records => {
        let totalAmount = 0
        records.forEach(record => {
          totalAmount += record.amount
          record.date = moment(record.date).format("YYYY-MM-DD")
        })
        res.render('index', { records, totalAmount, category, month })
      })
  }
})

//search
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const userId = req.user._id
  return Record.find({
    userId,
    $or: [
      {
        name: {
          $regex: keyword,
          $options: 'i'
        }
      },
      {
        merchant: {
          $regex: keyword,
          $options: 'i'
        }
      },
    ]
  })
    .lean()
    .then(records => {
      records.forEach(record => record.date = moment(record.date).format("YYYY-MM-DD"))
      res.render('index', { records, keyword })
    })
    .catch(err => res.send(err))
})

//export router
module.exports = router