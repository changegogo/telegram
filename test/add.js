require('../lib/db');
const Replyrule = require('../schemaDao/Replyrule');


let obj = {
    rulename: '册书',
    keywords: ['你好','haoa'],
    replycontent: '是的'
};
Replyrule.create(obj, function(err, replyrules){
    console.log(err);
    if(!err && replyrules){
        console.log(replyrules);
        global.r = replyrules;
        // 添加到global缓存
        //global.replyrules.push(replyrules);
        //res.json({code: 200, msg: '添加成功'});
    }else{
       // res.json({code: 201, msg: '添加失败'});
    }
});

Replyrule.find({}, function(err, replyrules){
    console.log(err);
    if(!err && replyrules){
        console.log(replyrules);
        global.r = replyrules;
        // 添加到global缓存
        //global.replyrules.push(replyrules);
        //res.json({code: 200, msg: '添加成功'});
    }else{
       // res.json({code: 201, msg: '添加失败'});
    }
});