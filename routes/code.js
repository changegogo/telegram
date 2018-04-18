/**
 * 验证码
 * 绑定接口
 */
const express = require('express');
const commonUtils = require("../utils/commonUtils");
const Promise = require('promise');

const Player = require('../schemaDao/Player');

const router = express.Router();

const accessKeyId = commonUtils.accessKeyId;
const secretAccessKey = commonUtils.secretAccessKey;
const SMSClient = require('@alicloud/sms-sdk');



//根据手机号获取短信验证码 
router.get('/smsapi', function(req, res, next){
    // 1、获取手机号码
    let telphone = req.query.telphone;
    if(telphone && commonUtils.verifyPhone(telphone)){
        // 随机生成验证码
        let code = commonUtils.generateCode();
        console.log(code);
        // 将验证码存入session
        req.session.cookie.maxAge = 5 * 60 * 1000;
        req.session.smscode = code;
        // 将手机号存入session
        req.session.telphone = telphone;
        // 封装请求体
        let postData = {
            PhoneNumbers: telphone,
            SignName: commonUtils.SignName,
            TemplateCode: commonUtils.TemplateCode,
            TemplateParam: `{"code": "${code}"}`
        };
        //初始化sms_client
        let smsClient = new SMSClient({accessKeyId, secretAccessKey});
        let promise = new Promise(function(resolve, reject){
            smsClient.sendSMS(postData)
            .then(function (res) {
                let {Code}=res
                if (Code === 'OK') {
                    //处理返回参数
                    //console.log(res);
                    resolve({code: 200, msg: "短信验证码获取成功", results: []});
                }else {
                    resolve({code:201, msg: '短信验证码获取失败'});
                }
            }, function (err) {
                console.log(err);
                reject(err);
            });
        })
        promise.then(function(value){
            res.json(value);
        }).catch(function(err){
            res.json(err);
        });
        //res.json({code: 200, msg: "短信验证码获取成功", smscode: code, telphone: telphone});
    }else if(!telphone){
        // 手机号码为空
        res.json({code: 201, msg: "手机号码不能为空", results: []});
    }else{
        // 输入的手机号码不合法
        res.json({code: 202, msg: "手机号码不合法", results: []});
    }
});

// 通过手机号、短信验证码和imtoken进行绑定
router.post('/smsbind', function(req, res, next){
    // 1、获取手机号、短信验证码、imtoken，进行绑定
    /**
     * 判断是否有用户识别码(identitycode)
     * 如果有用户识别码，其他人绑定成功之后，返回邀请码，通过邀请码可以解析出邀请人和被邀请人的账户
     */
    let identitycode = req.body.identitycode;
    
    let telphone = req.body.telphone;
    let smscode = req.body.smscode;
    let imtoken = req.body.imtoken;

    if(!telphone){
        // 手机号为空
        res.json({code: 201, msg: "手机号码不能为空", results: []});
        return;
    }
    if(!smscode){
        // 短信验证码为空
        res.json({code: 201, msg: "验证码不能为空", results: []});
        return;
    }
    if(!imtoken){
        // imtoken为空
        res.json({code: 201, msg: "imtoken不能为空", results: []});
        return;
    }

    //验证手机号是否格式正确
    let isPhone = commonUtils.verifyPhone(telphone);
    if(!isPhone){
        res.json({code: 202, msg: "手机号码不合法", results: []});
        return;
    }

    // session中的手机号和传过来的手机号对比
    let isTelphone = commonUtils.verifyTelphone(telphone,req.session.telphone);
    if(!isTelphone){
        res.json({code: 202, msg: "请获取短信验证码", results: []});
        return;
    }

    let isSmscode = commonUtils.verifySmscode(smscode,req.session.smscode);
    if(!isSmscode){
        res.json({code: 202, msg: "验证码不正确", results: []});
        return;
    }
    
    let isImtoken = commonUtils.verifyImtoken(imtoken);
    if(!isImtoken){
        res.json({code: 202, msg: "imtoken不合法", results: []});
        return;
    }
    // 1.查找数据库中有没有匹配的手机号和intoken，如果有直接登录，如果没有进行绑定
    let p1 = function(){
        return new Promise(function(resolve, reject){
            Player.count({
                "$or":[
                    {telphone: telphone},
                    {imtoken: imtoken}
                ]
            }, function(err, c){
                if(!err){
                    resolve(c);
                }else{
                    reject({code: 201, msg: '数据库查询错误codep1'});
                }
            });
        });
    }
    // 判断手机号和imtoken是否配置，匹配即登录，否则不能登录
    let p2 = function(count){
        return new Promise(function(resolve, reject){
            if(count >= 1){ // 说明手机号或者imtoken已经注册绑定
                // 进一步验证手机号和imtoken是否匹配
                Player.count({
                    telphone: telphone,
                    imtoken: imtoken
                }, function(err, c){
                    if(!err){
                        if(c >= 1){
                            // 将用户识别码存入session，后面提币操作时要验证
                            let idencode = commonUtils.generateidentitycode(telphone, imtoken);
                            // 说明有匹配的注册用户，直接登录
                            reject({code: 200, msg: "手机号和imtoken匹配,登录成功",identitycode:idencode});
                            // 清除短信验证码
                            req.session.telphone = null;
                            req.session.smscode = null;
                        }else{
                            // 手机号和imtoken不匹配
                            reject({code: 201, msg: "手机号和imtoken不匹配"});
                        }
                    }else{
                        reject({code: 201, msg: '数据库查询错误codep2'});
                    }
                });
            }else{ // 手机号和imtoken都未注册过
                // 获取ip
                let bindip = commonUtils.getIp(req);
                resolve(bindip);
            }
        });
    }
    // 判断绑定ip是否已达上限
    let p3 = function(ip){
        return new Promise(function(resolve, reject){
            Player.count({
                bindip: ip
            }, function(err, c){
                if(!err){
                    //commonUtils.iptop
                    if(c >= commonUtils.iptop){
                        reject({code: 201, msg: "已达上限，禁止绑定"});
                    }else{
                        // 可以绑定
                        resolve(ip);
                    }
                }else{
                    reject({code: 201, msg: '数据库查询错误codep3'});
                }
            });
        });
    }
    // 可以绑定
    let p4 = function(bindip){
        return new Promise(function(resolve, reject){
            let invitcode = '';
            if(identitycode){ // 用户识别码存在
                // 获取邀请人账户
                let phone = commonUtils.aesidentitycode(identitycode);
                if(phone.length>0){
                    phone = phone[0];
                    // 生成邀请码
                    if(phone != telphone){
                        invitcode = commonUtils.generateinvitcode(phone, telphone); 
                    }else{
                        invitcode = commonUtils.generateinvitcode('110', telphone);
                    }
                }else {
                    // 生成邀请码,表示第一次注册
                    invitcode = commonUtils.generateinvitcode('110', telphone);
                }
            }else {
                // 生成邀请码,表示第一次注册
                invitcode = commonUtils.generateinvitcode('110', telphone);
            }
            
            // 生成被邀请人身份识别码
            let identitycodeself = commonUtils.generateidentitycode(telphone, imtoken);
            let playerObj = {
                telphone: telphone,
                imtoken: imtoken,
                identitycode: identitycodeself,
                bindip: bindip,
                invitcode: invitcode
            };
            // 插入被邀请人数据
            Player.create(playerObj, function(err, player){
                if(!err && player){
                    //req.session.identitycode = identitycodeself;
                    resolve({code: 200, msg: "绑定成功",identitycode:identitycodeself, invitcode: invitcode});
                    // 清除短信验证码
                    req.session.telphone = null;
                    req.session.smscode = null;
                }else{
                    reject({code: 204, msg: "绑定失败"});
                }
            });
        });
    }

    // async function tasks(){
    //     let telOrImCount = await p1();
    //     let ip = await p2(telOrImCount);
    //     let ipcopy = await p3(ip);
    //     let obj = p4(ipcopy);
    //     res.json(obj);
    // }
    // tasks.catch(obj=>{
    //     res.json(obj);
    // });

    p1()
    .then(function(c){
        return p2(c);
    })
    .then(function(ip){
        return p3(ip);
    })
    .then(function(bindip){
        return p4(bindip);
    })
    .then(function(data){
        res.json(data);
    })
    .catch(function(obj){
        res.json(obj);
    });
});

module.exports = router;