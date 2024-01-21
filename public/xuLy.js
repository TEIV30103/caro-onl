var socket = io("https://cr-onl-pqv-20197430c0c5.herokuapp.com/");

var dangNhap =0;
var g;
var soNguoiSS =0;
var value;

var batChatTong = false;

socket.on("login-thanh-cong",function(data){
    dangNhap =1;
    $("#ngoaiPhong").show(1000);
    $("#vaoPhong").hide(2000);
    $("#dangNhap").hide(2000);
    $("#txtXinChao").html("Xin Chào "+data);
    $("#btDangNhap").hide();
    $("#btDangXuat").show();
});

socket.on("login-that-bai",function(){
    alert("Đăng Nhập Thất Bại");
});

socket.on("tai-khoan-dang-dang-nhap",function(){
    alert("Tài Khoản Đã Được Đăng Nhập Ở 1 Nơi Khác");
});

socket.on("rePassWord-sai",function(){
    $("#loi-repassword").html("Mật Khẩu không giống");
});

socket.on("tai-khoan-da-ton-tai",function(){
    $("#loi-ten-tk").html("Tên Tài Khoản Đã Tồn Tại");
});

socket.on("tenUser-da-ton-tai",function(){
    $("#loi-ten-user").html("Tên User Đã Tồn Tại");
});

socket.on("dang-ky-thanh-cong",function(){
    $("#loi-repassword").html("");
    $("#loi-ten-tk").html("");
    $("#loi-ten-user").html("");
    $("#txtDK").hide(2000);
    $("#btXN").show(1000);
    $("#btXNDK").hide(2000);
    $("#btDK").show(1000);
});

socket.on("gui-arr-user",function(data){
    $("#valueUserOnline").html("");
    data.forEach(element => {
        $("#valueUserOnline").append("<div class='userOnline'>"+element+"</div>")
    });
});

socket.on("server-send-user-tao-phong",function(data){
    var j = Number(data.soPhong) +1;
    $("#danhSachPhong").append("<p class='phong' id='phong"+j+"'><span class='stt'>"+j+"</span>  <span class='tenPhong'>"+data.tenPhong+"</span>  <span class='theLoaiPhong'>Chơi với Người</span>  <span class='soNguoiHienCo' id='soNguoivaoPhong"+j+"'>1</span><span class='soNguoiToiDa'>/2</span> <input type='button' name='' class='btVaoPhong' id='vaoPhong"+j+"' value='Vào Phòng'></p>");
    var a = "#vaoPhong"+j;
    $(a).click(function(){
        if (dangNhap == 1){
            socket.emit("user-vao-phong",j);
        }
        else{

            $("#ngoaiPhong").hide(2000);
            $("#dangNhap").show(1000);
        }
    });
    var b="#phong"+j;
    $(b).hide();
    $(b).show(1500);

});

socket.on("server-send-user-tao-phong-that-bai",function(){
    alert("Vui Lòng Nhập Tên Phòng");
});

socket.on("gui-arr-phong",function(data){
    $("#danhSachPhong").html("<p>Danh Sách Phòng Hiện Có</p>");
    $("#danhSachPhong").append();
    for (var i in data){
        if (data[i] != "0"){
            var j = Number(i) +1;
            $("#danhSachPhong").append("<p class='phong'><span class='stt'>"+j+"</span>  <span class='tenPhong'>"+data[i]+"</span>  <span class='theLoaiPhong'>Chơi với Người</span>  <span class='soNguoiHienCo' id='soNguoivaoPhong"+j+"'>1</span><span class='soNguoiToiDa'>/2</span> <input type='button' name='' class='btVaoPhong' id='vaoPhong"+j+"' value='Vào Phòng'></p>");
            var a = "#vaoPhong"+j;
            $(a).click(function(){
                if (dangNhap == 1){
                    socket.emit("user-vao-phong",j);
                }
                else{

                    $("#ngoaiPhong").hide(2000);
                    $("#dangNhap").show(1000);
                }
            });
            socket.emit("so-nguoi-trong-phong",i);
        }
    }
});

socket.on("user-roi-phong-thanh-cong",function(){
    $("#ngoaiPhong").show(1000);
    $("#vaoPhong").hide(2000);
    $("#dangNhap").hide();
    $("#valueUserOnline").hide();
    $("#nhapThongTinTaoPhong").hide();
    $("#txtDK").hide();
    $("#btXNDK").hide();
    $("#aiWin").hide();
    $("#topBanThan").html("");
    $("#txtTopCaNhan").html("");
    $("#soTranThangTopCaNhan").html("");
});

socket.on("user-vao-phong-thanh-cong",function(){
    $("#ngoaiPhong").hide(2000);
    $("#banCo").html("");
    $("#list-message-room").html("");
    g = new game();
    g.value_Nguoi =2;
    value =2;
    g.luot=false;
    g.EmptyArr();
    g.valueOBanCo();
    $("#vaoPhong").show(1000);
    $("#btHuy").hide();
    $("#btSanSang").show();
    soNguoiSS =0;
});

socket.on("2-nguoi-vao-phong",function(data){
    var a = "#soNguoivaoPhong"+data;
    $(a).html("2");
    var b = "#vaoPhong"+data;
    document.querySelector(b).style.pointerEvents = "none";
    document.querySelector(b).value = "Phòng Đầy";
});

socket.on("1-nguoi-vao-phong",function(data){
    data = Number(data)+1;
    var a = "#soNguoivaoPhong"+data;
    $(a).html("1");
    var b = "#vaoPhong"+data;
    document.querySelector(b).style.pointerEvents = "auto";
    document.querySelector(b).value = "Vào Phòng";
});

socket.on("server-send-user-danh-co",function(data){
    g.arr[data.i][data.j] = data.value;
    g.valueOBanCo();
    g.luot= !g.luot;
    setTimeout(()=>{
        g.checkWinGame(data.i,data.j);
    },300);
    if (g.luot){
        $("#luot").html("Lượt Của Bạn");
    } 
    else $("#luot").html("Lượt Của Đối Thủ");
});

socket.on("server-send-so-nguoi-trong-phong",function(data){
    data.soPhong = Number(data.soPhong) +1;
    var a = "#soNguoivaoPhong"+data.soPhong;
    console.log(a , data.soNguoi );
    $(a).html(data.soNguoi);
});

socket.on("server-send-tao-phong-TC",function(){
    $("#nhapThongTinTaoPhong").hide(1000);
    $("#txtTenPhong").val("");
    $("#ngoaiPhong").hide(2000);
    $("#banCo").html("");
    $("#list-message-room").html("");
    g = new game();
    g.value_Nguoi =1;
    value =1;
    g.luot = true;
    g.EmptyArr();
    g.valueOBanCo();
    $("#vaoPhong").show(1000);
    $("#btHuy").hide();
    $("#btSanSang").show();
});

socket.on("server-send-user-chat-room",function(data){
    $("#list-message-room").append("<span class='messageRoom'>"+data+"</span><br>");
});

socket.on("server-send-server-chat-room",function(data){
    $("#list-message-room").append("<span class='messageServerSendRoom'>"+data+"</span><br>");
});

socket.on("user-san-sang",function(){
    if (soNguoiSS == 1){
        $("#luot").html("Đợi Đối Thủ Sẵn Sàng");
    }
});

socket.on("user-huy-san-sang",function(){
    if (soNguoiSS == 1){
        $("#luot").html("Đối Thủ Đang Đợi Bạn");
    }
});

socket.on("user-kia-da-san-sang",function(){
    soNguoiSS++;
    if (soNguoiSS ==1)
        $("#luot").html("Đối Thủ Đang Đợi Bạn");
    else{
        $("#list-message-room").append("<span class='messageServerSendRoom'>Trận Đấu Bắt Đầu</span><br>");
        $("#btHuy").hide(2000);
        console.log(g.luot , g.value_Nguoi);

        if (g.luot){
            $("#luot").html("Lượt Của Bạn");
        } 
        else $("#luot").html("Lượt Của Đối Thủ");
        socket.emit("tran-dau-dang-bat-dau");
    }
});

socket.on("user-kia-da-huy-san-sang",function(){
    soNguoiSS--;
    $("#luot").html("Đợi Đối Thủ Sẵn Sàng");
});

socket.on("reset-bt-san-sang",function(){
    soNguoiSS =0;
    $("#btHuy").hide();
    $("#btSanSang").show();
    $("#luot").html("");
});

socket.on("reset-phong",function(data){
    $("#banCo").html("");
    g = new game();
    g.EmptyArr();
    g.valueOBanCo();
    $("#vaoPhong").show(1000);
    $("#btHuy").hide();
    $("#btSanSang").show();
    $("#luot").html("");
    soNguoiSS =0;

    
    if (data == "1"){
        value =1;
        g.value_Nguoi =1;
        g.luot = true;
    }
    else{
        g.value_Nguoi = value;
        if (value == "1"){
            g.luot = true;
        }
        else g.luot = false;
    }
});

socket.on("server-send-user-chat-tong",function(data){
    $("#chatTong").append("<span class='messageChatTong'>"+data+"</span><br>")
});

socket.on("Nguoi-Win",function(data){
    if(g.value_Nguoi == data){
        socket.emit("tui-la-nguoi-win");
    }
    var a;
    if (data == "1"){
        a ="X";
    }
    else a="O";
    $("#aiWin").html(a +" WIN");
    $("#aiWin").show(1000);
    
    // reset Phong
    setTimeout(()=>{
        $("#aiWin").hide(1000);
        setTimeout(()=>{
            socket.emit("reset-phong");
        },1000);
    },5000);
});

socket.on("Hien-Win",function(){
    var a;
    if (g.value_Nguoi == "1"){
        a ="X";
    }
    else a="O";
    $("#aiWin").html(a +" WIN");
    $("#aiWin").show(1000);
    
    // reset Phong
    setTimeout(()=>{
        $("#aiWin").hide(1000);
        setTimeout(()=>{
            socket.emit("reset-phong","1");
            g.value_Nguoi =1;
            value =1;
            g.luot = true;
        },1000);
    },5000);
});


socket.on("nguoi-choi-bo-tran",function(){
    socket.emit("Hien-Win");
    socket.emit("tui-la-nguoi-win");
});

socket.on("gui-arr-top-server",function(data){
    for (var i=0;i<5 && i < data.length;i++){
        if (data[i].soTranThang != 0){
            var j=i+1;
            var a = "#txtTop"+j;
            var b = "#soTranThangTop"+j;
            $(a).html(data[i].tenUser);
            $(b).html("( "+data[i].soTranThang + " trận thắng )");
        }
    }
});

socket.on("gui-top-ca-nhan",function(data){
    data.top++;
    if (data.soTranThang == 0) $("#topBanThan").html("...");
    else $("#topBanThan").html("top : "+ data.top);
    $("#txtTopCaNhan").html(data.tenUser);
    $("#soTranThangTopCaNhan").html("( "+data.soTranThang + " trận thắng )");
}); 













$(document).ready(function(){
    $("#ngoaiPhong").show();
    $("#vaoPhong").hide();
    $("#dangNhap").hide();
    $("#btDangXuat").hide();
    $("#valueUserOnline").hide();
    $("#nhapThongTinTaoPhong").hide();
    $("#txtDK").hide();
    $("#btXNDK").hide();
    $("#aiWin").hide();

    $("#btDangNhap").click(function(){
        $("#ngoaiPhong").hide(2000);
        $("#vaoPhong").hide(2000);
        $("#dangNhap").show(1000);
        $("#txtDK").hide(2000);
        $("#btXN").show(1000);
        $("#btXNDK").hide(2000);
        $("#btDK").show(1000);
        $("#loi-repassword").html("");
        $("#loi-ten-tk").html("");
        $("#loi-ten-user").html("");
    });

    $("#btXN").click(function(){
        var a={
            tk: $("#txtTaiKhoan").val(),
            mk: $("#txtPassWord").val()
        }
        var b =0;
        if(a.tk.trim() == ""){
            b =1;
            $("#loi-ten-tk").html("Vui Lòng Nhập Tài Khoản");
        }
        if(a.mk.trim() == ""){
            b=1;
            $("#loi-password").html("Vui Lòng Nhập Mật Khẩu");
        }
        if(b==0) {
            $("#loi-password").html("");
            $("#loi-ten-tk").html("");
            socket.emit("user-login",a);    
        }
    });

    $("#btDangXuat").click(function(){
        socket.emit("user-logout");
        dangNhap = 0;
        $("#txtXinChao").html("");
        $("#btDangNhap").show();
        $("#btDangXuat").hide();
        $("#nhapThongTinTaoPhong").hide(10);
    });

    $("#btBXH").click(function(){
        $("#valueBXH").show();
        $("#valueUserOnline").hide();
    });

    $("#btOnline").click(function(){
        $("#valueBXH").hide();
        $("#valueUserOnline").show();
    });

    $("#btTaoPhong").click(function(){
        if (dangNhap == 1){
            $("#nhapThongTinTaoPhong").show(1000);
        }
        else{
            $("#ngoaiPhong").hide(2000);
            $("#dangNhap").show(1000);
        }
    });  

    $("#btXNTaoPhong").click(function(){
        socket.emit("user-tao-phong",$("#txtTenPhong").val());
    });

    $("#btHTaoPhong").click(function(){
        $("#nhapThongTinTaoPhong").hide(1000);
        $("#txtTenPhong").val("");
    });
    
    $("#btRoiPhong").click(function(){
        socket.emit("user-roi-phong");
    });

    $("#btSendMessageRoom").click(function(){
        socket.emit("user-chat-room",$("#txtMessageRoom").val());
        $("#txtMessageRoom").val("");
    });

    $("#btSanSang").click(function(){
        socket.emit("user-san-sang");
        $("#btHuy").show(1000);
        $("#btSanSang").hide(2000);
    });

    $("#btHuy").click(function(){
        socket.emit("user-huy-san-sang");
        $("#btSanSang").show(1000);
        $("#btHuy").hide(2000);
    });

    $("#btChat").click(function(){
        if (batChatTong == false){
            document.getElementById("valueBXH").style.height = "0px";
            document.getElementById("valueUserOnline").style.height = "0px";
            document.getElementById("chatTong").style.height = "440px";
            document.getElementById("txtChatTong").style.height = "30px";
            document.getElementById("btGuiChatTong").style.height = "36px";
            document.getElementById("chatTong").style.display = "block";
            document.getElementById("txtChatTong").style.display = "block";
            document.getElementById("btGuiChatTong").style.display = "block";
            batChatTong = true;
        }
        else{
            document.getElementById("valueBXH").style.height = "470px";
            document.getElementById("valueUserOnline").style.height = "470px";
            document.getElementById("chatTong").style.height = "0px";
            document.getElementById("txtChatTong").style.height = "0px";
            document.getElementById("btGuiChatTong").style.height = "0px";
            document.getElementById("chatTong").style.display = "none";
            document.getElementById("txtChatTong").style.display = "none";
            document.getElementById("btGuiChatTong").style.display = "none";
            batChatTong = false;
        }
    });

    $("#btGuiChatTong").click(function(){
        if (dangNhap == 0){
            $("#ngoaiPhong").hide(2000);
            $("#vaoPhong").hide(2000);
            $("#dangNhap").show(1000);
        }
        else socket.emit("user-chat-tong",$("#txtChatTong").val());

        $("#txtChatTong").val("");
    });

    $("#btDK").click(function(){
        $("#btDK").hide();
        $("#txtDK").show(1000);
        $("#btXN").hide();
        $("#btXNDK").show();
        $("#loi-password").html("");
        $("#loi-repassword").html("");
        $("#loi-ten-tk").html("");
        $("#loi-ten-user").html("");
    }); 

    $("#btXNDK").click(function(){
        var a = {
            tk:$("#txtTaiKhoan").val(),
            mk:$("#txtPassWord").val(),
            remk:$("#txtRePassWord").val(),
            tenUser:$("#txtHoTen").val()
        };

        var b =0;
        if(a.tk.trim() == ""){
            b =1;
            $("#loi-ten-tk").html("Vui Lòng Nhập Tài Khoản");
        }
        if(a.mk.trim() == ""){
            b=1;
            $("#loi-password").html("Vui Lòng Nhập Mật Khẩu");
        }
        if(a.tenUser.trim() == ""){
            b =1;
            $("#loi-ten-user").html("Vui Lòng Nhập Tên User");
        }
        if(b==0){
            $("#loi-ten-tk").html("");
            $("#loi-password").html("");
            $("#loi-ten-user").html("");

            socket.emit("dang-ky-tai-khoan",a);
        }
    });

    $("#txtRePassWord").focusout(function(){
        if ($("#txtRePassWord").val() == $("#txtPassWord").val()){
            $("#loi-repassword").html("");
        }
        else{
            $("#loi-repassword").html("Mật Khẩu Không Giống");
        }
    });
});

