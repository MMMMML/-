$(function () {
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
            certType = data[0].id; //返回选中的json数据
            console.log(certType)
        }
    });
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
                    window.sessionStorage.setItem("certType",certType);

                    $('.input1').val(data.payload.realName)
                    if (data.payload.idType == 0) certTypes = '身份证'
                    if (data.payload.idType == 1) certTypes = '台胞证'
                    if (data.payload.idType == 2) certTypes = '回乡证'
                    if (data.payload.idType == 3) certTypes = '护照'
                    $('#trigger1').html(certTypes)
                    $('.input2').val(data.payload.idNumber)
                    $('.input3').val(data.payload.mobile)
                }
                console.log(certType)
            },
            error: function (err) {
                console.log(err);
            }
        })
    })

    $('.next').click(function () {
        
        console.log(certType)
        var flag = true;
        if ($.trim($(".input1").val()) == '') {
            $('.show').css("display", 'block');
            flag = false;
        }
        else {
            $('.show').css("display", 'none');
        }
        if ($.trim($("#trigger1").html()) == '请输入证件类型') {
            $('.show1').css("display", 'block');
            flag = false;
        } 
        else {
            $('.show1').css("display", 'none');
        }
        if ($.trim($(".input2").val()) == '') {
            $('.show2').css("display", 'block');
            flag = false;
        } 
        else {
            $('.show2').css("display", 'none');
        }
        if (flag == false) return;

        var name = $('.input1').val();
        var idnumber = $('.input2').val();
        var phone = $('.input3').val();

        window.sessionStorage.setItem("name", name);
        window.sessionStorage.setItem("idnumber", idnumber);
        window.sessionStorage.setItem("phone", phone);
        window.sessionStorage.setItem("certType", certType);
       

        window.location.href = 'https://wechat.jinhui120.com/demo/confirmsingle.html'
    })
})