interceptAjaxMethod() ;
function interceptAjaxMethod() {
    $.ajaxSetup({
        contentType:"application/x-www-form-urlencoded;charset=utf-8",
        complete:function(XMLHttpRequest,textStatus){
            //通过XMLHttpRequest取得响应结果
            var res = XMLHttpRequest.responseText;
            try{
                var jsonData = JSON.parse(res);
                if(jsonData.code === 202 ) {
                    alert('登录超时，请先登录') ;
                    window.location.href = 'login.html' ;
                }
            }catch(e){
            }
        }
    });
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