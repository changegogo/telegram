$(function () {
    getIdentifycode();

    $(".countDown").click(function () {    // 点击获取验证码展示倒计时
            settime($('.countDown'), 60);
            getCanPassConector() ;
    });
    $(".getBiToken-btn").click(function () {
        if ($("#codeCANPhone").val() === '') {
            $(".warn").text('验证码不能为空').show() ;
        } else {
            $(".warn").text('').hide() ;
            getCountCanConector();
        }
    });
    function settime(obj ,countDown) { //发送验证码倒计时
        if (countDown == 0) {
            obj.attr('disabled',false);
            obj.text("获取验证码");
            obj.css({color: '#FF5208'});
            countDown = 60;
            return;
        } else {
            obj.attr('disabled',true);
            obj.text(countDown + "s后重新发送");
            obj.css({color: '#8E8E93'});
            countDown--;
        }
        setTimeout(function() {
            settime(obj , countDown)
        },1000)
    }
    function getCanPassConector() { //获取提币noteCOde接口
        $.ajax({
            type: 'POST',
            url: '../../apply/smsapi',
            data: {
                identitycode: getIdentifycode() //用户标识码，从本地存储或者url参数中获取
            },
            success: function (res) {
                if (res.code === 200) {
                    console.log(res)
                    $(".warn").text('').hide() ;
                    return true
                } else {
                    $(".warn").text(res.msg).show() ;
                    settime($('.countDown'), 0);
                    return false
                }
            },
            error: function (error) {
                console.log(error)
            }
        });
    }

    function getCountCanConector() { //获取提币account and verifysms接口
        $.ajax({
            type: 'POST',
            url: '../../apply',
            data: {
                identitycode: getIdentifycode(), //用户标识码，从本地存储或者url参数中获取
                smscode: $("#codeCANPhone").val()
            },
            success: function (res) {
                if (res.code === 200) {
                    modelSuccessMethod(res, true) ;
                    $(".sureDialog-btn").click(function () {
                        $(".model").hide() ;
                        window.location.href = '../pages/activeShare.html?identitycode=' + getIdentifycode() ;
                    });
                    return true
                } else {
                    modelSuccessMethod(res, false) ;
                    $(".sureDialog-btn").click(function () {
                        $(".model").hide();
                    });
                    return false
                }
            },
            error: function (error) {
                console.log(error)
            }
        });
    }
});