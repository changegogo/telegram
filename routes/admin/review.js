/**
 * 发币审核模块
 */
const express = require('express');
const router = express.Router();
const Applycan = require('../../schemaDao/Applycan');
const mongoose = require('mongoose');
const axios = require('axios');
const Promise = require('promise');
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
        ''==startDate?'':new Date(startDate).toISOString();
        ''==endDate?'':new Date(endDate).toISOString();
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
    }else if(!startDate && endDate){
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
const Excel = require('exceljs');
// 导出到excel
router.get('/xlsx', function(req, res, next){
    let telphone = req.query.telphone;
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;

    let promise = new Promise(function(resolve, reject){
        axios.get('http://localhost:3000/admin/review', {
            params: {
                telphone: telphone,
                startDate: startDate,
                endDate: endDate
            }
        })
        .then(function(res){
            resolve(res.data);
        })
        .catch(function(err){
            reject({code: 201, msg: '数据查询失败'});
        })
    });

    promise
    .then(function(value){
        console.log(value);
        let workbook = new Excel.Workbook();
        workbook.creator = 'Me';
        workbook.lastModifiedBy = 'Her';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();

        workbook.views = [
            {
            x: 0, y: 0, width: 10000, height: 20000,
            firstSheet: 0, activeTab: 1, visibility: 'visible'
            }
        ]

        let worksheet = workbook.addWorksheet('Sheet1');
        let headers = [
            { header: '序号', key: '_id',width: 10 },
            { header: '绑定手机号', key: 'telphone',width: 10 },
            { header: '申请日期',  key: 'createTime',width: 20 },
            { header: 'ETH地址', key: 'imtoken',width: 10 },
            { header: 'IP地址', key: 'ip',width: 10 },
            { header: '申请CAN数量', key: 'cancount', width: 20 }
        ]

        // 生成标题头
        worksheet.columns = headers;
        let rows = value.results;

        // let rows = [
        //     [1,'13214299203',new Date()], // row by array
        //     [2,'15383830596',new Date()]
        // ]
        worksheet.addRows(rows);


        res.set('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'youlan');
        res.set('Set-Cookie', 'fileDownload=true; path=/');
        res.attachment("test.xlsx");
        workbook.xlsx.write(res)
        .then(function() {
            res.end();
        });
    })
    .catch(function(value){
        res.end();
    });
});


module.exports = router;