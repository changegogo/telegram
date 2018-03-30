const express = require('express');
const router = express.Router();

const User = require('../../schemaDao/User');

// 加密密码
function encryption(str){
    return str;
}
// loginin
router.post('/loginin', function(req, res, next){
    // 获取用户名和密码
    let username = req.body.username;
    let password = req.body.password;
    password = encryption(password); //进行加密

    if(!username || !password){
        res.json({code: 201, msg: '用户名或密码不能为空'});
        return;
    }

    User.findOne({
        username: username,
        password: password
    },function(err, user){
        if(!err && user){
            req.session.username = username;
            req.session.password = password;
            res.json({code: 200, msg: '登录成功'});
        }else {
            res.json({code: 201, msg: '登录失败'});
        }
    })

});

// loginout
router.get('/loginout', function(req, res, next){
    req.session.username = null;
    req.session.password = null;
    res.json({code: 200, msg: '登出成功'});
});

// register
router.post('/register', function(req, res, next){
    res.end();
});

// retrieve the password
router.post('/retrypass', function(req, res, next){
    res.end();
});

module.exports = router;