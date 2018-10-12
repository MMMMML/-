$(function () {
    var productId = window.sessionStorage.getItem('productId')
    $.ajax({
        type: "get",
        url: "https://wechat.jinhui120.com/demo/api/product/getProductDetail?productId=" + productId,
        datatype: "json",
        contentType: "application/json",
        headers: {
            "X-WxFrom": 1,
            "X-SessionId": window.sessionStorage.getItem("sessionId")
        },
        success: function (data) {
            console.log(data)
            var info = data.payload
            console.log(info)
            if(info.periodUnit=='3') info.date ='年'
            if(info.periodUnit=='2') info.date ='月'
            if(info.periodUnit=='1') info.date ='天'
            var html = ''                                                                                                                                                                                  
                html +=
                '<div>' +
                '<p class="title">'+info.name+'</p>' +
                '</div>' +
                '<div class="date">' +
                '<p>有效期</p>' +
                '<p class="enddate">'+info.periodLimit+''+info.date+'</p>' +
                '</div>' +
                '<div class="nav">'+info.description+'</div>'
            $('.box').html(html)

        },
        error: function (err) {
            console.log(err);
        }
    })
})