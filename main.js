function start(){
    let pContainer = document.getElementById("piano-container");
    let sContainer = document.getElementById("score-container");
    //canvasの幅をdivの幅に揃える
    document.getElementById('piano').width = pContainer.clientWidth;

    //スクロールを合わせる
    pContainer.onscroll = function(){
        sContainer.scrollTop = this.scrollTop;
    };
    
    sContainer.onscroll = function(){
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

        this.draw();
    }

    draw() {
        this.editor.draw();
        this.piano.draw();

    }
}


class Piano {
    constructor() {
        this.canvas = document.getElementById("piano");
        this.ctx = this.canvas.getContext("2d");
        this.areaWidth = this.canvas.clientWidth;
        this.areaHeight = this.canvas.clientHeight;
    }

    draw() {
        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(0, 0, this.areaWidth, this.areaHeight);        
    }
}

//打ち込み画面を管理するクラス
class Editor {
    constructor(verticalNum, horizontalNum, measureNum){
        this.canvas = document.getElementById("editor");
        this.ctx = this.canvas.getContext("2d");

        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;

        this.verticalNum = verticalNum;
        this.horizontalNum = horizontalNum;
        this.measureNum = measureNum;

        this.score = new Score(
            this.ctx, this.width, this.height, this.horizontalNum, this.verticalNum
        );

        this.backGround = new BackGround(
            this.ctx, this.width, this.height, this.measureNum, this.verticalNum
        );

        this.canvas.addEventListener('mousedown', this.score.onMouseDown.bind(this.score), false);
        this.canvas.addEventListener('mouseup', this.score.onMouseUp.bind(this.score), false);
        this.canvas.addEventListener('mousemove', this.score.onMouseMove.bind(this.score), false);

        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.score.draw(this.ctx);
        this.backGround.draw(this.ctx);
    }
}

//枠線などを描画するクラス
class BackGround {
    constructor(ctx, width, height, measureNum, vNum) {
        this.ctx = ctx;
        this.areaWidth = width;
        this.areaHeight = height;
        this.measureNum = measureNum;
        this.verticalNum = vNum;
    }

    draw() {
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
    constructor(ctx, width, height, horizontalNum, verticalNum) {
        this.ctx = ctx;
        this.horizontalNum = horizontalNum;
        this.verticalNum = verticalNum;
        this.areaWidth = width;
        this.areaHeight = height;
        this.cellWidth = this.areaWidth / this.horizontalNum;
        this.cellHeight = this.areaHeight / this.verticalNum;

        this.score = new Array();
        this.isDragging = false;
        this.dragProperty = {
            start: null,
            end: null,
            lyric: "あ",
            pitch: null
        };
    }   

    draw() {
        this.ctx.strokeStyle = "black";
        this.ctx.font = this.cellHeight + "px Arial";

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
            this.ctx.fillText(obj.lyric, left, top + this.cellHeight, width);
        }
    }

    /*
    updateScore(s, e, p) {
        for(var i = 0, length = this.score.length; i < length; i++){
            if(this.score[i].start > s){
                break;
            }
        }

        this.score.splice(i, 0, {
            start: s,
            end: e,
            lyric: "あ",
            pitch: p
        });
        console.log(this.score);
    }
    */

    noteExists(x, y) {
        for(let obj of this.score){
            if(obj.start <= x && x <= obj.end){
                if(obj.pitch === y){
                    return true;
                }
            }
        }

        return false;
    }

    //インデックスだけで消せるようにしたい
    removeNote(x, y) {
        for(let i = 0, length = this.score.length; i < length; i++){
            if(this.score[i].start <= x && x<= this.score[i].end){
                if(this.score[i].pitch === y){
                    this.score.splice(i, 1);
                    break;
                }
            }
        }

    }

    addNote(obj) {
        for(var i = 0, length = this.score.length; i < length; i++){
            if(this.score[i].start > obj.start){
                break;
            }
        }

        this.score.splice(i, 0, obj);
    }

    onMouseDown(e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xIndex = Math.floor(x / this.cellWidth);
        const yIndex = Math.floor(y / this.cellHeight);

        if(this.noteExists(xIndex, yIndex)){
            this.removeNote(xIndex, yIndex);
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