class game{
    constructor(){
        this.row = 19;
        this.col = 19;
        this.arr = [];
        this.khaiBaoArr();
        this.veBanCo();
        this.EmptyArr();
        this.luot = null;
        this.value_Nguoi = null;
    }
    khaiBaoArr(){
        for (let i = 0; i < this.row; i++){
            var ar =[];
            for (let j = 0; j < this.col; j++){
                ar.push(0);
            }
            this.arr.push(ar);
        }
    }
    EmptyArr(){
        for (let i = 0; i < this.row; i++){
            for (let j = 0; j < this.col; j++){
                this.arr[i][j] = 0;
            }
        }
    }
    veBanCo(){

        for(let i = 0; i < this.row; i++){
            var tr = document.createElement("tr");
            for (let j = 0; j < this.col; j++){
                var td = document.createElement("td");
                td.setAttribute("id",i.toString() + j.toString());
                td.addEventListener("click",()=>{
                    if (this.luot == true && soNguoiSS == 2){
                        if ( this.arr[i][j] != 0){
                            alert("Ô này đã được đánh rồi");
                        }
                        else{
                            // this.arr[i][j] = this.value_Nguoi;
                            // this.valueOBanCo();
                            // this.luot++;
                            // setTimeout(() => {
                            //     this.checkWinGame(i,j);
                            // }, 300);
                            
                            var a = {
                                value: this.value_Nguoi,
                                i: i,
                                j: j
                            };
                            socket.emit("user-danh-co",a);

                        }
                    }
                })
                tr.appendChild(td);
            }
            document.getElementById("banCo").appendChild(tr);
        }
    }
    valueOBanCo(){
        var i1 =0;
        for (let i = 0; i < this.row; i++){
            for (let j = 0; j < this.col; j++){
                if (this.arr[i][j] != 0){
                    i1 =1;
                    if (this.arr[i][j] == 1){
                        document.getElementById(i.toString() + j.toString()).innerText ="X";
                        document.getElementById(i.toString() + j.toString()).style.color ="red";
                    }
                    else{
                        document.getElementById(i.toString() + j.toString()).innerText ="O";
                        document.getElementById(i.toString() + j.toString()).style.color ="blue";
                    }
                }
            }
        }
        return i1;
    }
    checkWinGame(i,j){
        if (this.checkDoc(i,j) >= 5 || this.checkNgang(i,j) >= 5 || this.checkCheoPhai(i,j) >= 5 || this.checkCheoTrai(i,j) >= 5){
            if(this.luot == false){
                socket.emit("Win-game",this.value_Nguoi);
            }
        }
    }

    checkDoc(i,j){
        var count =1;
        var val = this.arr[i][j];
        var i1 = i +1;
        if (i1 < this.row){
            while (this.arr[i1][j] == val){
                count ++;
                i1++;
                if (i1 >= this.row) break;
            }
        }
        i1 = i -1;
        if (i1 >= 0){
            while (this.arr[i1][j] == val){
                count ++;
                i1--;
                if (i1 < 0) break;
            }
        }
        
        return count;
    }

    checkNgang(i,j){
        var count =1;
        var val = this.arr[i][j];
        var j1 = j +1;
        if (j1 < this.col){
            while (this.arr[i][j1] == val ){
                count ++;
                j1++;
                if (j1 >= this.col) break;
            }
        }
        j1 = j -1;
        if (j1 >= 0){
            while (this.arr[i][j1] == val){
                count ++;
                j1--;
                if (j1 < 0) break;
            }
        }

        return count;
    }

    checkCheoTrai(i,j){
        var count =1;
        var val = this.arr[i][j];
        var i1 = i +1;
        var j1 = j +1;
        if (i1 < this.row && j1 < this.col){
            while (this.arr[i1][j1] == val){
                count ++;
                i1++;
                j1++;
                if (i1 >= this.row || j1 >= this.col) break;
            }
        }
        i1 = i -1;
        j1 = j -1;
        if (i1 >= 0 && j1 >=0){
            while (this.arr[i1][j1] == val){
                count ++;
                i1--;
                j1--;
                if (i1 < 0 || j1 < 0) break;
            }
        }

        return count;
    }

    checkCheoPhai(i,j){
        var count =1;
        var val = this.arr[i][j];
        var i1 = i -1;
        var j1 = j +1;
        if (i1 >=0 && j1 < this.col){
            while (this.arr[i1][j1] == val){
                count ++;
                i1--;
                j1++;
                if (i1 < 0 || j1 >= this.col) break;
            }
        }
        
        i1 = i +1;
        j1 = j -1;
        if ( i1 < this.row && j1 >=0){
            while (this.arr[i1][j1] == val){
                count ++;
                i1++;
                j1--;
                if (i1 >= this.row || j1 <0) break;
            }
        }
        return count;
    }
}
