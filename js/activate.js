$(function(){
    $('#clause').click(function(){
        $('.warp').css('display','block')
    })
    $('.close').click(function(){
        $('.warp').css('display','none')
    })

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      }
    var url = location.href;
    var sessionId  = GetQueryString("sessionId");
    
    if (sessionId  ==null) {
        window.sessionStorage.setItem("sessionId", "");
      } else {
        window.sessionStorage.setItem("sessionId", sessionId);
      }

      if (window.sessionStorage.getItem("sessionId")) {
          console.log(sessionId )
          $.ajax({
            type: "get",
            url: "https://wechat.jinhui120.com/demo/api/ucenter/getCurrentUser",
            datatype: "json",
            contentType: "application/json",
            headers:{
                "X-WxFrom":1,
                "X-SessionId":sessionId
            },
            success: function (data) {
                console.log(data)
                if(data.payload===null||data.payload.verified==false){
                    window.sessionStorage.setItem("page", 3)
                    window.location.href='https://wechat.jinhui120.com/demo/attestation.html'
                }

            },
            error: function (err) {
                console.log(err);
            }
        })


        // 判断单人卡或者多人卡
        $('.attestation-btn').click(function(){
            $('.waiting-nv').css('display','block')
         if($.trim($(".name-input").val())==''){
            $('.show').css("display",'block');
            return;

            }   //这里是空的时候进第一个判断
        else{
            $('.show').css("display",'none');
        }
            if ($.trim($(".password").val()).length == 0) {
                // $('.show .error').html('姓名不能为空！')
                $('.show1').css("display",'block')
            }
            else{
                $('.show1').css("display",'none')
              }
            if (!$(".checkbox").is(":checked")) {
                $('.error-mess').css("display",'block')
                $(".attestation-btn").disabled = "disabled";
                return;
              }
              else{
                $('.error-mess').css("display",'none')
              }
            $.ajax({
                type: "post",
                url: "https://wechat.jinhui120.com/demo/api/card/getLegacy",
                headers:{
                    "X-WxFrom":1,
                    "X-SessionId":sessionId
                },
                data:{
                    number:$('.name-input').val(),
                    password:$('.password').val(),
                },
                success: function (data) {
                    console.log(data)
                    
                    
                    if(data.code==200){
                        $('.waiting-nv').css('display','none')
                    }
                    if(data.payload===null){
                        $('.show1 >.error').html('卡号或者密码错误！')
                        $('.show1').css("display",'block')
                    }
                    if(data.payload.active==true){
                        alert('该卡号已经被激活过！')
                        return;
                    }
                    if(data.payload.rightNum==1){
                        var cardId = data.payload.id
                        var pkgCode = data.payload.pkgCode
                        window.sessionStorage.setItem('cardId',cardId)
                        window.sessionStorage.setItem('pkgCode',pkgCode)
                        window.location.href='https://wechat.jinhui120.com/demo/singlecard.html'
                    }
                    if(data.payload.rightNum>1){
                        var cardId = data.payload.id
                        var pkgCode = data.payload.pkgCode
                        var rightNum = data.payload.rightNum
                        window.sessionStorage.setItem('cardId',cardId)
                        window.sessionStorage.setItem('pkgCode',pkgCode)
                        window.sessionStorage.setItem('rightNum',rightNum)
                        window.location.href='https://wechat.jinhui120.com/demo/multiplayer.html'
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            })
        })
    
      } 
      else{
            $('body').css('display','none')
            window.location.href =
            "https://wechat.jinhui120.com/demo/api/ucenter/fuwuLogin?state=https://wechat.jinhui120.com/demo/activate.html";
        
           
        
      }
})