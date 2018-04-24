//var commonUtils = require('../utils/commonUtils');
const crypto = require('crypto');
const URLSafeBase64 = require('urlsafe-base64');

let generateidentitycode = function(telphone, imtoken){
    var data = telphone + "|" + imtoken;
    const cipher = crypto.createCipher('aes192', 'youlan123');
    var crypted = cipher.update(data, 'utf8', 'base64');
    crypted += cipher.final('base64');
    console.log(crypted);
    crypted = URLSafeBase64.encode(crypted);
    return crypted;
}

/**
 * 解析身份识别码
 * 屏蔽伪造的邀请码****
 */
let aesidentitycode = function(identitycode){
    try{
        const decipher = crypto.createDecipher('aes192', 'youlan123');
        var decrypted = decipher.update(identitycode, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted.split('|');
    }catch(error){
       return [];
    }
}
let phone = '15383830596';
let imtoken = '1538383+=/90123';
let crypted = generateidentitycode(phone, imtoken);
console.log(crypted);
let arr = aesidentitycode('Bkh7re6X-K2R7-PkHaYLXfTywPcHGc4z3L3FiTVCWHyqRvvBkDqprrV5z7V437JqrvoeZCuVe873cMFmsw7n-Q');

console.log(arr);

let generateinvitcode = function(telphone1, telphone2){
    var data = telphone1 + "|" + telphone2;
    const cipher = crypto.createCipher('aes192', 'youlan123');
    var crypted = cipher.update(data, 'utf8', 'base64');
    crypted += cipher.final('base64');
    crypted = URLSafeBase64.encode(crypted);
    return crypted + 'can_robot';
}

/**
 * 解析邀请码invitcode
 */
let aesinvitcode = function(invitcode){
    try {
        invitcode = invitcode.split('can_robot')[0];
        const decipher = crypto.createDecipher('aes192','youlan123');
        var decrypted = decipher.update(invitcode, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted.split('|');
    } catch (error) {
        return [];
    }
}

let mi = generateinvitcode('15383830596', '15801419993');
let jie = aesinvitcode(mi);
console.log(jie);