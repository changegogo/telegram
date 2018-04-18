$(function () {
    versionController() ;
    productImgMethod() ;
    function productImgMethod() {
        if (getQueryString('identitycode')) {
            imgMethodAjax () ;
        } else {
            window.location.href = window.location.protocol + '//' + window.location.host + "/telegram/index.html"
        }
    }

    function imgMethodAjax() {
       $.ajax({
           url: '../../genposter',
           type: 'post',
           data: {
               identitycode: getQueryString('identitycode')
           },
           success: function(res){
               console.log(res);
               if (res.code == 200) {
                   $('#tuiguangImg').attr('src', '../../poster/'+res.path);
               } else {
                   window.location.href = window.location.protocol + '//' + window.location.host + "/telegram/index.html"
               }


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