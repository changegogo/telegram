var commonUtils = require('../utils/commonUtils');

// var s = '+YJqDG8+"\'/5kdCB3dG5L"E/5pg==';
// console.log(s);
// var en = commonUtils.URLencode(s);
// console.log(en);

// var de = commonUtils.URLdecode(en);
// console.log(de);

// let invitcode = "OVbta2z4+m9imQT5ATMxnnnk2jIhuLHCLJwpsvZkl7w=can_robot";
// let arr = commonUtils.aesinvitcode(invitcode);
// console.log(arr);

//var crypto = require('crypto');
//let salt = '123';
// let hash, encode, password;
// password = 'dailiwang';
// password = password + salt;
// for(let i=0; i<3; i++){
//     hash = crypto.createHash('md5');
//     hash.update(new Buffer(password, 'binary'));
//     encode = hash.digest('hex');
//     password = encode;
// }

//console.log(encode);
//06a6ab779825446f8783fbeaf8703533
// let hash, encode;
// function encryption(password){
//     password = password + salt;
//     for(let i=0; i<3; i++){
//         hash = crypto.createHash('md5');
//         hash.update(new Buffer(password, 'binary'));
//         encode = hash.digest('hex');
//         password = encode;
//     }
//     return encode;
// }

// console.log(encryption('dailiwang'))

let arr = commonUtils.aesinvitcode(`rF2J/ZRHuKB18N2DBHJf/OKp682rk4NbcZxZ6L1MEbM=can_robot`);
console.log(arr);
arr = commonUtils.aesinvitcode(`1uoz88Fg+h+n8YG2DAHMG/DmzWCmh+GNP+ssfQGGm0k=can_robot`);
console.log(arr);
arr = commonUtils.aesinvitcode(`X7R4I/3/l2vP8yyWBK7OrTds+/xIOvYDzQ3uyoxmaek=can_robot`);
console.log(arr);

