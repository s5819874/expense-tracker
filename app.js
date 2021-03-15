//require packages
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes')
require('./config/mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const usePassport = require('./config/passport')




//set template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'YouWillNerverKnow',
  resave: false,
  saveUninitialized: true
}))
app.use(flash())
usePassport(app)

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})

//set routers
app.use(routes)

//start and listen on the server
app.listen(PORT, () => {
  console.log(`App is now running on http://localhost:${PORT}`)
})