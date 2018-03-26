function commonUtils(){
    this.apikey = "xxxxxxxxxxx";// 短信验证码服务的apikey
    this.text = "[幽兰]您的验证码数: ";
    this.smsUrl = "https://host/api";
}
/**
 * 验证手机号码是否合法
 * 是完整的11位手机号或者正确的手机号前七位
 * @param {*} phone
 */
commonUtils.prototype.verifyPhone = function(phone){
    console.log("验证码为：",phone);
    if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))){ 
        return false; 
    }
    return true;
}

/**
 * 随机生成验证码
 */
commonUtils.prototype.generateCode = function(){
    return Math.floor(Math.random()*9000)+1000;
}


module.exports = new commonUtils();