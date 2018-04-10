$(function () {
    $(".login-btn").click(function () {
        loginMethod() ;
    }) ;
    $(document).keydown(function(event){
        if(event.keyCode === 13) {
            loginMethod() ;
        }
    });
    function  loginMethod() {
        $.ajax({
            type: 'POST',
            url: '../../user/loginin',
            data: {
                username: $("#userName").val(),
                password: $("#user_Password").val()
            },
            success: function (res) {
                if (res.code === 200) {
                    window.location.href = 'admin-index.html' ;
                } else {
                    alert('密码或验证码不正确');
                    return false
                }
            },
            error: function (error) {
                console.log(error)
            }
        });
    }


});