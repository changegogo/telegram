const Player = require('../schemaDao/Player');
require('../lib/db');


// function randomString(len) {
// 　　len = len || 32;
// 　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
// 　　var maxPos = $chars.length;
// 　　var pwd = '';
// 　　for (i = 0; i < len; i++) {
// 　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
// 　　}
// 　　return pwd;
// }

// let objs = [];
// let playerObj;
// let telphone = '15383830596';
// for(let i=0;i<25; i++){
//     telphone = parseInt(telphone)+i+'';
//     imtoken = '0x'+randomString(40);
//     playerObj = {
//         telphone: telphone,
//         imtoken: imtoken,
//         identitycode: 'shibiema'+imtoken,
//         bindip: '192.168.0.191',
//         invitcode: 'yaoqingma'+imtoken,
//         createtime: Date.now()+i*100000
//     };
//     objs.push(playerObj);
// }
// console.log(objs.length);

// objs.forEach((obj)=>{
//     Player.create(obj, function(err, p){
//         console.log(err);
//     });
// });


// Player.find({},function(err, ps){
//     console.log(ps)
// }).skip(80000).limit(2);

Player.updateOne({
    "telphone": '15373838393'
},{
    "$inc": {
        totalcancount: 18.8,
        invitcount: 1 // 邀请的人数+1
    },
    "$push": {
        invitedplayers: '15252525252'
    }
},function(err, c){
    console.log('==============');
    console.log(err);
    console.log(c);
    console.log('==============')
    if(!err && c){
        console.log(c.n===0);
    }else{
        console.log(2);
    }
});

