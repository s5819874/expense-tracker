const Category = require('../category')
const categoryList = require('./categoryList').categoryList

const db = requiure('../../config/mongoose')

db.once('open', () => {

  Category.create(categoryList)
    .then(() => {
      console.log('category seeds established!')
      return db.close()
    })
    .then(() => {
      console.log('database disconnected!')
    })

})

