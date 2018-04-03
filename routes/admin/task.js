const express = require('express');
const router = express.Router();

const Task = require('../../schemaDao/Task');
const schedule = require('node-schedule');
const mongoose = require('mongoose');

// 程序启动时，加载任务
global.taskMap = new Map();
// 添加任务
router.get('/add', function(req, res, next){
    // 获取任务类型
    let tasktype = req.query.tasktype || req.body.tasktype;
    if(tasktype != 0 && tasktype != 1 && tasktype != 2){
        res.json({code: 201, msg: '任务类型不正确'});
        return;
    }
    let obj = {
        dayOfWeek: new Array(),
        year: new Array(),
        month: new Array(),
        day: new Array(),
        hour: new Array(),
        minute: new Array(),
        second: new Array(),
        tasktype: 0,
        tasktext: '',
        taskstatus: 1
    };
    if(tasktype == 0){
        // 定时任务
        let datatime = req.query.datatime || req.body.datatime; // 2018/04/03 19:28:30
        let dt = datatime.split(' ');
        let [d, t] = dt;
        let [nian, yue, ri] = d.split('/');
        let [shi, fen, miao] = t.split(':');
        obj.year.push(parseInt(nian));
        obj.month.push(parseInt(yue)-1);
        obj.day.push(parseInt(ri));
        obj.hour.push(parseInt(shi));
        obj.minute.push(parseInt(fen));
        obj.second.push(parseInt(miao));
        // 任务内容
        let tasktext = req.query.tasktext || req.body.tasktext;
        obj.tasktext = tasktext;
        
        // 添加到数据库
        Task.create(obj, function(err, task){
            if(!err && task){
                // 开启定时任务
                console.log(task);
                let time = new Date(task.year[0], task.month[0], task.day[0], task.hour[0], task.minute[0], task.second[0]);
                // 开启定时任务
                let job = schedule.scheduleJob(time, function(id){
                    console.log('任务执行了');
                    // 从缓存中移除任务
                    global.taskMap.delete(id);
                    // 添加任务结果
                    Task.updateById(mongoose.Types.ObjectId(id),{
                        $push: {
                            taskresults: {msg:'已执行', time: Date.now()}
                        }
                    },function(err, c){
                        console.log(c);
                    });
                    
                }.bind(null, task.id));
                // 缓存任务
                if(job){
                    global.taskMap.set(task.id, job);
                }
                res.json({code: 200, msg: '任务开启成功'});
            }else{
                res.json({code: 201, msg: '添加任务失败'});
            }
        });
    }else if(tasktype == 1){
        // 重复任务

    }else{
        // 立即执行任务
        
    }
});

// 查看global.taskmap
router.get('/map', function(req, res, next){
    console.log(global.taskMap);
    res.end();
});

// 删除任务

// 关闭开启任务

// 查看任务的执行结果

module.exports = router;