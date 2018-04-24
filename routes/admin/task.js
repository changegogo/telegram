const express = require('express');
const router = express.Router();
const Promise = require('promise');

const Task = require('../../schemaDao/Task');
const schedule = require('node-schedule');
const mongoose = require('mongoose');

const replyrobot = require('../../utils/replyrobot');

// 日期正则验证 2018-04-03 12:20:35
const timere = /^(((20[0-3][0-9]-(0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|(20[0-3][0-9]-(0[2469]|11)-(0[1-9]|[12][0-9]|30))) (20|21|22|23|[0-1][0-9]):[0-5][0-9]:[0-5][0-9])$/;
const chat_id = -1001115184123; // CAN群聊天id
// 程序启动时，加载任务
global.taskMap = new Map();
/**
 * 程序启动加载所有的定时任务
 */
(function(){
    Task.find({
        taskstatus: true,
        tasktype: {
            $ne: 2
        }
    }, function(err, tasks){
        if(!err && tasks){
            tasks.forEach(function(task){
                if(task.tasktype == 0){
                    // 开启定时任务
                    let time = new Date(task.year[0], task.month[0], task.day[0], task.hour[0], task.minute[0], task.second[0]);
                    let job = schedule.scheduleJob(time, function(idtext){
                        console.log('任务执行了');
                        // 从缓存中移除任务
                        global.taskMap.delete(idtext.id);
                        let chatid = chat_id;
                        // 机器人发送信息
                        replyrobot(chatid, idtext.text,function(val){
                            // 添加任务结果
                            Task.updateById(mongoose.Types.ObjectId(idtext.id),{
                                $push: {
                                    taskresults: {msg:'已执行', time: Date.now()}
                                }
                            },function(err, c){
                                console.log(c);
                            });
                        });
                    }.bind(null, {id: task.id, text: task.tasktext}));
                    // 缓存任务
                    if(job){
                        global.taskMap.set(task.id, job);
                    }
                }else{
                    //重复任务
                    let dayOfWeek = task.dayOfWeek;
                    let rule = {};
                    if(dayOfWeek.length > 0){
                        // 周任务
                        rule.dayOfWeek = task.dayOfWeek;
                        rule.hour = task.hour;
                        rule.minute = task.minute;
                        rule.second = task.second;
                        
                    }else{
                        // 天任务
                        rule.hour = task.hour;
                        rule.minute = task.minute;
                        rule.second = task.second;
                    }
                    // 开启周任务
                    let job = schedule.scheduleJob(rule, function(idtext){
                        console.log('周任务执行');
                        let chatid = chat_id;
                        // 机器人发送信息
                        replyrobot(chatid, idtext.text,function(val){
                            // 添加任务结果
                            Task.updateById(mongoose.Types.ObjectId(idtext.id),{
                                $push: {
                                    taskresults: {msg:'已执行', time: Date.now()}
                                }
                            },function(err, c){
                                console.log(c);
                            });
                        });
                    }.bind(null, {id: task.id, text: task.tasktext}));
                    
                    // 缓存任务
                    if(job){
                        global.taskMap.set(task.id, job);
                    }
                }
            });
        }else{
            console.log('读取定时任务失败');
        }
    });

})();

// 从数据库中查询任务列表
router.get('/data', function(req, res, next){
    // 查询第几页的数据
    let page = req.query.page || req.body.page; 
    page = parseInt(page);
    if(Object.is(NaN, page) || page<0){
        res.json({code: 'page格式不正确'});
        return;
    }
    // 查询偏移几条
    let offset = req.query.offset || req.body.offset|| 10;
    offset = parseInt(offset);
    if(Object.is(NaN, offset)){
        res.json({code: 'offset格式不正确'});
        return;
    }
    // 从哪一条开始
    let start = (page-1) * offset;
    let countPromise = function(){
        return new Promise(function(resolve, reject){
            Task.count({}, function(err, c){
                if(!err){
                    resolve(c);
                }else{
                    reject('查询总数失败');
                }
            });
        });
    }

    let dataPromise = function(){
        return new Promise(function(resolve, reject){
            Task.find({}, function(err, tasks){
                if(!err){
                    resolve(tasks);
                }else{
                    reject('条件查询失败');
                }
                
            }).skip(start)
            .limit(offset)
            .sort({createtime: -1});
        });
    }
    Promise.all([countPromise(), dataPromise()])
    .then(function(values){
        res.json({code: 200, msg:'success', total: values[0], rows: values[1]});
    })
    .catch(function(msg){
        res.json({code: 201, msg: msg});
    })
});

// 添加任务
router.get('/add', function(req, res, next){
    // 获取任务类型
    let tasktype = req.query.tasktype || req.body.tasktype;
    if(tasktype != 0 && tasktype != 1 && tasktype != 2){
        res.json({code: 201, msg: '任务类型不正确'});
        return;
    }
    // 任务内容
    let tasktext = req.query.tasktext || req.body.tasktext;
    if(!tasktext){
        res.json({code: 201, msg: '任务内容不能为空'});
        return;
    }
    // 任务状态
    let status = req.query.taskstatus || req.body.taskstatus;
    status = (status==0)?false:true;
    
    let obj = {
        dayOfWeek: new Array(),
        year: new Array(),
        month: new Array(),
        day: new Array(),
        hour: new Array(),
        minute: new Array(),
        second: new Array(),
        tasktype: tasktype,
        tasktext: tasktext,
        taskstatus: status
    };
    if(tasktype == 0){
        // 定时任务
        let datatime = req.query.datatime || req.body.datatime; // 2018-04-03 19:28:30
        if(!timere.test(datatime)){
            res.json({code: 201, msg: '日期格式不正确'});
            return;
        }
        //let dt = new Date(datatime);

        ///////////////////////////
        let dt = datatime.split(' ');
        let [d, t] = dt;
        let [nian, yue, ri] = d.split('-');
        let [shi, fen, miao] = t.split(':');
        obj.year.push(parseInt(nian));
        obj.month.push(parseInt(yue)-1);
        obj.day.push(parseInt(ri));
        obj.hour.push(parseInt(shi));
        obj.minute.push(parseInt(fen));
        obj.second.push(parseInt(miao));
        ////////////////////////////////
        
        // 添加到数据库
        Task.create(obj, function(err, task){
            console.log(task);
            if(!err && task){
                if(!task.taskstatus){
                    res.json({code: 200, msg: '定时任务创建成功'});
                    return;
                }

                // 开启定时任务
                let time = new Date(task.year[0], task.month[0], task.day[0], task.hour[0], task.minute[0], task.second[0]);
                time.setHours(time.getHours()-8);
                let job = schedule.scheduleJob(time, function(idtext){
                    console.log('任务执行了');
                    // 从缓存中移除任务
                    global.taskMap.delete(idtext.id);
                    let chatid = chat_id;
                    // 机器人发送信息
                    replyrobot(chatid, idtext.text,function(val){
                        // 添加任务结果
                        Task.updateById(mongoose.Types.ObjectId(idtext.id),{
                            $push: {
                                taskresults: {msg:'已执行', time: Date.now()}
                            }
                        },function(err, c){
                            console.log(c);
                        });
                    });
                }.bind(null, {id: task.id, text: task.tasktext}));
                // 缓存任务
                if(job){
                    global.taskMap.set(task.id, job);
                }
                res.json({code: 200, msg: '定时任务创建开启成功'});
            }else{
                res.json({code: 201, msg: '定时任务添加失败'});
            }
        });
    }else if(tasktype == 1){
        // 重复任务
        let dayOfWeek = req.query.dayOfWeek || req.body.dayOfWeek;
        let hour = req.query.hour || req.body.hour;
        let minute = req.query.minute || req.body.minute;
        let second = req.query.second || req.body.second;
        if(!dayOfWeek){
            dayOfWeek = [];
        }else{
            dayOfWeek = dayOfWeek.split(',');
        }
        
        hour = hour.split(',');
        minute = minute.split(',');
        second = second.split(',');
        if(!hour){
            res.json({code: 201, msg: '小时不能为空'});
            return;
        }
        if(!minute){
            res.json({code: 201, msg: '分钟不能为空'});
            return;
        }
        if(!second){
            res.json({code: 201, msg: '秒不能为空'});
            return;
        }

        let rule = {};
        if(dayOfWeek.length>0){
            let daymapnum = new Map([
                ['日', 0],
                ['一', 1],
                ['二', 2],
                ['三', 3],
                ['四', 4],
                ['五', 5],
                ['六', 6]
            ]);
            // 周任务 hour: 14, minute: 30, dayOfWeek: 0
            rule.dayOfWeek = dayOfWeek.map((item, index)=>{
                return daymapnum.get(item)?daymapnum.get(item):0;
            });
            //rule.hour = hour;
            rule.hour = hour.map((item)=>{
                return item>=8?item-8:24+(item-8);
            });
            rule.minute = minute;
            rule.second = second;
            // 添加到数据库
            obj.dayOfWeek = obj.dayOfWeek.concat(rule.dayOfWeek);
            obj.hour = obj.hour.concat(hour);
            obj.minute = obj.minute.concat(minute);
            obj.second = obj.second.concat(second);
            Task.create(obj, function(err, task){
                if(!err && task){
                    if(!task.taskstatus){
                        res.json({code: 200, msg: '周任务创建成功'});
                        return;
                    }
                     // 开启周任务
                    let jobweek = schedule.scheduleJob(rule, function(idtext){
                        console.log('周任务执行');
                        let chatid = chat_id;
                        // 机器人发送信息
                        replyrobot(chatid, idtext.text,function(val){
                            // 添加任务结果
                            Task.updateById(mongoose.Types.ObjectId(idtext.id),{
                                $push: {
                                    taskresults: {msg:'已执行', time: Date.now()}
                                }
                            },function(err, c){
                                console.log(c);
                            });
                        });
                    }.bind(null, {id: task.id, text: task.tasktext}));
                    
                    // 缓存任务
                    if(jobweek){
                        global.taskMap.set(task.id, jobweek);
                    }
                    res.json({code: 200, msg: '周任务创建开启成功'});
                }else{
                    res.json({code: 201, msg: '周任务添加失败'});
                }
            });

        }else{
            // 天任务
            //rule.hour = hour;
            rule.hour = hour.map((item)=>{
                return item>=8?item-8:24+(item-8);
            });
            rule.minute = minute;
            rule.second = second;
            // 添加到数据库
            obj.hour = obj.hour.concat(hour);
            obj.minute = obj.minute.concat(minute);
            obj.second = obj.second.concat(second);
            //console.log(obj);
            Task.create(obj, function(err, task){
                if(!err && task){
                    if(!task.taskstatus){
                        res.json({code: 200, msg: '天任务创建成功'});
                        return;
                    }
                    // 开启天任务
                    let jobday = schedule.scheduleJob(rule, function(idtext){
                        console.log('天任务执行');
                        let chatid = chat_id;
                        // 机器人发送信息
                        replyrobot(chatid, idtext.text,function(val){
                            // 添加任务结果
                            Task.updateById(mongoose.Types.ObjectId(idtext.id),{
                                $push: {
                                    taskresults: {msg:'已执行', time: Date.now()}
                                }
                            },function(err, c){
                                console.log(c);
                            });
                        });
                    }.bind(null, {id: task.id, text: task.tasktext}));
                    
                    // 缓存任务
                    if(jobday){
                        global.taskMap.set(task.id, jobday);
                    }
                    res.json({code: 200, msg: '天任务创建开启成功'});
                }else{
                    res.json({code: 201, msg: '天任务添加失败'});
                }
            });
        }
    }else{
        // 立即执行任务
        Task.create(obj, function(err, task){
            if(!err && task){
                // 立即执行任务
                let chatid = chat_id;
                replyrobot(chatid, task.tasktext,function(val){
                    // 添加任务结果
                    Task.updateById(mongoose.Types.ObjectId(task.id),{
                        $push: {
                            taskresults: {msg:'已执行', time: Date.now()}
                        }
                    },function(err, c){
                        console.log(c);
                    });
                });
                
                res.json({code: 200, msg: '立即执行任务执行成功'});
            }else{
                res.json({code: 201, msg: '立即执行任务执行失败'});
            }
        });
    }
});

// 查看global.taskmap
router.get('/map', function(req, res, next){
    console.log(global.taskMap);
    res.json(global.taskMap.size);
});

// 打开或者关闭开启任务
router.get('/onoff', function(req, res, next){
    let id = req.query.id || req.body.id;
    let taskstatus = req.query.taskstatus || req.body.taskstatus || 0; // 0关闭 1开启

    if(!id){
        res.json({code: 201, msg: 'id不能为空'});
        return;
    }
    let mongooseid;
    try {
        mongooseid = mongoose.Types.ObjectId(id);
    } catch (error) {
        res.json({code: 201, msg: 'id不合法'});
        return;
    }
    if(!taskstatus){
        res.json({code: 201, msg: '状态不能为空'});
        return;
    }
    taskstatus = taskstatus==0?false:true;
    // 修改数据库任务状态
    Task.updateById(mongooseid, {
        taskstatus: taskstatus
    }, function(err, c){
        if(!err){
            res.json({code: 200, msg: '状态更新成功'});
        }else{
            res.json({code: 201, msg: '状态更新失败'});
        }
    });
    
    if(taskstatus){
        // 开启任务
        Task.findOne({
            _id: mongooseid
        }, function(err, task){
            if(!err && task){
                let tasktype = task.tasktype;
                // 开启定时任务
                let time = {};
                if(tasktype == 0){
                    time = new Date(task.year[0], task.month[0], task.day[0], task.hour[0], task.minute[0], task.second[0]);
                }else if(tasktype == 1){
                    if(task.dayOfWeek.length>0){
                        // 周任务
                        time.dayOfWeek = task.dayOfWeek;
                        time.hour = task.hour;
                        time.minute = task.minute;
                        time.second = task.second;
                        
                    }else{
                        // 天任务
                        time.hour = task.hour;
                        time.minute = task.minute;
                        time.second = task.second;
                    }
                }else{
                    // 立即执行任务
                    // 机器人发送信息
                    let chatid = chat_id;
                    replyrobot(chatid, task.tasktext,function(val){
                        // 添加任务结果
                        Task.updateById(mongoose.Types.ObjectId(task.id),{
                            $push: {
                                taskresults: {msg:'已执行', time: Date.now()}
                            }
                        },function(err, c){
                            console.log(c);
                        });
                    });
                    return;
                }
                let job = schedule.scheduleJob(time, function(idtext){
                    console.log('任务执行了');
                    // 从缓存中移除任务
                    global.taskMap.delete(idtext.id);
                    let chatid = chat_id;
                    // 机器人发送信息
                    replyrobot(chatid, idtext.text,function(val){
                        // 添加任务结果
                        Task.updateById(mongoose.Types.ObjectId(idtext.id),{
                            $push: {
                                taskresults: {msg:'已执行', time: Date.now()}
                            }
                        },function(err, c){
                            console.log(c);
                        });
                    });
                }.bind(null, {id: task.id, text: task.tasktext}));
                // 缓存任务
                if(job){
                    global.taskMap.set(task.id, job);
                }

            }else{
                console.log(id, '任务开启失败');
            }
        })
        
    }else{
        // 关闭任务
        // 从global缓存中移除定时任务
        let job = global.taskMap.get(id);
        if(job){
            job.cancel();
            global.taskMap.delete(id);
        }
    }
});

// 删除任务
router.get('/del', function(req, res, next){
    let id = req.query.id || req.body.id;
    if(!id){
        res.json({code: 201, msg: '删除id不能为空'});
        return;
    }
    let mongooseid;
    try {
        mongooseid = mongoose.Types.ObjectId(id);
    } catch (error) {
        res.json({code: 201, msg: 'id不合法'});
        return;
    }
    // 从数据库中删除
    Task.deleteById(mongooseid, function(err, c){
        if(!err && c){
            res.json({code: 200, msg: '删除成功'});
        }else{
            res.json({code: 201, msg: '删除失败'});
        }
    });
    // 从global缓存中删除
    let gtask = global.taskMap.get(id);
    if(gtask){
        gtask.cancel();
        global.taskMap.delete(id);
    }
});

// 停止所有任务
router.get('/stopall', function(req, res, next){
    global.taskMap.forEach(function(gtask, key, map){
        gtask.cancel();
    });
    global.taskMap.clear();
    res.json({code: 200, msg: '所有任务停止'});
});

// 查看任务的执行结果
router.get('/sendresult', function(req, res, next){
    let id = req.query.id || req.body.id;
    if(!id){
        res.json({code: 201, msg: '删除id不能为空'});
        return;
    }
    let mongooseid;
    try {
        mongooseid = mongoose.Types.ObjectId(id);
    } catch (error) {
        res.json({code: 201, msg: 'id不合法'});
        return;
    }
    Task.findOne({
        _id: mongooseid
    }, function(err, task){
        if(!err && task){
            res.json({code: 200, msg: 'success', results: task.taskresults});
        }else{
            res.json({code: 201, msg: '没有此任务'});
        }
    });
});

module.exports = router;