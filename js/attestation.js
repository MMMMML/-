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

    //    获取验证码
    var disabled = false
    var sessionId = window.sessionStorage.getItem("sessionId")
    $('.btn').click(function () {
        if (disabled) {
            return false;
        }
        if ($("#trigger1").html() == "请输入证件类型"){
            alert("请选择证件类型!");
            return false;
        }
        if ($(".input3").val() == "" || isNaN($(".input3").val()) || $(".input3").val().length != 11) {
            alert("请填写正确的手机号！");
            return false;
        }
        var countdown = 60;
        var generate_code = $(".btn");

        function settime() {
            if (countdown == 0) {
                generate_code.attr("disabled", false);
                disabled = false
                generate_code.html("获取验证码");
                countdown = 60;
                return false;
            } else {
                $(".generate_code").attr("disabled", true);
                disabled = true
                generate_code.html("重新发送(" + countdown + ")");
                countdown--;
            }
            setTimeout(function () {
                settime();
            }, 1000);
        }
        $.ajax({
            type: "post",
            url: "https://wechat.jinhui120.com/demo/api/ucenter/sendVCode",
            // contentType: "x-www-form-urlencoded",
            headers: {
                "X-SessionId": sessionId,
                "X-WxFrom": 1
            },
            data: {
                mobile: $(".input3").val(),
                type: "verifyUser"
            },
            success: function (data) {
                console.log(data)
                if (data.code == 200)
                    alert('验证码已发送，请注意查收')
                settime();
            },
            error: function (err) {
                console.log(err);
            }
        })
    })


    // 实名认证
    $('.attestation-btn').click(function () {
        function isChinaName(name) {
            var pattern = /^([\u4e00-\u9fa5]+|[\sa-zA-z]+)$/;
            return pattern.test(name);
        }

        function isPhoneNo(phone) {
            var pattern = /^1[34578]\d{9}$/;
            return pattern.test(phone);
        }

        function isdate(date) {
            var pattern = /^2/;
            return pattern.test(date);
        }
        if ($.trim($(".input1").val()).length == 0) {
            $('.show .error').html('姓名不能为空！')
            $('.show').css("display", 'block')
            return false;
        } else if (isChinaName($.trim($(".input1").val())) == false) {
            $('.show .error').html('姓名格式错误，请重新填写!')
            $('.show').css("display", 'block')
            return false;
        } else if (isChinaName($.trim($(".input1").val())) == true) {
            $('.show').css("display", 'none')
        }

        if ($.trim($(".input2").val()).length == 0) {
            $(' .show1 >.error').html('证件号码不能为空！')
            $('.show1').css("display", 'block')
            return false;
        }
        if ($.trim($(".input2").val()).length != 0) {
            $('.show1').css("display", 'none')
        }

        if ($.trim($(".input3").val()).length == 0) {
            $('.show2 .error').html('手机号码不能为空！')
            $('.show2').css("display", 'block')
            return false;
        } else if (isPhoneNo($.trim($(".input3").val())) == false) {
            $('.show2 .error').html('手机号码格式错误，请重新填写')
            $('.show2').css("display", 'block')
            // message += "证件号码不能为空哦！";
            return false;
        } else if (isPhoneNo($.trim($(".input3").val())) == true) {
            $('.show2').css("display", 'none')
            // message += "证件号码不能为空哦！";
        }
        if ($.trim($(".input4").val()).length == 0) {
            $('.show3>.error').html('验证码不能为空！')
            $('.show3').css("display", 'block')
            return false;
        }
        $.ajax({
            type: "post",
            url: "https://wechat.jinhui120.com/demo/api/ucenter/verifyUser",
            // contentType: "x-www-form-urlencoded",
            headers: {
                "X-SessionId": sessionId,
                "X-WxFrom": 1
            },
            data: {
                mobile: $(".input3").val(),
                realName: $(".input1").val(),
                idType: certType,
                idNumber: $(".input2").val(),
                vcode: $(".input4").val(),
                type: "verifyUser"
            },
            success: function (data) {
                console.log(data)
                if(window.sessionStorage.getItem("page")==3){
                    window.location.href = 'https://wechat.jinhui120.com/demo/activate.html'
                }
                if(window.sessionStorage.getItem("page")==1){
                    window.location.href = 'https://wechat.jinhui120.com/demo/purchase.html'
                }
                if(window.sessionStorage.getItem("page")==2){
                    window.location.href = 'https://wechat.jinhui120.com/demo/myequities.html'
                }
                if (data.code == 101) {
                    $('.show1 .error').html('证件号码错误，请重新填写')
                    $('.show1').css("display", 'block')
                }
                if (data.code == 102) {
                    $('.show3 .error').html('验证码错误，请重新填写')
                    $('.show3').css("display", 'block')
                }

            },
            error: function (err) {
                console.log(err);
            }
        })
    })
})