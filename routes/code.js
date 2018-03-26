var express = require('express');
var commonUtils = require("../utils/commonUtils");
//var Promise = require('promise');
var router = express.Router();

//根据手机号获取短信验证码 
router.get('/smsapi', function(req, res, next){
    // 1、获取手机号码
    var telphone = req.query.telphone;
    if(telphone && commonUtils.verifyPhone(telphone)){
        // 后台随机生成验证码
        var code = commonUtils.generateCode();
        // 封装请求体
        var postData = {
            apikey: commonUtils.apikey,
            telphone: telphone,
            url: commonUtils.smsUrl,
            text: commonUtils.text + code
        }
        // var promise = new Promise(function(resolve, reject){
        //     // 2、请求短信验证码第三方平台，发送验证，node后台获取返回的验证码
        //     setTimeout(function(){
        //         // 模拟耗时操作
        //         // 将验证码和手机号存入redis
        //         resolve({code: 200, msg: "短信验证码获取成功", phcode: telphone});
        //     }, 2000);
        // })
        // promise.then(function(value){
        //     res.json(value);
        // }).catch(function(err){
        //     res.json(value);
        // })
        
    }else if(!telphone){
        // 手机号码为空
        res.json({code: 201, msg: "手机号码不能为空"});
    }else{
        // 输入的手机号码不合法
        res.json({code: 202, msg: "手机号码不合法"});
    }
});

// 通过手机号、短信验证码和imtoken进行绑定
router.get('/smsbind', function(req, res, next){
    // 1、获取手机号、短信验证码、imtoken，进行绑定
    // 绑定的逻辑
    res.json({code: 200, msg: "绑定成功"});
});

module.exports = router;