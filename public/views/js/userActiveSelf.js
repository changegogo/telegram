$(function () {
        getIdentifycode() ;
        var qrCodeimgUrl = window.location.protocol + '//' + window.location.host + "?identitycode=" + getIdentifycode()
        var qrcode = $('.qrCode-img-container').qrcode({
            render: "canvas", //也可以替换为table
            width: 100,
            height: 100,
            text: qrCodeimgUrl/*可以通过ajax请求动态设置*/
        }).hide();
        //将生成的二维码转换成图片格式
        var canvas = qrcode.find('canvas').get(0);
        $('#qrcodeImg').attr('src', canvas.toDataURL('image/jpg'));
        weixinShareMethod() ;


});