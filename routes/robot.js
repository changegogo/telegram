const express = require('express');
const commonUtils = require("../utils/commonUtils");
const router = express.Router();

const Player = require('../schemaDao/Player');
const Replyrule = require('../schemaDao/Replyrule');
const Promise = require('promise');

const replyrobot = require('../utils/replyrobot');

/**
 * /robot
 * 解析邀请码
 */
router.post('/', function(req, res, next) {
    //console.log(req.body);
    // 获取内容
    let text = req.body.message.text;
    let chatid = req.body.message.chat.id;
    console.log('聊天id：',chatid);

    // 遍历每一个回复规则，查询是否有匹配的规则 还未测试
    function valuesArr(map){
        let valuesArray = new Array();
        for (let kv of map) {
            if(!(typeof(kv[1])=="function")){     
                valuesArray.push(kv[1]);     
            }
        }
        return valuesArray;
    }
    //console.log(global.replyrules);
    let values = valuesArr(global.replyrules);
    let rulescount = values.length;
    let out = false;
    for(let i=0;i<rulescount;i++){
        let rule = values[i];
        if(rule.status===0){
            let keys = rule.keywords;
            //console.log(keys);
            let keyscount = keys.length;
            for(let j=0;j<keyscount;j++){
                if(text.includes(keys[j])){
                    out = true;
                    // 机器人回复
                    console.log('robot规则回复:',rule.replycontent);
                    replyrobot(chatid, rule.replycontent,function(val){
                        res.end(val);
                    });
                    break;// 终止内层循环
                }
            }
        }
        if(out){
            break; // 终止外层循环
        }
    }
    if(out){
        return;
    }
    // 不是邀请码
    if(!text.endsWith(commonUtils.suffix)){
        res.end();
        return;
    }
    // 解析邀请码
    let player12 = commonUtils.aesinvitcode(text);
    if(player12.length!=2){
        res.json({code: 201, msg: '邀请码无效'});
        return;
    }
    let query = {
        invitcode: text
    }
    // 验证邀请码是否有效
    let p0 = function(){
        return new Promise(function(resolve, reject){
            Player.findOne(query, function(err, player){
                if(!err && player){
                    if(!player.isusedinvit){
                        resolve();
                    }else{
                        reject({code: 201, msg: '邀请码已经被使用'});
                    }
                }else{
                    reject({code: 201, msg: '邀请码查询失败'});
                }
            });
        });
    };
    //设置邀请码无效，被邀请人添加奖励
    let p1 = function(){
        return new Promise(function(resolve, reject){
            Player.updateOne({
                invitcode: text
            },{
                "$set": {
                    isusedinvit: true
                },
                "$inc": {
                    totalcancount: commonUtils.oneReward
                }
            },function(err, c){
                if(!err && c){
                    resolve(c);
                }else{
                    reject({code: 201, msg: '被邀请人添加奖励失败'});
                }
            })
        });
    }
        // 邀请人判断应该添加多少奖励
    let p2 = function(){
        return new Promise(function(resolve, reject){
            if(player12[0] == '110'){
                reject({code: 200, msg: '奖励已发放'});
            }else{
                Player.findOne({
                    telphone: player12[0]
                }, function(err, player){
                    if(!err && player){
                        let reward = 0;
                        if(player.invitcount < commonUtils.oneDot){
                            reward = commonUtils.oneReward;
                        }else if(player.invitcount < commonUtils.twoDot){
                            reward = commonUtils.twoReward;
                        }else {
                            reward = commonUtils.threeReward;
                        }
                        resolve(reward);
                    }else{
                        reject({code: 201, msg: '邀请人查询失败'});
                    }
                });
            }
            
        });
    }
    // 邀请人添加奖励
    let p3 = function(reward){
        return new Promise(function(resolve, reject){
            Player.updateOne({
                "telphone": player12[0]
            },{
                "$inc": {
                    totalcancount: reward,
                    invitcount: 1 // 邀请的人数+1
                },
                "$push": {
                    invitedplayers: player12[1]
                }
            },function(err, c){
                if(!err && c){
                    resolve(c);
                }else{
                    reject({code: 201, msg: '邀请人添加奖励失败，请重试'});
                }
            });
        });
    }

    p0()
    .then(function(){
        return p1();
    })
    .then(function(){
        return p2();
    })
    .then(function(reward){
        return p3(reward);
    })
    .then(function(c){
        console.log('奖励已发放');
        replyrobot(chatid, '奖励已发放', function(val){
            res.end(val);
        });
    })
    .catch(function(data){
        console.log(data);
        replyrobot(chatid, data.msg, function(val){
            res.end(val);
        });
        
    });
});

module.exports = router;