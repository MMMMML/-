$(function () {
    // window.sessionStorage.removeItem('anaphylaxis')
    // window.sessionStorage.removeItem('familyHistory')
    // window.sessionStorage.removeItem('drugUse')
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
                if (data.payload === null || data.payload.verified == false) {
                    window.sessionStorage.setItem("page", 1)
                    window.location.href = 'https://wechat.jinhui120.com/demo/attestation.html'
                } else {
                    $.ajax({
                        type: "post",
                        url: "https://wechat.jinhui120.com/demo/api/card/getActiveRecords",
                        datatype: "json",
                        contentType: "application/json",
                        headers: {
                            "X-WxFrom": 1,
                            "X-SessionId": sessionId
                        },
                        success: function (data) {
                            if (data.code == 200) {
                                var info = data.payload.list
                                if (info.length == 0) {
                                    window.location.href = 'https://wechat.jinhui120.com/demo/noshop.html'
                                }
                                var html = ''
                                var str = ''
                                for (var i = 0; i < info.length; i++) {
                                    var mess = info[i]
                                    var msg = info[i].benefitUsers
                                    html +=
                                        ' <div class="title">' +
                                        '<p>' + mess.productName + '-' + mess.cardNumber + '</p>' +
                                        '</div>' +
                                        '<div class="mess">' +
                                        '<div class="date">' + mess.createTimeString + '</div>' +
                                        '</div>'
                                    for (var k = 0; k < msg.length; k++) {
                                        var benefit = msg[k]
                                        html +=
                                            '<div class="info">' +
                                            '<span class="realname">' + benefit.realName + '</span>'
                                        if (benefit.idType == '0') html += '<span class="certificate cart">身份证</span>'
                                        if (benefit.idType == '1') html += '<span class="certificate cart1">台胞证</span>'
                                        if (benefit.idType == '2') html += '<span class="certificate cart2">回乡证</span>'
                                        if (benefit.idType == '3') html += '<span class="certificate cart3">护照</span>'
                                        html +=

                                            '<span class="idNumber">' + benefit.idNumber + '</span>' +
                                            '<span class="add"><img class="addimg addimg' + i + '' + k + '" src="img/小图标_添加@3x.png" alt=""></span>' +
                                            '</div>'
                                    }
                                }

                                str +=
                                    '<div class="shade">' +
                                    '<div class="shade-img2">' +
                                    '<div class="square">' +
                                    '<img style="width: 50%;margin-top: 0.8rem;" src="img/小图标_添加@3x.png" alt=""></div>' +

                                    '<img class="img1" src="img/使用导览.png" alt="">' +
                                    '<img class="img2" src="img/我知道啦.png" alt="">' +

                                    '</div>' +
                                    '</div>'
                                $('.box').html(html)
                               
                                setTimeout(function () {
                                    for (var i = 0; i < info.length; i++) {
                                        var msg = info[i].benefitUsers
                                        for (var k = 0; k < msg.length; k++) {
                                            (function (index,key,msg) {
                                            $('.addimg' + index + '' +key + '').click(function () {
                                                var userid = msg[key].id
                                                window.sessionStorage.setItem('userid',userid)
                                                $.ajax({
                                                    type: "get",
                                                    url: "https://wechat.jinhui120.com/demo/api/ucenter/getUserById?id="+userid,
                                                    datatype: "json",
                                                    contentType: "application/json",
                                                    headers: {
                                                        "X-WxFrom": 1,
                                                        "X-SessionId": window.sessionStorage.getItem("sessionId")
                                                    },
                                                    success: function (data) {
                                                        if(data.code==200){
                                                            window.sessionStorage.setItem('data',JSON.stringify(data.payload))
                                                            window.location.href='https://wechat.jinhui120.com/demo/emergency.html'
                                                        }
                                                        
                                                    },
                                                    error: function (err) {
                                                        console.log(err);
                                                    }
                                                })
                                            })
                                        })(i,k,msg)
                                        }
                                        
                                    }

                                }, 1000)



                                $('.warper').html(str)

                                var first = window.localStorage.getItem('first')
                                if (first == 1) {
                                    //  alert('hide')
                                    $('.warper').css('display', 'none')
                                } else {
                                    $('.warper').css('display', 'block')
                                    window.localStorage.setItem('first', '1')

                                }
                                $('.img2').click(function () {
                                    $('.warper').css('display', 'none')
                                })
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
            "https://wechat.jinhui120.com/demo/api/ucenter/fuwuLogin?state=https://wechat.jinhui120.com/demo/purchase.html";
    }
})