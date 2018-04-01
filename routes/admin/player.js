/**
 * 后台管理页面获取玩家的信息
 */
const express = require('express');
const router = express.Router();

const Player = require('../../schemaDao/Player');
const commonUtils = require('../../utils/commonUtils');
const mongoose = require('mongoose');
// 获取用户信息
router.get('/', function(req, res, next){
    let telphone = req.query.telphone;
    let ispickup = req.query.ispickup;
    let query = {};
    if(telphone && ispickup){
        query = {
            telphone: telphone,
            ispickup: ispickup
        };
    }else if(telphone && !ispickup){
        query = {
            telphone: telphone
        };
    }else if(!telphone && ispickup){
        query = {
            ispickup: ispickup
        };
    }

    Player.count(query, function(err, c){
        if(!err && c){
            Player.find(query, function(err, players){
                res.json({code: 200, msg: 'success',total: c, results: players});
            });
        }else{
            res.json({code: 201, msg: '查询失败'});
        }
    });
});

/**
 * 编辑用户信息
 */
router.get('/edit', function(req, res, next){
    // 记录id
    let _id = req.query.id;
    if(!_id) {
        res.json({code: 201, msg: 'id不能为空'});
        return;
    }
    获取手机号码
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
    }
    Player.updateById(
        mongoose.Types.ObjectId(_id), 
        update, 
        function(err, c){
            if(!err && c){
                res.json({code: 200, msg: '更新成功'});
            }else{
                res.json({code: 201, msg: '更新失败'});
            }  
        }
    );
});


module.exports = router;