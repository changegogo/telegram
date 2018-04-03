$(function () {
        getIdentifycode() ;
        var qrcode = $('.qrCode-img-container').qrcode({
            render: "canvas", //也可以替换为table
            width: 100,
            height: 100,
            text: "https://mobipromo.io/telegram?identitycode=" + getIdentifycode()/*可以通过ajax请求动态设置*/
        }).hide();
        //将生成的二维码转换成图片格式
        var canvas = qrcode.find('canvas').get(0);
        $('#qrcodeImg').attr('src', canvas.toDataURL('image/jpg'));
        function weixinShareMethod() {
            $.ajax({
                type: 'GET',
                url: '../../weixin/signture',
                data: {
                    url: window.location.href.split('#')[0]
                },
                success: function (res) {
                    console.log(res) ;
                    wx.config({
                        appId: res.appId,
                        timestamp: res.timestamp,
                        nonceStr: res.nonceStr ,
                        signature: res.signature,
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage'
                        ]
                    });
                    wx.ready(function() {
                        // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
                        wx
                            .onMenuShareTimeline({
                                title: '电报推广！',
                                link: 'https://mobipromo.io',
                                imgUrl: '../../common/images/logo.png',
                                desc: '电报推广推广推广',
                                success: function() {
                                    // alert('ok');
                                },
                                cancel: function() {
                                    // 用户取消分享后执行的回调函数
                                    // alert('cancle');
                                }
                            });
                        // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
                        wx
                            .onMenuShareAppMessage({
                                title: '电报推广！',
                                link: 'https://mobipromo.io',
                                imgUrl: '../../common/images/logo.png',
                                desc: '电报推广推广推广',
                                type: 'link',
                                success: function() {
                                    // alert('ok');
                                },
                                cancel: function() {
                                    // 用户取消分享后执行的回调函数
                                    // alert('cancle');
                                }
                            });
                    });
                },
                error: function (error) {
                    console.log(error)
                }
            });
        }


});