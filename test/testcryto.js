const crypto = require('crypto');
// 加密
function aesEncrypt(data, key) {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'base64');
    crypted += cipher.final('base64');
    return crypted;
}
// 解密
function aesDecrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

var data = '15383830596|999999999999999999999999999989999999999990'; // 手机号+imtoken
var key = 'youlan';
var encrypted = aesEncrypt(data, key);
var decrypted = aesDecrypt(encrypted, key);

// console.log('明文: ' + data);
// console.log('密文: ' + encrypted);
// console.log('解密后文: ' + decrypted);

var commonUtils = require('../utils/commonUtils');

var identitycode = commonUtils.generateidentitycode("15383830596", "qwertyuioplkjhgfdsazxcvbnmnbvcxzaqwsderftg");
console.log('用户识别码-->'+identitycode);
var arr = commonUtils.aesidentitycode('asdadsdsa');

console.log(arr);


// var invitcode = commonUtils.generateinvitcode("153838305965", "158014199937");
// console.log('邀请码-->'+invitcode);
// var arr2 = commonUtils.aesinvitcode("3AGwtGR6pbVcXy9iZ80Kax98A93nw3jr6X+Kz1vXLs0=can_robot");

// console.log(arr2);