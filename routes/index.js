//require express and express router
const express = require('express')
const router = express.Router()

//create get totalAmount function
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

//import modules
const home = require('./modules/home')
const records = require('./modules/records')

//guide the routes
router.use('/', home)
router.use('/records', records)

//export router
module.exports = router