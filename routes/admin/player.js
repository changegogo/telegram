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
    let query = {};
    // 当前页的最后一条记录的id
    let lastid = req.query.lastid || req.body.lastid;
    // 是点击的上一页还是下一页
    let isnext = req.query.isnext || req.body.isnext || 0;// 0表示请求下一页 1表示请求上一页
    
    if(lastid){
        if(isnext){
            query._id = {
                $lt: mongoose.Types.ObjectId(lastid)
            }
        }else{
            query._id = {
                $gt: mongoose.Types.ObjectId(lastid)
            }
        }
    }
    let telphone = req.query.telphone;
    let ispickup = req.query.ispickup;
    if(telphone){
        query.telphone = telphone;
    }
    if(ispickup == 1){ // 有提币申请
        query.ispickup = true;
    }else if(ispickup == 2){ // 无提币申请
        query.ispickup = false;
    }
    
    Player.find(query, function(err, players){
        if(!err){
            res.json({code: 200, msg: 'success', rows: players});
        }else{
            res.json({code: 201, msg: '查询失败'});
        }
    }).sort({createtime:-1}).limit(commonUtils.pagesize);
});

/**
 * 通过id删除
 * 删除玩家信息
 */
router.get('/del', function(req, res, next){
    let id = req.query.id;
    if(!id){
        res.json({code: 201, msg: 'id不能为空'});
        return;
    }
    Player.deleteById(mongoose.Types.ObjectId(id), function(err, c){
        if(!err && c){
            if(c.n===0){
                res.json({code: 201, msg: '用户不存在'});
            }else {
                res.json({code: 200, msg: '删除用户成功'});
            }
        }else{
            res.json({code: 201, msg: '数据库异常'});
        }
    });
});

/**
 * 编辑用户信息
 */
/*router.get('/edit', function(req, res, next){
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
});*/


module.exports = router;


