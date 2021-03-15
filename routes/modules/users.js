const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const passport = require('passport')

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  //存放partial msg的陣列
  const msgs = []
  //檢查所有欄位有無填寫
  if (!name || !email || !password || !confirmPassword) {
    msgs.push({ message: '所有欄位都要填寫!' })
  }
  //檢查兩次輸入密碼是否相符
  if (password !== confirmPassword) {
    msgs.push({ message: '確認密碼不相符!' })
  }
  //先回傳與資料庫無關之錯誤訊息，先行處理
  if (msgs.length) {
    //不加return，程式繼續往下走，會拿不完整資訊來建立user
    return res.render('register', { msgs, name, email, password, confirmPassword })
  }
  User.findOne({ email })
    .then(user => {
      //檢查email有無重複使用 (因為會和資料庫互動，為了降低向其請求次數，最後再檢查)
      if (user) {
        msgs.push({ message: '此email已重複註冊!' })
        return res.render('register', { msgs, name, email, password, confirmPassword })
      }
      //無重複紀錄，創建新user
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ name, email, password: hash }))
        .then(() => {
          req.flash('success_msg', '已註冊成功，請登入使用!')
          res.render('login', { msgs })
        })
    })
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/logout', (req, res) => {
  res.render('login')
})

module.exports = router