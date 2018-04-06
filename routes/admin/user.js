/**
 * 后台管理登录登出注册
 */
const express = require('express');
const router = express.Router();

const User = require('../../schemaDao/User');
const crypto = require('crypto');
const salt = '123';

// 加密密码
let hash, encode;
function encryption(password){
    password = password + salt;
    for(let i=0; i<3; i++){
        hash = crypto.createHash('md5');
        hash.update(new Buffer(password, 'binary'));
        encode = hash.digest('hex');
        password = encode;
    }
    return encode;
}
// loginin
router.post('/loginin', function(req, res, next){
    // 获取用户名和密码
    let username = req.body.username;
    let password = req.body.password;
    if(!username || !password){
        res.json({code: 201, msg: '用户名或密码不能为空'});
        return;
    }
    password = encryption(password); //进行加密

    User.findOne({
        username: username,
        password: password
    },function(err, user){
        if(!err && user){
            req.session.username = username;
            req.session.password = password;
            res.json({code: 200, msg: '登录成功'});
        }else {
            res.json({code: 201, msg: '密码或用户名不正确'});
        }
    });

});

// loginout
router.get('/loginout', function(req, res, next){
    req.session.username = null;
    req.session.password = null;
    res.json({code: 200, msg: '登出成功'});
});

// register
router.post('/register', function(req, res, next){
    let username = req.body.username;
    let password = req.body.password;
    if(!username || !password){
        res.json({code: 201, msg: '用户名或密码不能为空'});
        return;
    }
    password = encryption(password); //进行加密

    User.count({
        username: username
    }, function(err, c){
        if(!err && c===0){
            // 添加用户
            User.create({
                username: username,
                password: password
            },function(err, user){
                if(!err && user){
                    res.json({code: 200, msg: "注册成功"});
                }else{
                    res.json({code: 201, msg: "注册失败"});
                }
            })
        }else{
            res.json({code: 201, msg: "用户已注册"});
        }
    });

});

// retrieve the password
router.post('/retrypass', function(req, res, next){
    res.end();
});

module.exports = router;