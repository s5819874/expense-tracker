const Record = require('./models/record')

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

module.exports = getTotalAmount