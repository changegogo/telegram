/**
 * 验证码
 * 绑定接口
 */
var express = require('express');
var commonUtils = require("../utils/commonUtils");
var Promise = require('promise');

var Player = require('../schemaDao/Player');

var router = express.Router();

//根据手机号获取短信验证码 
router.get('/smsapi', function(req, res, next){
    // 1、获取手机号码
    var telphone = req.query.telphone;
    // 2、获取IP地址
    //var ip = commonUtils.getIp(req);
    //同ip地址获取的code  10-20个为上限，超出将无法绑定
    if(telphone && commonUtils.verifyPhone(telphone)){
        // 随机生成验证码
        var code = commonUtils.generateCode();
        
        // 将验证码存入session
        req.session.smscode = code;
        // 封装请求体
        var postData = {
            apikey: commonUtils.apikey,
            telphone: telphone,
            url: commonUtils.smsUrl,
            text: commonUtils.text + code
        }
        var promise = new Promise(function(resolve, reject){
            // 2、请求短信验证码第三方平台，发送验证，node后台获取返回的验证码
            setTimeout(function(){
                // 模拟耗时操作
                // 将验证码和手机号存入session
                resolve({code: 200, msg: "短信验证码获取成功", results: [],phcode: telphone, smscode: code});
            }, 0);
        })
        promise.then(function(value){
            res.json(value);
        }).catch(function(err){
            res.json(err);
        });
    }else if(!telphone){
        // 手机号码为空
        res.json({code: 201, msg: "手机号码不能为空", results: []});
    }else{
        // 输入的手机号码不合法
        res.json({code: 202, msg: "手机号码不合法", results: []});
    }
});

// 通过手机号、短信验证码和imtoken进行绑定
router.get('/smsbind', function(req, res, next){
    // 1、获取手机号、短信验证码、imtoken，进行绑定
    /**
     * 判断是否有用户识别码(identitycode)
     * 如果有用户识别码，其他人绑定成功之后，返回邀请码，通过邀请码可以解析出邀请人和被邀请人的账户
     */
    var identitycode = req.query.identitycode;
    
    var telphone = req.query.telphone;
    var smscode = req.query.smscode;
    var imtoken = req.query.imtoken;
    if(telphone && smscode && imtoken){
        // 数据完整
        // 数据验证
        var isSmscode = commonUtils.verifySmscode(smscode,req.session.smscode);
        // 清除短信验证码
        req.session.smscode = null;
        if(!isSmscode){
            res.json({code: 202, msg: "验证码不正确", results: []});
            return;
        }
        var isPhone = commonUtils.verifyPhone(telphone);
        if(!isPhone){
            res.json({code: 202, msg: "手机号码不合法", results: []});
            return;
        }
        var isImtoken = commonUtils.verifyImtoken(imtoken);
        if(!isImtoken){
            res.json({code: 202, msg: "imtoken不合法", results: []});
            return;
        }
        // 获取ip
        var bindip = commonUtils.getIp(req);
        // 同一个ip最多只能绑定20个手机号
        var query = {
            bindip: bindip
        };
        new Promise(function(resolve, reject){
            Player.count(query, function(err, count){
                if(!err){
                    if(count>=20){
                        // 禁止此ip下再绑定
                        reject();
                    }else{
                        resolve();
                    }
                }else{
                    res.json({code:"204", msg: "查询错误", results: []});
                    return;
                }
            })
        }).then(function(){
            console.log("bind");
            // 绑定的逻辑
            /**
             * 1、首先查找库中是否有相应的绑定
             * 2、如果没有，生成对应的邀请码（用户码），将数据插入数据库中
             */
            query = {
                "$or":[
                    {telphone: telphone},
                    {imtoken: imtoken}
                ]
            };
            Player.count(query, function(err, count){
                if(!err){
                    if(count === 0){ // 数据库中没有相应的手机号和imtoken,此时进行绑定逻辑
                        var invitcode = '';
                        if(identitycode){ // 用户识别码存在
                            // 临时方案
                            identitycode = identitycode.replace(/ /g, '+');
                            // 获取邀请人账户
                            var phone = commonUtils.aesidentitycode(identitycode);
                            if(phone.length>0){
                                phone = phone[0];
                                // 生成邀请码
                                invitcode = commonUtils.generateinvitcode(phone, telphone); 
                            }else {
                                invitcode = '';
                            }
                        }
                        
                        // 生成身份识别码
                        var identitycodeself = commonUtils.generateidentitycode(telphone, imtoken);
                        var playerObj = {
                            telphone: telphone,
                            smscode: smscode,
                            imtoken: imtoken,
                            identitycode: identitycodeself,
                            bindip: bindip,
                            invitcode: invitcode
                        };
                        // 插入数据
                        Player.create(playerObj, function(err, player){
                            if(!err && player){
                                req.session.identitycode = identitycodeself;
                                var temp = commonUtils.URLencode(identitycodeself);
                                res.json({code: 200, msg: "绑定成功",identitycode:temp, invitcode: invitcode, results: []});
                            }else{
                                console.log(err);
                                res.json({code: 204, msg: "绑定失败", results: []});
                            }
                        });
                    }else{
                        // 查找是否有手机号和imtoken绑定的记录
                        Player.count({
                            telphone: telphone,
                            imtoken: imtoken
                        }, function(err, count){
                            if(count >= 1){
                                // 将用户识别码存入session，后面提币操作时要验证
                                var idencode = commonUtils.generateidentitycode(telphone, imtoken);
                                idencode = commonUtils.URLencode(idencode);
                                req.session.identitycode = idencode;
                                res.json({code: 200, msg: "手机号和imtoken匹配,登录成功",identitycode:idencode, results: []});
                            }else {
                                res.json({code: 201, msg: "手机号和imtoken不匹配", results: []});
                            }
                        });
                        
                    }
                }else{
                    console.log('查询失败count');
                    res.json({code: 204, msg: "查询失败count"});
                }
            });
        }).catch(function(){
            console.log("forbid bind");
            // 禁止此ip下再绑定
            res.json({code: 205, msg: "禁止绑定", results: []});
        });
    }else if(!telphone){
        // 手机号为空
        res.json({code: 201, msg: "手机号码不能为空", results: []});
        return;
    }else if(!smscode){
        // 短信验证码为空
        res.json({code: 201, msg: "验证码不能为空", results: []});
        return;
    }else if(!imtoken){
        // imtoken为空
        res.json({code: 201, msg: "imtoken不能为空", results: []});
        return;
    }
});

module.exports = router;