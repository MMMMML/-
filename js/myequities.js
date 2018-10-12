$(function () {
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    var url = location.href;
    var sessionId = GetQueryString("sessionId");

    if (sessionId == null) {
        window.sessionStorage.setItem("sessionId", "");
    } else {
        window.sessionStorage.setItem("sessionId", sessionId);
    }

    if (window.sessionStorage.getItem("sessionId")) {
        console.log(sessionId)
        $.ajax({
            type: "get",
            url: "https://wechat.jinhui120.com/demo/api/ucenter/getCurrentUser",
            datatype: "json",
            contentType: "application/json",
            headers: {
                "X-WxFrom": 1,
                "X-SessionId": sessionId
            },
            success: function (data) {
                // console.log(data)
                if (data.payload === null||data.payload.verified==false) {
                    window.sessionStorage.setItem("page", 2)
                    window.location.href = 'https://wechat.jinhui120.com/demo/attestation.html'
                } else {
                    $.ajax({
                        type: "get",
                        url: "https://wechat.jinhui120.com/demo/api/ucenter/getBenefits ",
                        datatype: "json",
                        contentType: "application/json",
                        headers: {
                            "X-WxFrom": 1,
                            "X-SessionId": sessionId
                        },
                        success: function (data) {
                            var infodata = data
                            if (data.code == 200) {
                                var info = data.payload
                                var html = ''
                                if (data.payload.length == 0) {
                                    window.location.href = 'https://wechat.jinhui120.com/demo/noequities.html'
                                }
                                for (var i = 0; i < info.length; i++) {
                                    
                                    var mess = info[i]
                                    if(mess.productId==101){
                                        mess.expireTime ='2018年12月31日'
                                    }
                                    html +=
                                        '<div class="card card' + i + '" style="margin-top:10px;">' +
                                        '<img src=' + mess.imageUrl + ' alt="">' +
                                        ' <div class="word">' +
                                        '<h4>' + mess.name + '</h4>' +
                                        '<div class="infoBox">' +
                                            '<p class="dates">有效期截止到</p>' +
                                            '<p class="end-date">' + mess.expireTime + '</p>' +
                                        '</div>' +
                                        ' </div>' +
                                        '</div>'

                                }
                                $('.box').html(html)
                                setTimeout(function () {
                                    for (var i = 0; i < info.length; i++) {
                                        (function (index) {
                                            $('.card' + index + '').click(function () {
                                                console.log(infodata)
                                                var productId = infodata.payload[index].productId
                                                window.sessionStorage.setItem('productId', productId)
                                                window.location.href = 'https://wechat.jinhui120.com/demo/details.html'
                                            })
                                        })(i)
                                    }

                                }, 1000)
                            }





                        },
                        error: function (err) {
                            console.log(err);
                        }
                    })
                }

            },
            error: function (err) {
                console.log(err);
            }
        })



    } else {
        window.location.href =
            "https://wechat.jinhui120.com/demo/api/ucenter/fuwuLogin?state=https://wechat.jinhui120.com/demo/myequities.html";
    }
})