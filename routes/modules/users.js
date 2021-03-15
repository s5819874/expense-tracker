const express = require('express')
const router = express.Router()

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  //存放partial msg的陣列
  const err_msg = []
  //檢查所有欄位有無填寫
  if (!name || !email || !password || !confirmPassword) {
    err.push({ message: '所有欄位都要填寫!' })
  }
  //檢查兩次輸入密碼是否相符
  if (password !== confirmPassword) {
    err.push({ message: '確認密碼不相符!' })
  }
  //先回傳與資料庫無關之錯誤訊息，先行處理
  if (err_msg.length) {
    res.render('register', { err_msg, name, email, password, confirmPassword })
  }
  User.findOne({ email })
    .then(user => {
      if (user)
    }
  //檢查email有無重複使用 (因為會和資料庫互動，為了降低向其請求次數，最後再檢查)

})

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/logout', (req, res) => {
  res.render('login')
})

module.exports = router