$.fn.loading = function(options) {
    var isLoading = this.data('isLoading') 
    if(!options || options == 'true') {
        this.data('isLoading', true).attr('disabled', 'disabled')
        
    }else if(options == 'close') {
        this.data('isLoading', false).removeAttr('disabled')
    }
    return this;
}
// 倒计时
function countDown (btn) {
    var time = 60;
    var t = setInterval( function() {
        if(time>1) {
            time -- ;
            $(btn).loading().html(
                 time + 'S后可以重新获取'
                ).css({
                'color': 'rgba(0,0,0,0.38)'
            });
            $(btn).off('click');
        }else {
            clearInterval(t);
            time = 60;
            $(btn).on('click', function() {
                    countDown(this);
                    $(btn).off('click');
            }).loading('close').html('获取验证码');
        }
    }, 1000);
}