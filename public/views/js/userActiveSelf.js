// getIdentifycode() ;
$(function () {
    // $("#bigbig-img").css({height: document.body.clientHeight + 'px'})
    // document.body.style.overflow='hidden';
    function productImgMethod() {
        var qrCodeimgUrl = window.location.protocol + '//' + window.location.host + "/telegram/index.html?identitycode=" +getIdentifycode();
        var qrcode = $('.qrCode-img-container').qrcode({
            render: "canvas", //也可以替换为table
            width: 100,
            height: 100,
            text: qrCodeimgUrl/*可以通过ajax请求动态设置*/
        }).hide();
        //将生成的二维码转换成图片格式
        var canvas = qrcode.find('canvas').get(0);
        $('#qrcodeImg').attr('src', canvas.toDataURL('image/jpg'));
        htmlFomatCanvasMethod() ;
    }
   function htmlFomatCanvasMethod() {
       html2canvas(document.querySelector("#userActiveSelf"),{
           allowTaint:true,
           height: $("#userActiveSelf").outerHeight() + 100,
       }).then(canvas => {
           console.log($("#userActiveSelf").outerHeight())
           $("#userActiveSelf").hide() ;
           var image = new Image();
           image.src = canvas.toDataURL("image/png");
           $("#bigbig-img").append(image);
           // document.body.appendChild(canvas)
       });
   }


});