interceptAjaxMethod() ;
function interceptAjaxMethod() {
    hookAjax({
        //拦截回调
        onload:function(xhr){
            var res = JSON.parse(xhr.response) ;
            if (res.code !== 200) {
                alert('登录超时，请先登录') ;
                window.location.href = 'login.html' ;
            }
        }
    })
}

$(".loginOut-btn").click(function () {
    $.ajax({
        type: 'GET',
        url: '../../user/loginout',
        data: {
        },
        success: function (res) {
            if (res.code === 200) {
                alert('登出成功') ;
                window.location.href = 'login.html' ;
            } else {
                return false
            }
        },
        error: function (error) {
            console.log(error)
        }
    });
}) ;