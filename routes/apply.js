/**
 * 提币申请
 */
const express = require('express');
const router = express.Router();
const commonUtils = require('../utils/commonUtils');
const Player = require('../schemaDao/Player');
const Applycan = require('../schemaDao/Applycan');
const threshold = 1880; // 提币阀值
/**
 * 获取验证码
 */
router.post('/smsapi', function(req, res, next){
    // 获取用户识别码
    let identitycode = req.body.identitycode;
    // 验证用户识别码
    if(identitycode) {
        // 临时方案
        //identitycode = identitycode.replace(/ /g, '+');
        let aes = commonUtils.aesidentitycode(identitycode);
        if(aes.length === 2) {
            // 用户识别码有效
            // 随机生成验证码
            let code = commonUtils.generateCode();
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

router.post('/', function(req, res, next){
    // 在提币页面申请提币逻辑
    // 获取验证码
    var smscode = req.body.smscode;
    if(!smscode){
        res.json({code: 10015, msg: "验证码不能为空"});
        return;
    }
    // 获取用户识别码
    let identitycode = req.body.identitycode;
    // 临时方案
    identitycode = identitycode.replace(/ /g, '+');
    if(!identitycode){
        res.json({code: 10016, msg: "用户识别码不能为空"});
        return;
    }
    // 验证验证码
    let sessioncode = req.session.smscode;
    if(!commonUtils.verifySmscode(smscode, sessioncode)){
        res.json({code: 10017, msg: "验证码不正确"});
        return;
    }
    req.session.smscode = null;
    // 验证用户识别码
    let phoneimtoken = commonUtils.aesidentitycode(identitycode);
    if(phoneimtoken.length===0){
        res.json({code: 10018, msg: "用户识别码不正确"});
        return;
    }
    // 程序执行到这里，说明用户识别码和验证码都没有问题
    // 申请提币操作 >188,才允许提币
    //phoneimtoken[0]
    let telphone = phoneimtoken[0];
    let imtoken = phoneimtoken[1];
    let query = {
        telphone: telphone,
        imtoken: imtoken
    };
    Player.findOne(query, function(err, player){
        if(!err){
            if(player){
                // 获取累计can币数
                let totalcancount = player.totalcancount;
                // 获取已申请提can币数
                let haspickupcount = player.haspickupcount;
                //  当前未提币的数量
                let offsetcount = totalcancount - haspickupcount;
                if(offsetcount >= threshold) {
                    // 修改Player库中的已提币数目
                    let sum = haspickupcount + offsetcount;
                    Player.updateOne(query, {
                        $set:{
                            haspickupcount: sum,
                            ispickup: true // 设置为有提币操作
                        }
                    }, function(err, c){
                            console.log(c);
                            // 向库中插入提币申请数据
                            let ip = commonUtils.getIp(req);
                            let applycan = {
                                telphone: telphone,
                                imtoken: imtoken,
                                ip: ip,
                                cancount: offsetcount
                            };
                            Applycan.create(applycan, function(err, applycan){
                                res.json({code: 200, msg: "提币成功",count: offsetcount});
                            });
                    });
                    
                }else {
                    res.json({code: 201, msg: "未达到188枚，不可提币", count: offsetcount});
                }
            }else {
                res.json({code: 10019, msg: "用户不存在"});
            }
        }else{
            res.json({code: 10020, msg: "查询错误"});
        }
    });
    
});

module.exports = router;