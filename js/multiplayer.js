$(function () {
    function copy(obj) {
        var newObj = obj instanceof Array ? [] : {};
        for (var i in obj) {
            newObj[i] = typeof obj[i] == 'object' ? copy(obj[i]) : obj[i]
        }
        return newObj
    }
    var certType = ''
    var mobileSelect1 = new MobileSelect({
        trigger: '#trigger1',
        title: '选择证件类型',
        wheels: [{
            data: [{
                    id: '0',
                    value: '身份证'
                },
                {
                    id: '3',
                    value: '护照'
                },
                {
                    id: '2',
                    value: '回乡证'
                },
                {
                    id: '1',
                    value: '台胞证'
                }
            ]
        }],
        //初始化定位
        callback: function (indexArr, data) {
            console.log(data)
            certType = data[0].id; //返回选中的json数据
            console.log(certType)
        }
    });



    //渲染页面

    var rightNum = window.sessionStorage.getItem("rightNum");
    var html = ''
    for (var i = 0; i < rightNum - 1; i++) {
        html +=
            '<div class="single">' +
            '<div class="people">' +
            ' <img style="width:24px;vertical-align: text-bottom;" src="img/peoples.png" alt="">' +
            '</div>' +
            '<span class="human">权益人' + (i + 2) + '</span>' +
            '</div>' +

            '<div class="input">' +
            '<div class="input-name">' +
            '<span class="name-word">姓名</span>' +
            '<input type="text" class="input' + (i + "1") + '" placeholder="请输入姓名">' +
            '<div class="show exhibition' + i + 1 + '">' +
            ' <img class="warning" src="img/小图标_警示_小号@3x.png" alt="">' +
            ' <p class="error">姓名不能为空！</p>' +
            '</div>' +
            '</div>' +
            '<div class="input-name mar5">' +
            '<span class="name-word">证件类型</span>' +
            '<div class="arrows">' +
            '<div class="trigger" id="trigger' + (i + 2) + '">请输入证件类型</div>' +
            '<img src="img/choice@3x.png" alt="">' +
            '</div>' +
            '<div class="show1 exhibition' + i + 2 + '">' +
            ' <img class="warning" src="img/小图标_警示_小号@3x.png" alt="">' +
            ' <p class="error">请输入证件类型</p>' +
            '</div>' +

            '</div>' +
            '<div class="input-name mar5">' +
            '<span class="name-word">证件号码</span>' +
            '<input class="input' + (i + "2") + '" type="text" placeholder="请输入证件号码">' +
            '<div class="show2 exhibition' + i + 3 + '">' +
            ' <img class="warning" src="img/小图标_警示_小号@3x.png" alt="">' +
            ' <p class="error">证件号码不能为空</p>' +
            '</div>' +
            ' </div>' +
            '<div class="input-name mar5">' +
            '<span class="name-word">手机号码</span>' +
            '<input class="input' + (i + "3") + '" type="text" placeholder="选填">' +
            '</div>' +

            '</div>'

    }
    $('.append').html(html);

    //初始化选择插件
    var cert = {}
    setTimeout(function () {
        for (var i = 0; i < rightNum - 1; i++) {
            (function (index) {
                var mobileSelect = new MobileSelect({
                    trigger: '#trigger' + (index + 2),
                    title: '选择证件类型',
                    wheels: [{
                        data: [{
                                id: '0',
                                value: '身份证'
                            },
                            {
                                id: '3',
                                value: '护照'
                            },
                            {
                                id: '2',
                                value: '回乡证'
                            },
                            {
                                id: '1',
                                value: '台胞证'
                            }
                        ]
                    }],
                    //初始化定位
                    callback: function (indexArr, data) {
                        cert[index] = data[0].id;
                    }
                })
            })(i)
        }
    })

    //获取当前用户
    $('.present').click(function () {
        $.ajax({
            type: "get",
            url: "https://wechat.jinhui120.com/demo/api/ucenter/getCurrentUser",
            datatype: "json",
            contentType: "application/json",
            headers: {
                "X-WxFrom": 1,
                "X-SessionId": window.sessionStorage.getItem("sessionId")
            },
            success: function (data) {
                console.log(data)
                if (data.code == 200) {
                    certType = data.payload.idType
                    window.sessionStorage.setItem("certType", certType);
                    $('.inputs-name').val(data.payload.realName)
                    var certTypeName = ''
                    if (data.payload.idType == 0) certTypeName = '身份证'
                    if (data.payload.idType == 1) certTypeName = '台胞证'
                    if (data.payload.idType == 2) certTypeName = '回乡证'
                    if (data.payload.idType == 3) certTypeName = '护照'
                    $('#trigger1').html(certTypeName)
                    $('.inputs-card').val(data.payload.idNumber)
                    $('.inputs-phone').val(data.payload.mobile)
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    })

    //读取缓存写入页面（如果在确认页返回）
    var history = JSON.parse(window.sessionStorage.getItem('benefitUsers'))
    if (history){
        console.log(history)
        var certtpsName = ''
        if (history[0].idType == 0) certtpsName = '身份证'
        if (history[0].idType == 1) certtpsName = '台胞证'
        if (history[0].idType == 2) certtpsName = '回乡证'
        if (history[0].idType == 3) certtpsName = '护照'
        certType = history[0].idType
        $('.inputs-name').val(history[0].realName)
        $('#trigger1').html(certtpsName)
        $('.inputs-card').val(history[0].idNumber)
        $('.inputs-phone').val(history[0].mobile)

        for (var i = 1; i < rightNum ; i++) {
            (function (index) {
                var classindex = index - 1
                if(history[index]){
                    var certName = ''
                    if (history[index].idType == 0) certName = '身份证'
                    if (history[index].idType == 1) certName = '台胞证'
                    if (history[index].idType == 2) certName = '回乡证'
                    if (history[index].idType == 3) certName = '护照'
                    cert[classindex] = history[index].idType
                    
                    $('.input' + (classindex + "1") + '').val(history[index].realName)
                    $('#trigger' + (classindex + 2) + '').html(certName)
                    $('.input' + (classindex + "2") + '').val(history[index].idNumber)
                    $('.input' + (classindex + "3") + '').val(history[index].mobile)
                }
            })(i)
        }
    }
    //下一步，验证表单，然后写入缓存跳转到确认页
    $('.next1').click(function () {
        var flag = true;
        if ($.trim($(".inputs-name").val()) == '') {
            $('.show').css("display", 'block');
            flag = false;
        } else {
            $('.show').css("display", 'none');
        }

        if ($.trim($("#trigger1").html()) == '请输入证件类型') {
            $('.show1').css("display", 'block');
            flag = false;
        } else {
            $('.show1').css("display", 'none');
        }
        if ($.trim($(".inputs-card").val()) == '') {
            $('.show2').css("display", 'block');
            flag = false;
        } else {
            $('.show2').css("display", 'none');
        }


        for (var i = 0; i < rightNum - 1; i++) {
            (function (index) {
                if ($.trim($('.input' + (index + "1") + '').val()) ||
                    $.trim($('#trigger' + (index + 2) + '').html()) != '请输入证件类型' ||
                    $.trim($('.input' + (index + "2") + '').val())) {
                    if ($.trim($('.input' + (index + "1") + '').val()) == '') {
                        $('.exhibition' + index + 1).css("display", 'block');
                        flag = false;
                    } else {
                        $('.exhibition' + index + 1).css("display", 'none');
                    }

                    if ($.trim($('#trigger' + (index + 2) + '').html()) == '请输入证件类型') {
                        $('.exhibition' + index + 2).css("display", 'block');
                        flag = false;
                    } else {
                        $('.exhibition' + index + 2).css("display", 'none');
                    }
                    if ($.trim($('.input' + (index + "2") + '').val()) == '') {
                        $('.exhibition' + index + 3).css("display", 'block');
                        flag = false;
                    } else {
                        $('.exhibition' + index + 3).css("display", 'none');
                    }
                }
            })(i)
        }

        if (flag == false) return;
        var firstmes = {
            realName: $('.inputs-name').val(),
            mobile: $('.inputs-phone').val(),
            idNumber: $('.inputs-card').val(),
            idType: parseInt(certType)
        }
        var newarr = []
        newarr.push(firstmes)
        for (var i = 0; i < rightNum - 1; i++) {

            if ($.trim($('.input' + (i + "1") + '').val()) ||
                $.trim($('#trigger' + (i + 2) + '').html()) != '请输入证件类型' ||
                $.trim($('.input' + (i + "2") + '').val())) {
                var certType1 = parseInt(cert[i])
                console.log(cert[i])
                var benefitUsers = {
                    realName: $('.input' + (i + '1') + '').val(),
                    mobile: $('.input' + (i + '3') + '').val(),
                    idNumber: $('.input' + (i + '2') + '').val(),
                    idType: certType1
                }
                newarr.push(benefitUsers)
                console.log(newarr)
            }
            // console.log(certName)
            window.sessionStorage.setItem('benefitUsers', JSON.stringify(newarr))

            window.location.href = 'https://wechat.jinhui120.com/demo/confirmmultiplayer.html'
        }
    })

})