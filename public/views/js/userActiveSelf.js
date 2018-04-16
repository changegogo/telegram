$(function () {
    productImgMethod()
    function productImgMethod() {
        if (getQueryString('identitycode')) {
            var qrCodeimgUrl = window.location.protocol + '//' + window.location.host + "/telegram/index.html?identitycode=" +getQueryString('identitycode');
        } else {
            window.location.href = window.location.protocol + '//' + window.location.host + "/telegram/index.html"
        }
    }

    imgMethodAjax () ;
    function imgMethodAjax() {
       $.ajax({
           url: '../../genposter',
           type: 'post',
           data: {
               identitycode: getQueryString('identitycode')
           },
           success: function(res){
               console.log(JSON.stringify(res));
               $('#tuiguangImg').attr('src', '../../poster/'+res.path);
               // $('#tuiguangImg').attr('src', 'http://192.168.1.141:8890/poster/'+res.path);
           },
           error: function(err){
               console.log(err);
           }
       });
   }

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
});