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

module.exports = router;