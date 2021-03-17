const Record = require('./models/record')

//create get totalAmount function
function getTotalAmount(category) {
  if (category) {
    return (Record.aggregate([
      {
        $match: { category }
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