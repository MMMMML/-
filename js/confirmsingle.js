$(function () {
    var name = window.sessionStorage.getItem('name')
    var idnumber = window.sessionStorage.getItem("idnumber");
    var phone = window.sessionStorage.getItem("phone");
    var certType = window.sessionStorage.getItem("certType");
    if (certType == 0) certTypes = '身份证'
    if (certType == 1) certTypes = '台胞证'
    if (certType == 2) certTypes = '回乡证'
    if (certType == 3) certTypes = '护照'

    $('.name').html(name)
    $('.idnumber').html(idnumber)
    $('.phone').html(phone)
    $('.certType').html(certTypes)

    $('.next').click(function () {
        $('.waiting-nv').css('display','block')
        var certType1 = parseInt(certType)
        var datastring = [{
            "realName": name,
            "mobile": phone,
            "idType": certType1,
            "idNumber": idnumber
        }];
       
        $.ajax({
            type: "post",
            url: "https://wechat.jinhui120.com/demo/api/card/activeLegacy",
            datatype: "json",
            contentType: "application/json",
            headers: {
                "X-WxFrom": 1,
                "X-SessionId": window.sessionStorage.getItem("sessionId")
            },
            data: JSON.stringify({
                cardId: window.sessionStorage.getItem('cardId'),
                pkgCode: window.sessionStorage.getItem('pkgCode'),
                isSingle: true,
                benefitUsers:datastring 
            }),
            success: function (data) {
                console.log(data)
                if(data.code==200){
                    $('.waiting-nv').css('display','none')
                    window.location.href='https://wechat.jinhui120.com/demo/success.html'
                }
                if(data.message=="无效的证件号码"){
                    alert('证件号码输入错误！')
                }
                if(data.message=="无效的手机号码"){
                    alert('手机号码输入错误！')
                }
                if(data.message=="实体卡不存在或者已被激活"){
                    alert('实体卡不存在或者已被激活')
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    })

})