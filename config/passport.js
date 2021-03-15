const passport = require('passport')
const LocalSrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')


module.exports = (app) => {
  //初始化模組
  app.use(passport.initialize())
  app.use(passport.session())
  //設定登入策略
  passport.use(new LocalSrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('warning_msg', '此email未註冊!'))
        }
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, req.flash('warning_msg', '密碼錯誤!'))
            }
            return done(null, user)
          })
      })
      .catch(err => done(err, false))
  }))
  //設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => res.send(err))
  })
}