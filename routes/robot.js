var express = require('express');
var commonUtils = require("../utils/commonUtils");
var router = express.Router();

/**
 * 解析邀请码
 */
router.get('/analysis', function(req, res, next) {
  // 获取邀请码
  var invitcode = req.query.invitcode;
  // 解析邀请码
  var player12 = commonUtils.aesinvitcode(invitcode);
  if(player12.length === 2) { //解析成功
      // 1、检测验证码是否已经被使用
      
      // 2、若未被使用修改邀请码的使用状态为已经使用
      // 3、分发奖励
  }else {
      // 邀请码无效
      res.json({code: 10019, msg: '邀请码无效', results: []});
  }
});

module.exports = router;