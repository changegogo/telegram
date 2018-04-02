const express = require('express');
const router = express.Router();
const Replyrule = require('../../schemaDao/Replyrule');
const mongoose = require('mongoose');
// 添加回复规则
router.post('/add', function(req, res, next){
   // 规则名称
   let rulename = req.body.rulename;
   if(!rulename){
       res.json({code: 201, msg: '规则名称不能为空'});
       return;
   }
   // 关键词
   let keywords = req.body.keywords;
   if(!keywords){
       res.json({code: 201, msg: '关键词不能为空'});
       return;
   }
   keywords = keywords.split(',');
   // 回复内容
   let replycontent = req.body.replycontent;
   if(!replycontent){
       res.json({code: 201, msg: '回复内容不能为空'});
       return;
   }
   Replyrule.create({
    rulename: rulename,
    keywords: keywords,
    replycontent: replycontent
   },function(err, replyrules){
        if(!err && replyrules){
            res.json({code: 200, msg: '添加成功'});
        }else{
            res.json({code: 201, msg: '添加失败'});
        }
   });
});
// 修改规则状态
router.get('/editstatus', function(req, res, next){
    let id = req.query.id;
    let status = req.query.status;
    if(!id){
        res.json({code: 201, msg: 'id不能为空'});
        return;
    }
    if(!status){
        res.json({code: 201, msg: '状态不能为空'});
        return;
    }

    Replyrule.updateById(mongoose.Types.ObjectId(id), {
        $set: {status: status}
    }, function(err, c){
        if(!err && c){
            res.json({code: 200, msg: '修改成功'});
        }else{
            res.json({code: 201, msg: '修改失败'});
        }
    });
});

// 编辑已有规则
router.get('/editother', function(req, res, next){
    let id = req.query.id;
    delete req.query.id;
    Replyrule.updateById(mongoose.Types.ObjectId(id), {
        $set: req.query
    },function(err, c){
        if(!err && c){
            res.json({code: 200, msg: '更新成功'});
        }else {
            res.json({code: 201, msg: '更新失败'});
        }
    });
    
});

module.exports = router;