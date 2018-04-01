/**
 * 发币审核模块
 */
const express = require('express');
const router = express.Router();
const Applycan = require('../../schemaDao/Applycan');
const mongoose = require('mongoose');

// 查询发币信息 /admin/review
router.get('/', function(req, res, next){
    // 手机号，申请日期
    let telphone = req.query.telphone;
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let query = {};
    if(telphone){
        query.telphone = telphone;
    }

    try {
        new Date(startDate).toISOString();
        new Date(startDate).toISOString();
    } catch (error) {
        res.json({code: 201, msg: '时间格式不正确'});
        return;
    }

    if(startDate && endDate){
        startDate = new Date(startDate).toISOString();
        endDate = new Date(startDate).toISOString();
        if(startDate <= endDate){
            query.createtime = {
                '$gte': startDate,
                '$lte': endDate
            }
        }else {
            res.json({code: 203, msg: '开始时间不能大于结束时间'});
            return;
        }
    }else if(startDate && !endDate){
        startDate = new Date(startDate).toISOString();
        endDate = new Date().toISOString();
        query.createtime = {
            '$gte': startDate,
            '$lte': endDate
        }
    }else{
        res.json({code: 202, msg: '开始时间不能为空'});
        return;
    }

    Applycan.find(query, function(err, applycans){
        if(!err && applycans){
            res.json({code: 200, msg: 'success', results: applycans});
        }else{
            res.json({code: 204, msg: '查询失败'});
        }
    });
});

// 操作发币信息 /admin/review/oper
router.get('/oper', function(req, res, next){
    // ids 一个数组，可以多选操作
    let ids = req.query.ids; // 1,2,3,4,5
    
    if(!ids){
        res.json({code: 201, msg: 'ids不能为空'});
        return;
    }
    // 操作状态 1,2
    let isdeal = req.query.isdeal;
    if(!isdeal){
        res.json({code: 201, msg: '操作状态不能为空'});
        return;
    }
    ids = ids.split(',');
    ids = ids.map(element => {
        return mongoose.Types.ObjectId(element);
    });
    let query = {
        _id: {
            $in: ids
        }
    }
    Applycan.update(query, {
        $set: {
            isdeal: isdeal
        }
    },function(err, c){
        if(!err && c){
            res.json({code: 200, msg: '修改成功', modifycount: c});
        }else{
            res.json({code: 201, msg: '修改失败'});
        }
    })


});


module.exports = router;