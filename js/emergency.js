$(function() {
  // window.sessionStorage.removeItem('anaphylaxis')
  // window.sessionStorage.removeItem('familyHistory')
  // window.sessionStorage.removeItem('drugUse')
  var sex = "";
  var mobileSelect1 = new MobileSelect({
    trigger: "#trigger1",
    title: "选择证件类型",
    wheels: [
      {
        data: [
          {
            id: "1",
            value: "男"
          },
          {
            id: "2",
            value: "女"
          }
        ]
      }
    ],
    //初始化定位
    callback: function(indexArr, data) {
      sex = data[0].id; //返回选中的json数据
    }
  });

  var blood = "";
  var mobileSelect2 = new MobileSelect({
    trigger: "#trigger2",
    title: "选择证件类型",
    wheels: [
      {
        data: [
          {
            id: "A",
            value: "A型"
          },
          {
            id: "B",
            value: "B型"
          },
          {
            id: "O",
            value: "O型"
          },
          {
            id: "AB",
            value: "AB型"
          }
        ]
      }
    ],
    //初始化定位
    callback: function(indexArr, data) {
      blood = data[0].id; //返回选中的json数据
    }
  });

  var mess = JSON.parse(window.sessionStorage.getItem("data"));
  console.log(mess
)
  window.sessionStorage.setItem("userid", mess.id);
  var html = "";
  var cert = "";
  if (mess.idType == 0) cert = "身份证";
  if (mess.idType == 1) cert = "台胞证";
  if (mess.idType == 2) cert = "回乡证";
  if (mess.idType == 3) cert = "护照";
  html +=
    '<span class="realname" style="font-size:16px;width:20%;text-align:left">' +
    mess.realName +
    "</span>" +
    '<span class="certificate cart" style="font-size:13px">' +
    cert +
    "</span>" +
    '<span class="idNumber" style="font-size:16px">' +
    mess.idNumber +
    "</span>";

  $(".info").html(html);
  var gendersex = "";
  var bloods = "";
  if (mess.blood == "A") bloods = "A型";
  if (mess.blood == "B") bloods = "B型";
  if (mess.blood == "O") bloods = "O型";
  if (mess.blood == "AB") bloods = "AB型";
  if (mess.blood == "") bloods = "请输入您的血型";

  if (bloods == "A型") blood = "A";
  if (bloods == "B型") blood = "B";
  if (bloods == "O型") blood = "O";
  if (bloods == "AB型") blood = "AB";
  $(".name").val(mess.emergencyContact);
  $(".phone").val(mess.emergencyPhone);
  if (mess.gender == 1) gendersex = "男";
  if (mess.gender == 2) gendersex = "女";
  if (mess.gender == 0) gendersex = "请输入您的性别";
  if (gendersex == "男") sex = 1;
  if (gendersex == "女") sex = 2;
  $("#trigger1").html(gendersex);
  $("#trigger2").html(bloods);
  $(".height").val(mess.height);
  $(".weight").val(mess.weight);
  var tempAnaphylaxi = "";
  var hasTempAnaphylaxi = false;
  if (window.sessionStorage.getItem("anaphylaxis")) {
    tempAnaphylaxi = JSON.parse(window.sessionStorage.getItem("anaphylaxis"));
    if (tempAnaphylaxi.id == mess.id) {
      hasTempAnaphylaxi = true;
      updateData();
      if (tempAnaphylaxi.nav) {
        $(".write0").text("已填写");
      } else {
        $(".write0").text("");
      }
    } else {
      $(".write0").text("");
      tempAnaphylaxi = undefined;
      window.sessionStorage.removeItem("anaphylaxis");
    }
  }
  if (!hasTempAnaphylaxi) {
    if (mess.anaphylaxis) {
      $(".write0").text("已填写");
    } else {
      $(".write0").text("");
    }
  }
  var tempdrug = "";
  var hasTempdrug = false;
  if (window.sessionStorage.getItem("drug")) {
    tempdrug = JSON.parse(window.sessionStorage.getItem("drug"));
    if (tempdrug.id == mess.id) {
      hasTempdrug = true;
      updateData();
      if (tempdrug.nav) {
        $(".write2").text("已填写");
      } else {
        $(".write2").text("");
      }
    } else {
      $(".write2").text("");
      tempdrug = undefined;
      window.sessionStorage.removeItem("drug");
    }
  }
  if (!hasTempdrug) {
    if (mess.drugUse) {
      $(".write2").text("已填写");
    } else {
      $(".write2").text("");
    }
  }

  var tempfamliy = "";
  var hasTempfamliy = false;
  if (window.sessionStorage.getItem("family")) {
    tempfamliy = JSON.parse(window.sessionStorage.getItem("family"));
    if (tempfamliy.id == mess.id) {
      updateData();
      if (tempfamliy) {
        $(".write1").text("已填写");
      } else {
        $(".write1").text("");
      }
      hasTempfamliy = true;
    } else {
      $(".write1").text("");
      tempfamliy = undefined;
      window.sessionStorage.removeItem("family");
    }
  }
  if (!hasTempfamliy) {
    if (mess.familyHistory) {
      $(".write1").text("已填写");
    } else {
      $(".write1").text("");
    }
  }
  function updateData() {
    var data = JSON.parse(window.sessionStorage.getItem("data"));
    data.emergencyContact = $(".name").val();
    data.emergencyPhone = $(".phone").val();
    data.height = $(".height").val();
    data.weight = $(".weight").val();
    if (tempfamliy) data.familyHistory = tempfamliy.nav;
    if (tempAnaphylaxi) data.anaphylaxis = tempAnaphylaxi.nav;
    if (tempdrug) data.drugUse = tempdrug.nav;
    data.gender = sex;
    data.blood = blood;
    window.sessionStorage.setItem("data", JSON.stringify(data));
  }

  $(".anaphylaxis").click(function() {
    updateData();
    window.location.href = "https://wechat.jinhui120.com/demo/anaphylaxis.html";
  });

  $(".familyhistory").click(function() {
    updateData();
    window.location.href =
      "https://wechat.jinhui120.com/demo/familyhistory.html";
  });

  $(".druguse").click(function() {
    updateData();
    window.location.href = "https://wechat.jinhui120.com/demo/druguse.html";
  });

  $(".next-btn").click(function() {
    $.ajax({
      type: "post",
      url: "https://wechat.jinhui120.com/demo/api/ucenter/updateUser",
      datatype: "json",
      data: {
        id: window.sessionStorage.getItem("userid"),
        gender: sex,
        height: $(".height").val(),
        weight: $(".weight").val(),
        blood: blood,
        emergencyContact: $(".name").val(),
        emergencyPhone: $(".phone").val(),
        familyHistory: tempfamliy.nav,
        anaphylaxis: tempAnaphylaxi.nav,
        drugUse: tempdrug.nav
      },

      headers: {
        "X-WxFrom": 1,
        "X-SessionId": window.sessionStorage.getItem("sessionId")
      },
      success: function(data) {
        if (data.code == 200) {
          window.location.href =
            "https://wechat.jinhui120.com/demo/purchase.html";
        }
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
});
