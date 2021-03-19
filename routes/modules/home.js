//require express, express router, model and function
const express = require('express')
const router = express.Router()
const Record = require('../../models/record')

//set homepage route
router.get('/', ((req, res) => {
  const userId = req.user._id
  Record.find({ userId })
    .lean()
    .sort({ date: "desc" })
    .then(records => {
      let totalAmount = 0
      records.forEach(record => totalAmount += record.amount)
      return { records, totalAmount }
    })
    .then(result => res.render('index', result))
    .catch(error => console.log(error))
}))

//export router
module.exports = router
