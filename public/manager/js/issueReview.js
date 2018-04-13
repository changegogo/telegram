$(function () {
    $(".admin-main").find('.am-btn').attr({disabled: true}) ;
    setTimeout(function () {
        $(".admin-main").find('.am-btn').attr({disabled: false}) ;
    }, 1000)
    $.fn.datetimepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今天",
        suffix: [],
        meridiem: ["上午", "下午"],
        rtl: true // 从右向左书写的语言你可以使用 rtl: true 来设置
    };
    $('#datetimepicker1').datetimepicker({
        autoclose: true,
        language:  'zh-CN'
    });
    $('#datetimepicker2').datetimepicker({
        autoclose: true,
        language:  'zh-CN'
    });

    var dataObj = {
        lastid: '' ,// 当前页的开始id或结束id
        isnext: '', // 0表示请求下一页，1表示请求上一页
        telphone: '', // 手机号码，如果不选择则传''
        //startDate: '', // 查询开始时间，如果不选择则传''
        //endDate: '', // 查询结束时间，如果不选择则传''
        status: $("#isDealCanStatus").val()  //0全部 1未处理 2同意 3拒绝
    } ;
    initalIssueReviewDataMethod(dataObj)
    function initalIssueReviewDataMethod(data) { // inital shuj
        $.ajax({
            type: 'GET',
            url: '../../admin/review',
            data: data ,
            success: function (res) {
                if (res.results.length <=0 && data.isnext === 0) {
                    $(".next-btn").addClass('am-disabled') ;
                    $(".prev-btn").removeClass('am-disabled') ;
                } else if (res.results.length <=0 && data.isnext === 1) {
                    $(".prev-btn").addClass('am-disabled') ;
                    $(".next-btn").removeClass('am-disabled') ;
                }else  {
                    $(".prev-btn").removeClass('am-disabled') ;
                    $(".prev-btn").removeClass('am-disabled') ;
                    disposeResultMethod(res) ;
                }
            },
            error: function (error) {
                console.log(error)
            }
        });
    }
    function  disposeResultMethod(res) { //处理数据
        if(res.code === 200) {
            var listArray = res.results ;
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
                    trItem.find(".checkbox-index").text(i + 1) ;
                    trItem.find(".bindMobile-phone").text(listArray[i].telphone) ;
                    trItem.find(".apply-date").text(GMTToStr(listArray[i].createtime)) ;
                    trItem.find(".eth-address").text(listArray[i].imtoken) ;
                    trItem.find(".ip-address").text(listArray[i].ip) ;
                    trItem.find(".applyCan-account").text(listArray[i].cancount / 10) ;
                    trItem.find(".status-nowing").text(isDealStatusMethod(listArray[i].isdeal)) ;
                    trItem.attr({dataid: listArray[i]._id}) ;
                    $(".listTbody").append(trItem) ;
                }
                $(".listItem").eq(0).remove() ;


                $('.listItem').find('.aggree-btn').add('#doc-confirm-toggle'). //agree btn tibi
                on('click', function() {
                    console.log($('.listItem').find('.aggree-btn').add('#doc-confirm-toggle'))
                    $('#my-confirm').modal({
                        relatedTarget: this,
                        onConfirm: function(options) {
                            var $link = $(this.relatedTarget).parent().parent().parent().parent();
                            var itemId = $link.attr('dataid') ;
                            console.log(itemId)
                            agreeItemTibiMethod (itemId) ;
                        },
                        onCancel: function() {
                            console.log('算求，不弄了');
                        }
                    });
                });
                $('.listItem').find('.refuse-btn').add('#doc-confirm-toggle'). //refuse btn tibi
                on('click', function() {
                    $('#my-confirm2').modal({
                        relatedTarget: this,
                        onConfirm: function(options) {
                            var $link = $(this.relatedTarget).parent().parent().parent().parent();
                            var itemId = $link.attr('dataid') ;
                            refuseItemTibiMethod (itemId) ;
                        },
                        onCancel: function() {
                            console.log('算求，不弄了');
                        }
                    });
                });
            }

        } else {
            alert(res.msg) ;
        }
    }
    function agreeItemTibiMethod(id) {
        $.ajax({
            type: 'GET',
            url: '../../admin/review/oper',
            data: {
                ids: id,
                status: 2
            },
            success: function (res) {
                if (res.code === 200) {
                    if (id.split(',').length > 1) {
                        var idsArray = id.split(',') ;
                        for (var i=0 ; i<idsArray.length; i++) {
                            $(".listItem[dataid="+idsArray[i]+"]").children(".status-nowing").text('同意') ;
                        }
                        alert('同意成功') ;
                    } else {
                        alert('同意成功') ;
                        $(".listItem[dataid="+id+"]").children(".status-nowing").text('同意') ;
                    }
                    // initalIssueReviewDataMethod (dataObj) ;
                } else {
                    alert(res.msg) ;
                }
            },
            error: function (error) {
                console.log(error)
            }
        });
    }
    function refuseItemTibiMethod(id) {
        $.ajax({
            type: 'GET',
            url: '../../admin/review/oper',
            data: {
                ids: id,
                status: 3
            },
            success: function (res) {
                if (res.code === 200) {
                    if (id.split(',').length > 1) {
                        var idsArray = id.split(',') ;
                        for (var i=0 ; i<idsArray.length; i++) {
                            $(".listItem[dataid="+idsArray[i]+"]").children(".status-nowing").text('拒绝') ;
                        }
                        alert('拒绝成功') ;
                    } else {
                        alert('拒绝成功') ;
                        $(".listItem[dataid="+id+"]").children(".status-nowing").text('拒绝') ;
                    }
                    // initalIssueReviewDataMethod (dataObj) ;
                } else {
                    alert(res.msg) ;
                }
            },
            error: function (error) {
                console.log(error)
            }
        });
    }
    checkAllToggle() ;
    function checkAllToggle() {  //allcheck is noallcheck
        var checkboxList = document.getElementsByName('checkboxName') ;
        var checkboxThName = document.getElementsByName('checkboxThName')[0] ;
        var checkboxToggle = false
        $('.table-check').click(function () {
            if (!checkboxToggle) {
                for (var i = 0; i < checkboxList.length; i++) {
                    checkboxList[i].checked = true
                }
                checkboxThName.checked = true
                checkboxToggle = true
            } else {
                for (var i = 0; i < checkboxList.length; i++) {
                    checkboxList[i].checked = false
                }
                checkboxThName.checked = false
                checkboxToggle = false
                }
        })
    }

    batchAgreebtnMethod() ;
    function batchAgreebtnMethod() { //batch agree operation
        $(".batch-agreeBtn").click(function () {
            if ($(":checkbox[name=checkboxName]:checked").length <= 0) {
                alert("请至少选择一条信息进行操作！");
            } else {
                var checkedLength = $(":checkbox[name=checkboxName]:checked").length ;
                var idList = '' ;
                for (var i=0; i<checkedLength; i++) {
                    idList += ($(":checkbox[name=checkboxName]:checked").eq(i).parent().parent().attr('dataid') + ',') ;
                }
                idList = idList.substring(0, idList.length -1) ;
                console.log(idList) ;
                // return
                agreeItemTibiMethod(idList) ;
            }
        })

        $(".batch-refuseBtn").click(function () {
            if ($(":checkbox[name=checkboxName]:checked").length <= 0) {
                alert("请至少选择一条信息进行操作！");
            } else {
                var checkedLength = $(":checkbox[name=checkboxName]:checked").length ;
                var idList = '' ;
                for (var i=0; i<checkedLength; i++) {
                    idList += ($(":checkbox[name=checkboxName]:checked").eq(i).parent().parent().attr('dataid') + ',') ;
                }
                idList = idList.substring(0, idList.length -1) ;
                refuseItemTibiMethod(idList) ;

            }
        })
    }
    searchReviewInfoMethod() ;
     function searchReviewInfoMethod() { //seachr review info
        var myreg=/^[1][3,4,5,6,7,8][0-9]{9}$/;
        $(".searchReview-btn").click(function () {
            console.log(myreg.test($("#mobile-phone").val()))
            // if ($("#mobile-phone").val() === '' || !myreg.test($("#mobile-phone").val())) {
            //     alert('手机号不能为空或者手机号格式不正确') ;
            // } else if ($(".startDate-input").val() === '') {
            //     alert('请选择开始日期') ;
            // } else {
                var dataObj = {
                    lastid: '' ,// 当前页的开始id或结束id
                    isnext: '', // 0表示请求下一页，1表示请求上一页
                    telphone: $("#mobile-phone").val(), // 手机号码，如果不选择则传''
                    startDate: $(".startDate-input").val(), // 查询开始时间，如果不选择则传''
                    endDate: $(".endDate-input").val(), // 查询结束时间，如果不选择则传''
                    status: $("#isDealCanStatus").val()  //0全部 1未处理 2同意 3拒绝
                } ;
                initalIssueReviewDataMethod (dataObj) ;
            // }
        })
    }


    prevPageMethod() ;
    function prevPageMethod() { //click prev page
            $(".prev-btn").click(function () {
                var dataObj = {
                    lastid: $(".listItem").eq(0).attr('dataid') ,// 当前页的开始id或结束id
                    isnext: 1, // 0表示请求下一页，1表示请求上一页
                    telphone: $("#mobile-phone").val(), // 手机号码，如果不选择则传''
                    startDate: $(".startDate-input").val(), // 查询开始时间，如果不选择则传''
                    // endDate: $(".endDate-input").val(), // 查询结束时间，如果不选择则传''
                    status: $("#isDealCanStatus").val()  //0全部 1未处理 2同意 3拒绝
                } ;
                initalIssueReviewDataMethod (dataObj) ;
            })
    }
    nextPageMethod() ;
    function nextPageMethod() { //click next page
        setTimeout(function () {
            $(".next-btn").click(function () {
                var dataObj = {
                    lastid: $(".listItem").eq(-1).attr('dataid') ,// 当前页的开始id或结束id
                    isnext: 0, // 0表示请求下一页，1表示请求上一页
                    telphone: $("#mobile-phone").val(), // 手机号码，如果不选择则传''
                    startDate: $(".startDate-input").val(), // 查询开始时间，如果不选择则传''
                    // endDate: $(".endDate-input").val(), // 查询结束时间，如果不选择则传''
                    status: $("#isDealCanStatus").val()  //0全部 1未处理 2同意 3拒绝
                } ;
                initalIssueReviewDataMethod (dataObj) ;
            })
        }, 1000)
    }
    exportExcelMethod() ;
    function exportExcelMethod() {
        $(".batch-exportEXCEL").click(function () {
            var checkedLength = $(":checkbox[name=checkboxName]").length ;
            if (checkedLength <=0) {
                alert('没有可导出的数据') ;
                return false
            } else {
                var idList = '' ;
                for (var i=0; i<checkedLength; i++) {
                    idList += ($(":checkbox[name=checkboxName]").eq(i).parent().parent().attr('dataid') + ',') ;
                }
                idList = idList.substring(0, idList.length -1) ;
                window.location.href = window.location.protocol + '//' + window.location.host +'telegram/admin/review/xlsx?ids=' + idList ;
            }


        })
    }
    function isDealStatusMethod(status) {
        switch (status) {
            case 1 : {
                return status = '未处理'
            }
            break ;
            case 2 : {
                return status = '同意'
            }
            break ;
            case 3 : {
                return status = '拒绝'
            }
            break ;
        }
    }

}) ;