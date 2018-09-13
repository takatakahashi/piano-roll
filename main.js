function start(){
    let pContainer = document.getElementById("piano-container");
    let eContainer = document.getElementById("editor-container");
    //canvasの幅をdivの幅に揃える
    document.getElementById('piano').width = pContainer.clientWidth;

    //スクロールを合わせる
    pContainer.onscroll = function(){
        eContainer.scrollTop = this.scrollTop;
    };
    
    eContainer.onscroll = function(){
        pContainer.scrollTop = this.scrollTop;
    };

    menu = new Menu();
}

//Menuバーのイベントから他のクラスに処理を促すクラス
class Menu {
    constructor() {
        this.notesPerMeasure = 4;
        this.measureNum = 30;
        this.horizontalNum = this.measureNum * this.notesPerMeasure;
        this.verticalNum = 24;

        this.editor = new Editor(this.verticalNum, this.horizontalNum, this.measureNum);
        this.piano = new Piano();

    }
}


class Piano {
    constructor() {
        this.canvas = document.getElementById("piano");
        this.ctx = this.canvas.getContext("2d");
        this.areaWidth = this.canvas.clientWidth;
        this.areaHeight = this.canvas.clientHeight;

        this.draw();
    }

    draw() {
        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(0, 0, this.areaWidth, this.areaHeight);        
    }
}

//打ち込み画面を管理するクラス
class Editor {
    constructor(verticalNum, horizontalNum, measureNum){
        this.width = this.height = 1;
        this.verticalNum = verticalNum;
        this.horizontalNum = horizontalNum;
        this.measureNum = measureNum;

        this.score = new Score(this.horizontalNum, this.verticalNum);

        this.backGround = new BackGround(this.measureNum, this.verticalNum);

        this.draw();
    }

    draw() {
        this.backGround.draw(this.ctx);
        this.score.draw(this.ctx);
    }
}

//枠線などを描画するクラス
class BackGround {
    constructor(measureNum, vNum) {
        this.canvas = document.getElementById("background");
        this.ctx = this.canvas.getContext("2d");
        this.areaWidth = this.canvas.clientWidth;
        this.areaHeight = this.canvas.clientHeight;
        this.measureNum = measureNum;
        this.verticalNum = vNum;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.areaWidth, this.areaHeight);

        const cellWidth = this.areaWidth / this.measureNum;
        const cellHeight = this.areaHeight / this.verticalNum;
        this.ctx.strokeStyle = "black";

        for(let w = 0; w <= this.areaWidth; w += cellWidth){
            this.ctx.beginPath();
            this.ctx.moveTo(w, 0);
            this.ctx.lineTo(w, this.areaHeight);
            this.ctx.stroke();
        }
    
        for(let h = 0; h <= this.areaHeight; h += cellHeight){
            this.ctx.beginPath();
            this.ctx.moveTo(0, h);
            this.ctx.lineTo(this.areaWidth, h);
            this.ctx.stroke();
        }
    }
}

//打ち込まれた内部データを処理するクラス
class Score {
    constructor(horizontalNum, verticalNum) {
        this.canvas = document.getElementById("score");
        this.ctx = this.canvas.getContext("2d");
        this.horizontalNum = horizontalNum;
        this.verticalNum = verticalNum;
        this.areaWidth = this.canvas.clientWidth;
        this.areaHeight = this.canvas.clientHeight;
        this.cellWidth = this.areaWidth / this.horizontalNum;
        this.cellHeight = this.areaHeight / this.verticalNum;

        this.score = new Array();
        this.isClicked = false;
        this.isDragging = false;
        this.dragProperty = {
            start: null,
            end: null,
            lyric: "あ",
            pitch: null
        };

        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        this.draw();
    }   

    draw() {
        this.ctx.clearRect(0, 0, this.areaWidth, this.areaHeight);

        this.ctx.strokeStyle = "black";
        this.ctx.font = this.cellHeight + "px Arial";
        this.ctx.textBaseline = "middle";

        let objs = this.score.concat();
        if(this.isDragging){
            objs.push(this.dragProperty);
        }

        for(let obj of objs){
            let left = obj.start * this.cellWidth;
            let top = obj.pitch * this.cellHeight;
            let width = (obj.end - obj.start + 1) * this.cellWidth;

            //四角の描画
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(left, top, width, this.cellHeight);
            this.ctx.strokeRect(left, top, width, this.cellHeight);

            //歌詞の描画
            this.ctx.fillStyle = "black";
            this.ctx.fillText(obj.lyric, left, top + this.cellHeight / 2, width);
        }
    }

    noteExists(x, y) {
        for(let i = 0, length = this.score.length; i < length; i++){
            if(this.score[i].start <= x && x <= this.score[i].end){
                if(this.score[i].pitch === y){
                    return i;
                }
            }
        }

        return -1;
    }

    //インデックスだけで消せるようにしたい
    removeNote(i) {
        this.score.splice(i, 1);
        /*
        for(let i = 0, length = this.score.length; i < length; i++){
            if(this.score[i].start <= x && x<= this.score[i].end){
                if(this.score[i].pitch === y){
                    this.score.splice(i, 1);
                    break;
                }
            }
        }
        */

    }

    addNote(obj) {
        let i_s, i_e, objList = [obj];
        /*
            追加するセルの先頭がすでにあるセルとセルの間にあるなら,挿入するインデックスのみを保持
            追加するセルの先頭がすでにあるセルに被っていたら,元のセルの長さを変更してobjListの先頭に追加
        */
        for(var i = 0, length = this.score.length; i < length; i++){
            if(this.score[i].start >= obj.start) break;

            if(this.score[i].start < obj.start && obj.start <= this.score[i].end){
                let tmp = Object.assign({}, this.score[i]);
                tmp.end = obj.start-1;
                objList.unshift(tmp);
                break;
            }
        }
        i_s = i;

        for(i = 0; i < length; i++){
            if(this.score[i].start <= obj.end && obj.end < this.score[i].end){
                let tmp = Object.assign({}, this.score[i]);
                tmp.start = obj.end+1;
                objList.push(tmp);
                break;
            }

            if(this.score[i].end >= obj.end) break;
        }
        i_e = i;

        //追加する要素の個数が1個かつ,挿入の先頭位置と末尾位置が一致する時は削除を伴わない
        let deleteNum = objList.length === 1 && i_e-i_s === 0 ? 0 : i_e-i_s+1;

        this.score.splice.apply(this.score, [i_s, deleteNum].concat(objList));
    }

    addTextBox(index) {
        const input = document.createElement("input");
        input.type = "text";
        input.id = "lyric";
        input.value = this.score[index].lyric;
        input.style.position = "absolute";
        input.style.fontSize = this.cellHeight + "px";
        input.style.top = this.score[index].pitch * this.cellHeight + "px";
        input.style.left = this.score[index].start * this.cellWidth + "px";
        input.style.width = this.cellWidth * (this.score[index].end - this.score[index].start + 1) + "px";
        input.style.height = this.cellHeight + "px";
        input.style.padding = "0px";
        input.style.margin = "0px";
        input.style.border = "0px";
        input.style.backgroundColor = "red";
        input.onblur = function() {
            this.parentNode.removeChild(this);
        };
        input.onkeypress = function(e) {
            if(e.keyCode === 13){
                let txtBox = document.getElementById("lyric");
                this.score[index].lyric = txtBox.value;
                txtBox.blur();
                this.draw();
            }
        }.bind(this);

        //テキストボックスの追加
        this.canvas.parentNode.insertBefore(input, this.canvas.nextSibling);

        //テキストボックスにフォーカスを合わせる
        setTimeout(function() {
            document.getElementById("lyric").focus();
        }, 0);

    }

    onMouseDown(e) {
        const rect = e.target.getBoundingClientRect();
        const x = Math.max(0, e.clientX - rect.left);
        const y = Math.max(0, e.clientY - rect.top);
        const xIndex = Math.floor(x / this.cellWidth);
        const yIndex = Math.floor(y / this.cellHeight);
        const sameIndex = this.noteExists(xIndex, yIndex);

        if(sameIndex !== -1){
            if(this.isClicked){
                this.addTextBox(sameIndex);
                this.isClicked = false;
            }
            else{
                this.isClicked = true;
                setTimeout(function() {
                    if(this.isClicked){
                        this.score.splice(sameIndex, 1);
                    }
                    this.isClicked = false;
                    this.draw();
                }.bind(this), 200);
            }
        }
        else{
            this.dragProperty.start = xIndex;
            this.dragProperty.pitch = yIndex;
            this.dragProperty.end = xIndex;
            this.isDragging = true;
        }

        this.draw();
    }

    onMouseUp(e) {
        if(this.isDragging){
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            this.dragProperty.end = Math.max(this.dragProperty.start, Math.floor(x / this.cellWidth));
            this.isDragging = false;

            this.addNote(this.dragProperty);
            this.draw();

            this.dragProperty = {
                start: null,
                end: null,
                lyric: "あ",
                pitch: null
            };
        }
    }

    onMouseMove(e) {
        if(this.isDragging){
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            this.dragProperty.end = Math.max(this.dragProperty.start, Math.floor(x / this.cellWidth));
            this.draw();
        }
    }
}