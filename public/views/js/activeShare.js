getIdentifycode();

$(function () {
    userInfoConector();
    // weixinShareMethod('../../weixin/signture') ;


    //click
    var canUserBi
    $(".quicklyGetCanBtn").click(function () {
        if (canUserBi < 1880) {
            $(".quicklyGetCanBtn").attr({disabled: true})
            $('.model').show()
            return false
        } else {
            $('.model').hide()
            window.location.href = './drawcoin.html?identitycode=' + getIdentifycode();
        }
    });
    $(".sureDialog-btn").click(function () {
        $('.model').hide()
    })
    $(".generate-active-page-btn").click(function () {
        window.location.href = './userActiveSelf.html?identitycode=' + getIdentifycode();
    });
    function userInfoConector() { //info接口获取
        $.ajax({
            type: 'POST',
            url: '../../info',
            data: {
                identitycode: getIdentifycode()
            },
            success: function (res) {
                if (res.code === 200) {
                    if(res.results) {
                        var totalcancount = ((res.results[0].totalcancount)/10).toFixed(1);
                        var haspickupcount = ((res.results[0].haspickupcount)/10).toFixed(1)
                        $("#invitCountPerson").text(res.results[0].invitcount) ; //邀请人数
                        $("#totalCanCount").text(totalcancount) ; // 累计获得CAN币的数目
                        $("#hasPickupCount").text(haspickupcount) ; // 已经提取币的数目
                        $("#RandomTokenCode").text(res.results[0].invitcode) ; // 邀请码
                        canUserBi = totalcancount - haspickupcount ;
                    }
                    return true
                } else {
                    return false
                }
            },
            error: function (error) {
                console.log(error)
            }
        });
    }
    copyMethod() ;
    function copyMethod() { //复制文本和urlmethod
        var clipboard = new ClipboardJS('.copy-statement', {
            success: function () {
                timerTimeOut()
            }
        });
        var clipboardUrl = new ClipboardJS('#copy-linkbtn' , {
            text: function () {
                return window.location.protocol + '//' + window.location.host + "/telegram/index.html?identitycode=" + getIdentifycode() ;
            }
        });
        clipboard.on('success', function(e) {
            timerTimeOut()
        });
        clipboardUrl.on('success', function(e) {
            timerTimeOut()
        });
    }

    function timerTimeOut() {     //延时定时器
        $(".copy-success-tip").show();
        clearTimeout(timer);
        var timer = setTimeout(function () {
            $(".copy-success-tip").hide();
        },2000)
    }

});