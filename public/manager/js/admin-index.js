$(function () {
    var dataObj = {
            lastid: '',
            isnext: '',
            telphone: '',
            ispickup: ''
        } ;
    initalPlayerMethod (dataObj) ;
    function initalPlayerMethod(data) { // 初始化shuj
        $.ajax({
            type: 'GET',
            url: '../../admin/player',
            data: data ,
            success: function (res) {
                if (res.rows.length <=0 && data.isnext === 0) {
                    $(".next-btn").addClass('am-disabled') ;
                    $(".prev-btn").removeClass('am-disabled') ;
                } else if (res.rows.length <=0 && data.isnext === 1) {
                    $(".prev-btn").addClass('am-disabled') ;
                    $(".next-btn").removeClass('am-disabled') ;
                } else  {
                    $(".prev-btn").removeClass('am-disabled') ;
                    $(".next-btn").removeClass('am-disabled') ;
                    disposeResultMethod(res) ;
                }
            },
            error: function (error) {
                console.log(error)
            }
        });
    }
    function deleItemMethod(id) { //删除某一项数据
        $.ajax({
            type: 'GET',
            url: '../../admin/player/del',
            data: {
                id: id
            },
            success: function (res) {
                if (res.code === 200) {
                    alert('删除成功') ;
                    initalPlayerMethod (dataObj) ;
                } else {
                    alert(res.msg) ;
                }
            },
            error: function (error) {
                console.log(error)
            }
        });
    }
    function  disposeResultMethod(res) { //处理数据
        if(res.code === 200) {
            var listArray = res.rows ;
            console.log(listArray.length)
            if (listArray.length <= 0){
                $(".info-tablewrapper").hide() ;
                $(".no-dataClass").show() ;
                return false
            } else {
                $(".info-tablewrapper").show() ;
                $(".no-dataClass").hide() ;
                $(".listItem").eq(0).siblings().remove() ;
                for (var i=0, len = listArray.length; i<len; i ++) {
                    var trItem = $(".listItem").eq(0).clone() ;
                    trItem.find(".user-telephone").text(listArray[i].telphone) ;
                    trItem.find(".invit-count").text(listArray[i].invitcount) ;
                    trItem.find(".totalcan-count").text(listArray[i].totalcancount) ;
                    if (listArray[i].ispickup === true) {
                        trItem.find(".is-pickup").text('是') ;
                    } else {
                        trItem.find(".is-pickup").text('否') ;
                    }
                    trItem.find(".ip-address").text(listArray[i].bindip) ;
                    trItem.find(".create-time").text(GMTToStr(listArray[i].createtime)) ;
                    trItem.attr({dataId: listArray[i]._id})
                    $(".listTbody").append(trItem) ;
                }
                $(".listItem").eq(0).remove() ;
                $('.listTbody').find('.dele-btn').add('#doc-confirm-toggle').
                on('click', function() {
                    $('#my-confirm').modal({
                        relatedTarget: this,
                        onConfirm: function(options) {
                            var $link = $(this.relatedTarget).parent().parent();
                            var itemId = $link.attr('dataid') ;
                            deleItemMethod (itemId) ;
                        },
                        onCancel: function() {
                            console.log('算求，不弄了');
                        }
                    });
                });
            }

        }
    }
    searchMethod() ;
    function searchMethod() { //click searchBtn search info
        var myreg=/^[1][3,4,5,6,7,8][0-9]{9}$/;
        $(".search-btn").click(function () {
            if ($("#mobile-phone").val() === '' || !myreg.test($("#mobile-phone").val())) {
                alert('手机号不能为空或者手机号格式不正确') ;
            } else {
                var dataObj = {
                    lastid: '',
                    isnext: '',
                    telphone: $("#mobile-phone").val(),
                    ispickup: $("#isPickUpCan").val()
                } ;
                initalPlayerMethod (dataObj) ;
            }
        })
    }
    prevPageMethod()
    function prevPageMethod() { //click prev page
        setTimeout(function () {
            $(".prev-btn").click(function () {
                var dataObj = {
                    lastid: $(".listItem").eq(0).attr('dataid'),
                    isnext: 1,
                    telphone: $("#mobile-phone").val(),
                    ispickup: $("#isPickUpCan").val()
                } ;
                initalPlayerMethod (dataObj) ;
            })
        }, 1000)
    }
    nextPageMethod() ;
    function nextPageMethod() { //click next page
        setTimeout(function () {
            $(".prev-btn").click(function () {
                var dataObj = {
                    lastid: $(".listItem").eq(-1).attr('dataid'),
                    isnext: 0,
                    telphone: $("#mobile-phone").val(),
                    ispickup: $("#isPickUpCan").val()
                } ;
                initalPlayerMethod (dataObj) ;
            })
        }, 1000)
    }
}) ;