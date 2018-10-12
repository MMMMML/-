$(function () {
    function copy(obj) {
        var newObj = obj instanceof Array ? [] : {};
        for (var i in obj) {
            newObj[i] = typeof obj[i] == 'object' ? copy(obj[i]) : obj[i]
        }
        return newObj
    }
    var Users = JSON.parse(window.sessionStorage.getItem("benefitUsers"))
    var rightNum = window.sessionStorage.getItem("rightNum")
    console.log(Users)
    var html = ''
    for (var i = 0; i <= Users.length - 1; i++) {
        var mine = copy(Users[i])
        if (mine.idType == '0') mine.pdnamedisaplay = '身份证'
        if (mine.idType == '1') mine.pdnamedisaplay = '台胞证'
        if (mine.idType == '2') mine.pdnamedisaplay = '回乡证'
        if (mine.idType == '3') mine.pdnamedisaplay = '护照'
        html +=
            '<div class="nav">' +
            '<div class="mess">' +
            '<div class="people">' +
            '<img style="width:24px;vertical-align: text-bottom;" src="img/peoples.png" alt="">' +
            ' </div>' +
            '<span class="human">权益人' + (i + 1) + '</span>' +
            '<div class="line"></div>' +
            '</div>' +
            '<div class="mess">' +
            '<span class="people">姓名</span>' +
            ' <span class="human black">' + mine.realName + '</span>' +
            '</div>' +
            '<div class="mess">' +
            '<span class="people">证件类型</span>' +
            '<span class="human black">' + mine.pdnamedisaplay + '</span>' +
            '</div>' +
            '<div class="mess">' +
            '<span class="people">证件号码</span>' +
            '<span class="human black">' + mine.idNumber + '</span>' +
            '</div>'
        if (mine.mobile != '') html +=
            '<div class="mess" id="mobile">' +
            '<span class="people">手机号码</span>' +
            '<span class="human black">' + mine.mobile + '</span>' +
            '</div>'
        html +=
            '</div>'

    }
    $('.box').html(html)
    
    var str = ''
    var number = rightNum - Users.length
    str +=
        '<div class="agree">' +
        '<div class="checkbox-wrap">' +
        '<input type="checkbox" class="checkbox" value="guangpan" name="choose" id="guangpan">' +
        '<label for="guangpan">' +
        '<div class="agree-nav">您当前卡为' + rightNum + '人卡，还有' + number + '个名额未填写，若现在提交资料，将视您自愿放弃当前名额，是否提交？</div>' +
        '</label>' +
        '</div>' +
        '</div>'
    $('.box2').html(str)
    
    if(rightNum!=Users.length){
        $('.agree').css("display", 'block')
    }
    else if(rightNum==Users.length){
        $('.agree').css("display", 'none')
    }
    $('.next2').click(function () {
        $('.waiting-nv').css('display','block')
        if(rightNum!=Users.length){
            if (!$(".checkbox").is(":checked")) {
                $('.agree').css("display", 'block')
                $(".next-btn").disabled = "disabled";
                alert('请确认打钩！')
                return;
            } else {
                $('.agree').css("display", 'none')
            }
        }
        
        console.log(123)
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
                isSingle: false,
                benefitUsers: Users

            }),
            success: function (data) {
                console.log(data)
                if (data.code == 200) {
                    $('.waiting-nv').css('display','none')
                    window.location.href = 'https://wechat.jinhui120.com/demo/success.html'
                }
                if (data.message == "无效的证件号码") {
                    alert('证件号码输入错误！')
                }
                if (data.message == "无效的手机号码") {
                    alert('手机号码输入错误！')
                }
                if (data.message == "实体卡不存在或者已被激活") {
                    alert('实体卡不存在或者已被激活')
                }
                if (data.message == "权益人证件信息重复，请重新输入") {
                    alert('权益人证件信息重复，请重新输入!')
                }
            },
            error: function (err) {
                console.log(err);
                window.location.href='https://wechat.jinhui120.com/demo/fail.html'
            }
        })
    })
    $('.next-btn1').click(function(){
        window.location.href='https://wechat.jinhui120.com/demo/multiplayer.html'
    })
})