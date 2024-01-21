const { Socket } = require("dgram");
var express = require("express");
const { emit } = require("process");
const { inflate } = require("zlib");
var app = express();
app.use(express.static("./public"));
app.set("view engine","ejs"); 
app.set("views","./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT ||3000);

app.get("/", function(req , res){
    res.render("trangchu");
});
var arrTK =[];
var arrUser =[];
var arrPhong = [];
var arrChatTong =[];

function kiemTraTonTaiPhong(tenPhong , socket){
    for (r of socket.adapter.rooms){
        if (r[0] == tenPhong){
            return true;
        }
    }
    return false;
}

function kiemTraSoNguoiTrongPhong(tenPhong, socket){
    for (r of socket.adapter.rooms){
        if (r[0] == tenPhong){
            return countProperties(r[1]);
        }
    }
    return 0;
}


function kiemTraArrPhongConTrong(){
    for (var i in arrPhong){
        if (arrPhong[i] == "0"){
            return i;
        }
    }
    return -1;
}

function soNguoiSanSangTrongPhong(socket,a){
    for (r of socket.adapter.rooms){
        if (r[0] == tenPhong){
            r.soNguoiSanSang += a;
        }
    }
}

function countProperties(obj) {
    var count = 0;

    for(var prop of obj) {
        ++count;
    }

    return count;
}

function guiMessageChatTong(socket){
    for (var i in arrChatTong){
        socket.emit("server-send-user-chat-tong",arrChatTong[i]);
    }
}

function sapXepGiamDanDiem(arrTK){
    for (var i = 0; i < arrTK.length ; i++){
        for (var j = i+1 ; j < arrTK.length ; j++){
            if (arrTK[i].soTranThang < arrTK[j].soTranThang){
                var temp = arrTK[i];
                arrTK[i] = arrTK[j];
                arrTK[j] = temp;
            }
        }
    }    
}

function tkCaNhan(socket,arrTK){
    for (var i =0;i < arrTK.length;i++){
        if (arrTK[i].tenUser == socket.userName){
            return arrTK[i];
        }
    }
}

io.on("connection", function(socket){
    socket.emit("gui-arr-user",arrUser);
    socket.emit("gui-arr-phong",arrPhong);
    socket.emit("gui-arr-top-server",arrTK);
    guiMessageChatTong(socket);
    console.log("co nguoi ket noi: " + socket.id);

    socket.on("disconnect", function(){
        if (arrUser.indexOf(socket.userName) >= 0)
            arrUser.pop(arrUser.indexOf(socket.userName),1);
        console.log(socket.id + " ngat ket noi");
        io.sockets.emit("gui-arr-user",arrUser);
        
        if (socket.soPhong == ""){
            if(!kiemTraTonTaiPhong(socket.soPhong , socket)){
                arrPhong[socket.soPhong] = "0";
                io.sockets.emit("gui-arr-phong",arrPhong);
            }
            var a = "Người chơi "+socket.userName +" đã rời phòng";
            io.sockets.in(socket.soPhong).emit("server-send-server-chat-room",a);
            io.sockets.emit("1-nguoi-vao-phong",socket.soPhong);
            if (socket.tranDau == 1){
                socket.tranDau =0;
                socket.broadcast.to(socket.soPhong).emit("nguoi-choi-bo-tran");
            }
            socket.soPhong = "";
        }
        if (socket.userName != ""){
            arrUser.pop(socket.userName);
            socket.userName = "";
        }
    }); 
    
    socket.on("user-login",function(data){
        var a =0;
        for (var i in arrTK){
            if (arrTK[i].tk == data.tk){
                if(arrTK[i].mk == data.mk){
                    a =1;
                    if(arrUser.indexOf(arrTK[i].tenUser) != -1){
                        socket.emit("tai-khoan-dang-dang-nhap");
                    }
                    else{
                        arrUser.push(arrTK[i].tenUser);
                        socket.userName = arrTK[i].tenUser;
                        socket.emit("login-thanh-cong",arrTK[i].tenUser);
                        var a = tkCaNhan(socket,arrTK);
                        var b = {
                            top : arrTK.indexOf(a),
                            tenUser : a.tenUser,
                            soTranThang : a.soTranThang
                        }
                        socket.emit("gui-top-ca-nhan",b);
                    }
                }
            }
        }
        if (a==0){
            socket.emit("login-that-bai");
        }
        io.sockets.emit("gui-arr-user",arrUser);
    });

    socket.on("dang-ky-tai-khoan",function(data){
        var a=0;

        if (data.mk != data.remk){
            socket.emit("rePassWord-sai");
        }

        for (var i in arrTK){
            if (arrTK[i].tk == data.tk){
                a = 1;
                socket.emit("tai-khoan-da-ton-tai");
            }
            if (arrTK[i].tenUser == data.tenUser){
                a = 1;
                socket.emit("tenUser-da-ton-tai");
            }
        }
        
        if (a==0){
            var b = {
                tk : data.tk,
                mk : data.mk,
                tenUser : data.tenUser,
                soTranThang: 0
            };
            arrTK.push(b);
            socket.emit("dang-ky-thanh-cong");
        }
    });

    socket.on("user-logout",function(){
        if (arrUser.indexOf(socket.userName) >= 0)
            arrUser.pop(arrUser.indexOf(socket.userName),1);
        socket.leave(socket.soPhong);
        
        if (socket.soPhong == ""){
            if(!kiemTraTonTaiPhong(socket.soPhong , socket)){
                arrPhong[socket.soPhong] = "0";
                io.sockets.emit("gui-arr-phong",arrPhong);
            }
            var a = "Người chơi "+socket.userName +" đã rời phòng";
            io.sockets.in(socket.soPhong).emit("server-send-server-chat-room",a);
            io.sockets.emit("1-nguoi-vao-phong",socket.soPhong);
            if (socket.tranDau == 1){
                socket.tranDau =0;
                socket.broadcast.to(socket.soPhong).emit("nguoi-choi-bo-tran");
            }
            socket.soPhong = "";
        }
        arrUser.pop(socket.userName);
        socket.userName = "";
        
        io.sockets.emit("gui-arr-user",arrUser);
        socket.emit("user-roi-phong-thanh-cong");
    });

    socket.on("user-tao-phong",function(data){
        if (data == ""){
            socket.emit("server-send-user-tao-phong-that-bai");
        }
        else {
            var q = kiemTraArrPhongConTrong();
            if (q != -1){
                arrPhong[q] = data;
            }
            else arrPhong.push(data);
            var a ={
                soPhong : arrPhong.indexOf(data),
                tenPhong : data
            };
            socket.soPhong = a.soPhong;
            socket.join(a.soPhong);
            socket.emit("server-send-tao-phong-TC");
            io.sockets.emit("server-send-user-tao-phong",a);
        }
    });

    socket.on("user-roi-phong",function(){
        socket.leave(socket.soPhong);
        var a = "Người chơi "+socket.userName +" đã rời phòng";
        io.sockets.in(socket.soPhong).emit("server-send-server-chat-room",a);
        if (socket.tranDau == 1){
            socket.tranDau =0;
            socket.broadcast.to(socket.soPhong).emit("nguoi-choi-bo-tran");
        }
        if(!kiemTraTonTaiPhong(socket.soPhong , socket)){
            arrPhong[socket.soPhong] = "0";
            io.sockets.emit("gui-arr-phong",arrPhong);
        }
        io.sockets.emit("1-nguoi-vao-phong",socket.soPhong);
        socket.soPhong = "";
        socket.emit("user-roi-phong-thanh-cong");
    });

    socket.on("user-vao-phong",function(data){
        socket.join(data-1);
        socket.soPhong = data-1;
        socket.emit("user-vao-phong-thanh-cong");
        io.sockets.emit("2-nguoi-vao-phong",data);
        var a = "Người chơi "+socket.userName +" đã vào phòng";
        io.sockets.in(socket.soPhong).emit("server-send-server-chat-room",a);
        io.sockets.in(socket.soPhong).emit("reset-bt-san-sang");
    });

    socket.on("user-danh-co",function(a){
        io.sockets.in(socket.soPhong).emit("server-send-user-danh-co",a);
    });

    socket.on("so-nguoi-trong-phong",function(data){
        var a= {
            soPhong : data,
            soNguoi : kiemTraSoNguoiTrongPhong(data,socket)
        }
        socket.emit("server-send-so-nguoi-trong-phong",a);
    });

    socket.on("user-chat-room",function(data){
        data = socket.userName +" : "+data;
        io.sockets.in(socket.soPhong).emit("server-send-user-chat-room",data);
    });

    socket.on("user-san-sang",function(){
        io.sockets.in(socket.soPhong).emit("user-kia-da-san-sang");
        socket.emit("user-san-sang");
    });

    socket.on("user-huy-san-sang",function(){
        io.sockets.in(socket.soPhong).emit("user-kia-da-huy-san-sang");
        socket.emit("user-huy-san-sang");
    });

    socket.on("user-chat-tong",function(data){
        var a = socket.userName + ": " +data;
        arrChatTong.push(a);
        io.sockets.emit("server-send-user-chat-tong",a);
    });

    socket.on("Win-game",function(data){
        io.sockets.in(socket.soPhong).emit("Nguoi-Win",data);
    });

    socket.on("tui-la-nguoi-win",function(){
        for (var i in arrTK){
            if (arrTK[i].tenUser == socket.userName){
                arrTK[i].soTranThang ++;
                sapXepGiamDanDiem(arrTK);
                io.sockets.emit("gui-arr-top-server",arrTK);
                var a = tkCaNhan(socket,arrTK);
                var b = {
                    top : arrTK.indexOf(a),
                    tenUser : a.tenUser,
                    soTranThang : a.soTranThang
                }
                socket.emit("gui-top-ca-nhan",b);
                break;
            }
        }
    });

    socket.on("tran-dau-dang-bat-dau",function(){
        socket.tranDau =1;
    });

    socket.on("reset-phong",function(data){
        io.sockets.in(socket.soPhong).emit("reset-phong",data);
    });

    socket.on("Hien-Win",function(){
        socket.emit("Hien-Win");
    });

});

