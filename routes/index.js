//require express and express router
const express = require('express')
const router = express.Router()
const { authenticator } = require('../middleware/auth')

//import modules
const home = require('./modules/home')
const records = require('./modules/records')
const users = require('./modules/users')
const auth = require('./modules/auth')
const { route } = require('./modules/users')

//guide the routes
router.use('/users', users)
router.use('/auth', auth)
router.use('/records', authenticator, records)
router.use('/', authenticator, home)

//export router
module.exports = router