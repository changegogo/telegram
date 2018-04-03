$(function () {
    if (GetLocalStorage('identitycode') !== null) {
        window.location.href = './views/pages/activeShare.html?identitycode=' + GetLocalStorage('identitycode');
    }
    $(".getNoteCode-container").click(function () {    // 点击获取验证码展示倒计时
        if (verifyMobileFormatter()) {
            settime($(this) , 60);
            sendPhoneCode();
            return true ;
        } else {
            return false
        }

    });

    $(".submitBindPhone").click(function () {
        if (verifyMobileFormatter()) {
            if ($("#imtokenAddress").val() === '') {
                $(".imtoken-error").show() ;
            } else {
                $(".imtoken-error").hide() ;
                commitAddressConnector();
            }
        }
        return false
    });
    function verifyMobileFormatter() {    // 校验手机号
        var telReg =/^[1][3,4,5,7,8][0-9]{9}$/;
        var mobilephoneVal = $("#mobilephone").val();
        if (mobilephoneVal === '') {
            $(".nofix-tip-statement").text("手机号码不能为空").css("cssText","color:red !important;");
            return false
        }
        else if(!telReg.test(mobilephoneVal)) {
            $(".nofix-tip-statement").text("手机号码格式错误").css("cssText","color:red !important;");
            return false
        }
        $(".nofix-tip-statement").text("每手机号绑定成功后不可修改，请仔细确认").css("cssText","color:#938E8E !important;");
        return true
    }



    function sendPhoneCode() {    // 获取发送短信接口
        $.ajax({
            type: 'GET',
            url: 'code/smsapi',
            data: {
                telphone: $("#mobilephone").val()
            },
            success: function (res) {
                if (res.code === 200) {
                    $(".sendcode-error").html('').hide();
                    return true
                } else {
                    $(".sendcode-error").html(res.message).show();
                    settime($(".getNoteCode-container") , 0 ) ;
                    return false
                }
            },
            error: function (error) {
                console.log(error)
            }
        });
    }


    function commitAddressConnector() {    // 获取提交地址接口
        $.ajax({
            type: 'POST',
            url: 'code/smsbind',
            data: {
                identitycode: getIdentitycode(), //用户标识码，从本地存储或者url参数中获取
                telphone: $("#mobilephone").val() ,// 用户手机号
                smscode: $("#noteCode").val(),// 验证码
                imtoken: $("#imtokenAddress").val() // 以太坊地址
            },
            success: function (res) {
                if (res.code === 200) {
                    $(".unkow-error").html('').hide() ;
                    SetLocalStorage ( 'identitycode', res.identitycode) ;
                    window.location.href = './views/pages/activeShare.html?identitycode=' + res.identitycode ;
                    return true
                } else {
                    $(".unkow-error").html(res.msg).show() ;
                    return false
                }
            },
            error: function (error) {
                console.log(error)
            }
        });
    }

    function getIdentitycode() { //获取地址栏的 identitycode
        var identitycode;
        if (getQueryString('identitycode') !== null) {
            identitycode = getQueryString('identitycode');
            return identitycode ;
        } else {
            return identitycode = '' ;
        }
    }
});


