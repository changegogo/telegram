/**
 * 玩家详情
 */
var express = require('express');
var commonUtils = require('../utils/commonUtils');
var router = express.Router();
var Player = require('../schemaDao/Player');

/**
 * 获取用户识别码对应的玩家的信息
 */
router.post('/', function(req, res, next){
    // 用户识别码
    var identitycode = req.body.identitycode;
    if(identitycode){
        // 临时方案
        //identitycode = identitycode.replace(/ /g, '+');
        // 通过用户识别码，获取对应记录的全部信息
        var query = {
            identitycode: identitycode
        };
        Player.findOne(query, function(err, player){
            if(player){
                var p = player;
                res.json({code: 200, msg:"success", results: [p]});
            }else{
               // 查询的用户不存在
               res.json({code: 10004, msg: "用户不存在", results: []});
            }
        });
    }else {
        res.json({code: 10005, msg: "识别码不能为空", results: []});
    }
});

/**
 * 后台管理页面获取玩家的信息
 * TODO
 */
router.post('/admin', function(req, res, next){
    let query = {};
    let telphone = req.body.telphone;
    //let 
    Player.find({}, function(err, players){
        res.json({code: 200, msg: 'success', results: players});
    })
});

/**
 * 编辑
 */
router.get('/edit', function(req, res, next){
    // 记录id
    let _id = req.query._id;
    if(!_id) {
        res.json({code: 201, msg: 'id不能为空'});
        return;
    }
    // 获取手机号码
    let telphone = req.query.telphone;
    let isPhone = commonUtils.verifyPhone(telphone);
    if(!isPhone) {
        res.json({code: 201, msg: '手机号码格式不正确'});
        return;
    }
    let sharecount = req.query.sharecount;
    let imtoken = req.query.imtoken;
    let update = {};
    if(sharecount && imtoken){
        update = {
            $set: {
                sharecount: sharecount,
                imtoken: imtoken
            }
        }
    }else if(sharecount && !imtoken){
        update = {
            $set: {
                sharecount: sharecount
            }
        }
    }else if(!sharecount && imtoken){
        update = {
            $set: {
                imtoken: imtoken
            }
        }
    }else {
        update = {}
    }
    // TODO
    res.end();
     
});


module.exports = router;