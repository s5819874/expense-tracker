//require express, express router, model and function
const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const getTotalAmount = require('../../getTotalAmount')

//set homepage route
router.get('/', ((req, res) => {
  Record.find()
    .lean()
    .sort({ date: "desc" })
    .then(records => {
      getTotalAmount()
        .then(result => {
          let totalAmount = result[0].sum
          res.render('index', { records, totalAmount })
        })
    })
    .catch(error => console.log(error))
}))

//export router
module.exports = router
