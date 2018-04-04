const express = require('express');
const router = express.Router();
const axios = require('axios');
const Promise = require('promise');
const sign = require('./sign');

// 公众号字段
const appID = "wxc06857d92c42944b";
const appSecret = "1e9c4371e49190973a2e47f73c6182ef";

router.get('/signture', function(req, res, next){
    // 获取access_token
    const tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appID+'&secret='+appSecret;
    let p1 = function() {
        return new Promise(function(resolve, reject) {
            axios.get(tokenUrl)
            .then(function(response){
                console.log(response);
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
                resolve(response.data.ticket);  
            })
            .catch(function(err){
                reject({code: 201, msg:'ticket获取失败'});
            })
        })
    };

    let p3 = function(ticket){
        return new Promise(function(resolve, reject){
            let signatureStr = sign(ticket, req.body.url);
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
});

module.exports = router;