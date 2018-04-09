function getIdentifycode() { //获取用户识别码
    var identitycode ;
    if (GetLocalStorage('identitycode') === null) {
        window.location.href = window.location.protocol + '//' + window.location.host + '/telegram/index.html'
    } else {
        if (GetLocalStorage('identitycode') !== null) {
            return identitycode = GetLocalStorage('identitycode');
        } else if(getQueryString('identitycode') !== null) {
            return identitycode = getQueryString('identitycode');
        } else {
            window.location.href = window.location.protocol + '//' + window.location.host + '/telegram/index.html';
        }
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
function weixinShareMethod(conectorUrl) {
    $.ajax({
        type: 'POST',
        url: conectorUrl,
        data: {
            url: window.location.href.split('#')[0]
        },
        success: function (res) {
            wx.config({
                appId: res.appID,
                timestamp: res.timestamp,
                nonceStr: res.nonceStr ,
                signature: res.signature,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage'
                ]
            });
            wx.ready(function() {
                alert(223232)
                // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
                wx.onMenuShareTimeline({
                        title: '电报推广太疯狂！',
                        link: window.location.protocol + '//' + window.location.host + '/telegram/index.html',
                        imgUrl: '../../common/images/logo.png',
                        desc: '电报推广推广推广',
                        success: function() {
                             alert('ok');
                        },
                        cancel: function() {
                            // 用户取消分享后执行的回调函数
                            alert('cancle');
                        }
                    });
                // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
                wx.onMenuShareAppMessage({
                        title: '电报推广太疯狂！',
                        link:  window.location.protocol + '//' + window.location.host + '/telegram/index.html',
                        imgUrl: '../../common/images/logo.png',
                        desc: '电报推广推广推广',
                        type: 'link',
                        success: function() {
                            alert('ok');
                        },
                        cancel: function() {
                            // 用户取消分享后执行的回调函数
                            alert('cancle');
                        }
                    });
            });
            wx.error(function (res) {
                alert(99999+ 'error')
                alert(JSON.stringify(res))
            })
        },
        error: function (error) {
            console.log(error)
        }
    });
}
