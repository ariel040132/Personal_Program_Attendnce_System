const express = require("express");
const router = express.Router();
// const { authenticator } = require("../middleware/auth");

router.get('/', (req, res) => {
  res.render('index'); // 渲染名為 "index" 的視圖模板
});


module.exports = router;