$(function () {

    getIdentifycode () ;
    userInfoConector();


    //click
    $(".quicklyGetCanBtn").click(function () {
        window.location.href = './drawcoin.html?identitycode=' + getIdentifycode();
    });
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
                return window.location.href ;
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