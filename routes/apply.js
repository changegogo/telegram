/**
 * 提币申请
 */
var express = require('express');
var router = express.Router();
var commonUtils = require('../utils/commonUtils');

/**
 * 获取验证码
 */
router.get('/smsapi', function(req, res, next){
    // 获取用户识别码
    var identitycode = req.query.identitycode;
    // 验证用户识别码
    if(identitycode) {
        // 临时方案
        identitycode = identitycode.replace(/ /g, '+');
        var aes = commonUtils.aesidentitycode(identitycode);
        if(aes.length === 2) {
            // 用户识别码有效
            // 随机生成验证码
            var code = commonUtils.generateCode();
            // 写入session
            req.session.smscode = code;
            res.json({code: 200, msg: "短信验证码获取成功", smscode: req.session.smscode});
        }else {
            // 用户识别码无效
            res.json({code: 10014, msg: "用户识别码无效"});
        }
    }else {
        // 用户识别码不能为空
        res.json({code: 10015, msg: "用户识别码不能为空"});
    }
});

router.get('/', function(req, res, next){
    // 获取验证码
    var smscode = req.query.smscode;
    if(!smscode){
        res.json({code: 10015, msg: "验证码不能为空"});
        return;
    }
    // 获取用户识别码
    var identitycode = req.query.identitycode;
    // 临时方案
    identitycode = identitycode.replace(/ /g, '+');
    if(!identitycode){
        res.json({code: 10016, msg: "用户识别码不能为空"});
        return;
    }
    // 验证验证码
    if(!commonUtils.verifySmscode(smscode, req.session.smscode)){
        res.json({code: 10017, msg: "验证码不正确"});
        return;
    }
    // 验证用户识别码
    var phoneimtoken = commonUtils.aesidentitycode(identitycode);
    if(phoneimtoken.length===0){
        res.json({code: 10018, msg: "用户识别码不正确"});
        return;
    }
    // 程序执行到这里，说明用户识别码和验证码都没有问题
    // 申请提币操作 >188,才允许提币
    //phoneimtoken[0]
    res.json(phoneimtoken);
});

module.exports = router;