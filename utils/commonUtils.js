var crypto = require('crypto');

function commonUtils(){
    this.apikey = "xxxxxxxxxxx";// 短信验证码服务的apikey
    this.text = "[幽兰]您的验证码数: ";
    this.smsUrl = "https://host/api";
    this.suffix = "can_robot";
}
/**
 * 验证手机号码是否合法
 * 是完整的11位手机号或者正确的手机号前七位
 * @param {*} phone
 */
commonUtils.prototype.verifyPhone = function(phone){
    if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))){ 
        return false; 
    }
    return true;
}

/**
 * 验证短信验证码是否正确
 * @param {*} smscode
 */
commonUtils.prototype.verifySmscode = function(smscode){
    console.log("验证码为：",smscode);
    // 从session中取出验证码 
    //TODO
    var sessioncode = '1234';
    if(sessioncode == smscode){
        return true;
    }
    return false;
}

/**
 * 验证imtoken格式是否正确
 * 以太坊地址为42位
 * @param {*} imtoken
 */
commonUtils.prototype.verifyImtoken = function(imtoken){
    console.log("imtoken：",imtoken);
    // TODO
    if(imtoken.length === 42){
        return true;
    }
    return false;
}

/**
 * 获取访问者的ip地址
 */
commonUtils.prototype.getIp = function(req){
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}

/**
 * 随机生成验证码
 */
commonUtils.prototype.generateCode = function(){
    return Math.floor(Math.random()*9000)+1000;
}

/**
 * 按规则生成邀请码
 */
commonUtils.prototype.generateinvitCode = function(telphone, imtoken){
    var str = telphone + imtoken;
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    console.log("邀请码：",str+this.suffix);
    return str + this.suffix;
}


module.exports = new commonUtils();