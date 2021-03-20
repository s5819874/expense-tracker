if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Record = require('../record')
const categoryList = require('./categoryList').categoryList
const User = require('../user')
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')

const seedUsers = [{
  name: 'user1',
  email: 'user1@example.com',
  password: '12345678'
}, {
  name: 'user2',
  email: 'user2@example.com',
  password: '12345678'
}]

db.once('open', () => {
  seedUsers.forEach((seedUser, index) => {
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seedUser.password, salt))
      .then(hash => User.create({ name: seedUser.name, email: seedUser.email, password: hash }))
      .then(user => {
        genRecord(user._id, index)
          .then(() => {
            console.log(`seedUser${index + 1} done!`)
            if (index === 1) return db.close()
          })
      })
      .catch(err => console.log(err))
  })

})

async function genRecord(userId, index) {
  for (let i = 0; i < 3; i++) {
    let ran_index = Math.floor(Math.random() * categoryList.length)
    await Record.create({
      name: 'name-' + (i + 1),
      category: categoryList[ran_index].name,
      amount: 100,
      userId: userId
    })
  }
}
