const express = require('express');
const router = express.Router();
const axios = require('axios');
const Promise = require('promise');
const sign = require('./sign');

// 公众号字段
const appID = "wxc06857d92c42944b";
const appSecret = "1e9c4371e49190973a2e47f73c6182ef";

//const appID = "wx32da279932a08382";
//const appSecret = "cd9a9bf61d375db27215232355e7b4d7";
// 我的
//const appID = "wx009cbf2052c0174f";
//const appSecret = "dc4510eaeb07582400c354ebdde0da20";

global.wxshare = {
    signs:[]
};

router.get('/weixincall', function(req, res, next){
    console.log("收到微信验证请求");
    // 微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数。
    let signature = req.query.signature;
    // 时间戳
    let timestamp = req.query.timestamp;
    // 随机数
    let nonce = req.query.nonce;
    // 随机字符串
    let echostr = req.query.echostr;
    console.log("signature=" + signature);
    console.log("timestamp=" + timestamp);
    console.log("nonce=" + nonce);
    console.log("echostr=" + echostr);
    if(echostr){
        res.send(echostr);
    }else{
        res.send('123');
    }
    
});

router.get('/signture', function(req, res, next){
    // 请求url参数
    let url = req.query.url || req.body.url;
    //检查页面链接对应的签名是否可用
    var signtag = false;
    var signindex;
    // 检查签名
    global.wxshare.signs.forEach(function (item, index) {
        if (item.url === url) {
            signindex = index;
            if (item.deadline && new Date().getTime() - item.deadline < 6000000) {
                signtag = true;
            }
        }
    });
    //当签名不可用时，检测jsapi_ticket是否可用，来决定是直接请求签名还是先请求jsapi_ticket再请求签名
    if (!signtag) {
        // 获取access_token
        const tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appID+'&secret='+appSecret;
        let p1 = function() {
            return new Promise(function(resolve, reject) {
                axios.get(tokenUrl)
                .then(function(response){
                    console.log(response);
                    // 这里我缓存到了global
                    global.wxshare.access_token = response.data.access_token; //?
                    resolve(response.data.access_token);
                })
                .catch(function(err){
                    reject({code: 201, msg:'access_token获取失败'});
                })
            })
        };

        let p2 = function(access_token) {
            return new Promise(function(resolve, reject) {
                // 获取jsapi_ticket
                let ticketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi';
                axios.get(ticketUrl)
                .then(function(response){
                    console.log(response);
                    // 这里我缓存到了global
                    global.wxshare.jsapi_ticket = response.data.ticket; //?
                    resolve(response.data.ticket);  
                })
                .catch(function(err){
                    reject({code: 201, msg:'ticket获取失败'});
                })
            })
        };

        let p3 = function(ticket){
            return new Promise(function(resolve, reject){
                // 计算signature
                // 先拿一个当前时间戳，这里我缓存到了global
                global.wxshare.deadline = new Date().getTime(); //?
                let signatureStr = sign(ticket, url);
                // 当前时间戳
                signatureStr.deadline = new Date().getTime();
                // 缓存签名
                if(signindex && signindex !== 0){
                    // 签名已经存在，但是过期了
                    global.wxshare.signs[signindex] = signatureStr;
                }else{
                    // 签名没有
                    global.wxshare.signs.push(signatureStr);
                }
                signatureStr.appID = appID;
                resolve(signatureStr);
            });
        }

        p1()
        .then(function(access_token){
            return p2(access_token);
        })
        .then(function(ticket){
            return p3(ticket);
        })
        .then(function(data){
            res.json(data);
        })
        .catch(function(e){
            res.json(e);
        });
    }else{
        res.json(global.wxshare.signs[signindex]);
    }
});

module.exports = router;