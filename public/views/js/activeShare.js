
$(function () {
    userInfoConector();
    //click
    versionController() ;
    $(".sureDialog-btn").click(function () {
        $('.model').hide()
    }) ;
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
                        var canUserBi = totalcancount - haspickupcount ;

                        $(".quicklyGetCanBtn").click(function () {
                            if (canUserBi < 18.8) {
                                $('.model').show()
                                return false
                            } else {
                                $('.model').hide()
                                window.location.href = './drawcoin.html?identitycode=' + getIdentifycode();
                            }
                        });
                    }
                    return true
                } else {
                    RemoveLocalStorage('identitycode') ;
                    if (getQueryString('identitycode') !== null) {
                        alert(getQueryString('identitycode')) ;
                        window.location.href = window.location.protocol + '//' + window.location.host + '/telegram/index.html?identitycode=' + getQueryString('identitycode')
                    } else {
                        window.location.href = window.location.protocol + '//' + window.location.host + '/telegram/index.html';
                    }
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
                return 'CAN空投活动。双料豪礼等你来拿，加入电报群获得18.8CAN！每邀请一位朋友加入CAN电报群，按阶梯发放奖励！ 😍 😘 ' + window.location.protocol + '//' + window.location.host + "/telegram/index.html?identitycode=" + getIdentifycode() ;
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

    $("#copy-linkbtn").click(function () {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) { //ios兼容
            window.getSelection().removeAllRanges();//这段代码必须放在前面否则无效
            var Url2=document.getElementById("biaoios");//要复制文字的节点
            Url2.innerText = 'CAN空投活动。双料豪礼等你来拿，加入电报群获得18.8CAN！每邀请一位朋友加入CAN电报群，按阶梯发放奖励！ 😍 😘 ' + window.location.protocol + '//' + window.location.host + "/telegram/index.html?identitycode=" + getIdentifycode() ;
            var range = document.createRange();
            // 选中需要复制的节点
            range.selectNode(Url2);
            // 执行选中元素
            window.getSelection().addRange(range);
            // 执行 copy 操作
            var successful = document.execCommand('copy');
            // 移除选中的元素
            window.getSelection().removeAllRanges();
            timerTimeOut() ;
        }
    })
    $("#copy-statement").click(function () {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) { //ios兼容
            window.getSelection().removeAllRanges();//这段代码必须放在前面否则无效
            var Url3=document.getElementById("copy-statement");//要复制文字的节点
            var range = document.createRange();
            // 选中需要复制的节点
            range.selectNode(Url3);
            // 执行选中元素
            window.getSelection().addRange(range);
            // 执行 copy 操作
            var successful = document.execCommand('copy');
            // 移除选中的元素
            window.getSelection().removeAllRanges();
            timerTimeOut() ;
        }
    })
});