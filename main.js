function start(){
    let pContainer = document.getElementById("piano-container");
    let sContainer = document.getElementById("score-container");

    //スクロールを合わせる
    pContainer.onscroll = function(){
        sContainer.scrollTop = this.scrollTop;
        console.log()
    };
    
    sContainer.onscroll = function(){
        pContainer.scrollTop = this.scrollTop;
    };

    score = new Score();
    piano = new Piano();

    piano.drawPiano();
    score.drawGrid();
}



class Piano {
    constructor() {
        this.canvas = document.getElementById("piano");
        this.ctx = this.canvas.getContext("2d");
        this.areaWidth = this.canvas.clientWidth;
        this.areaHeight = this.canvas.clientHeight;
    
    }

    drawPiano() {
        //this.ctx.fillRect(0, 0, this.areaWidth, this.areaHeight);
        this.ctx.font = "20px serif"
        this.ctx.fillText("Something like Piano", 0, 40);    
    }
}


class Score {
    constructor() {
        this.canvas = document.getElementById("score");
        this.ctx = this.canvas.getContext("2d");
        this.horizontalNum = 30;
        this.verticalNum = 24;
        this.areaWidth = this.canvas.clientWidth;
        this.areaHeight = this.canvas.clientHeight;
        this.cellWidth = this.areaWidth / this.horizontalNum;
        this.cellHeight = this.areaHeight / this.verticalNum;
        
        this.score = new Array(this.horizontalNum);
        for(let i = 0; i < this.horizontalNum; i++){
            this.score[i] = new Array(this.verticalNum).fill(null);
        }


        this.canvas.addEventListener('click', this.onClick.bind(this), false);
    }   

    //枠線の描画
    drawGrid() {
        for(let w = 0; w <= this.areaWidth; w+=this.cellWidth){
            this.ctx.beginPath();
            this.ctx.moveTo(w, 0);
            this.ctx.lineTo(w, this.areaHeight);
            this.ctx.stroke();
        }
    
        for(let h = 0; h <= this.areaHeight; h+=this.cellHeight){
            this.ctx.beginPath();
            this.ctx.moveTo(0, h);
            this.ctx.lineTo(this.areaWidth, h);
            this.ctx.stroke();
        }
    }

    
    drawScore(){
        this.ctx.fillStyle = "red";
        for(let x = 0; x < this.horizontalNum; x++){
            for(let y = 0; y < this.verticalNum; y++){
                if(this.score[x][y] !== null){
                    this.ctx.fillRect(x*this.cellWidth, y*this.cellHeight, 
                        this.cellWidth, this.cellHeight);
                    this.ctx.strokeRect(x*this.cellWidth, y*this.cellHeight,
                        this.cellWidth, this.cellHeight);
                }

            }
        }
    }

    updateScore(x, y){
        this.score[x][y] = this.score[x][y] === null ? 1 : null;

    }


    draw(){
        this.ctx.clearRect(0, 0, this.areaWidth, this.areaHeight);
        this.drawGrid();
        this.drawScore();
    }

    onClick(e) {
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        let x_index = Math.floor(x / this.cellWidth);
        let y_index = Math.floor(y / this.cellHeight);

        this.updateScore(x_index, y_index);

        this.draw();
    }
}