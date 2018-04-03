function getIdentifycode() { //获取用户识别码
    var identitycode ;
    if (GetLocalStorage('identitycode') !== null) {
        return identitycode = GetLocalStorage('identitycode');
    } else if(getQueryString('identitycode') !== null) {
        return identitycode = getQueryString('identitycode');
    } else {
        window.location.href = 'telegram/index.html';
    }
}

function settime(obj ,countDown) { //发送验证码倒计时
    if (countDown == 0) {
        obj.attr('disabled',false);
        obj.val("获取验证码");
        obj.css({color: '#FF5208'});
        countDown = 60;
        return;
    } else {
        obj.attr('disabled',true);
        obj.val(countDown + "s后重新发送");
        obj.css({color: '#8E8E93'});
        countDown--;
    }
    setTimeout(function() {
        settime(obj, countDown)
    },1000)
}
function modelSuccessMethod(res, bol) {
    if (bol) {
        $(".dialog-img-marking").attr({src: 'telegram/common/images/Success_ok.png'}) ;
        $(".tibi-result-title").text('提币成功') ;
        $(".desc-dialogInfo>p").text(res.msg) ;
        $(".model").show() ;
    } else {
        $(".dialog-img-marking").attr({src: 'telegram/common/images/Question.png'}) ;
        $(".tibi-result-title").text('提币失败') ;
        $(".desc-dialogInfo>p").text(res.msg) ;
        $(".model").show() ;
    }

}