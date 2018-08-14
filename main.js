function start(){
    var pContainer = document.getElementById("piano-container");
    var gContainer = document.getElementById("grid-container");

    pContainer.onscroll = function(){
        gContainer.scrollTop = this.scrollTop;
        console.log()
    };
    
    gContainer.onscroll = function(){
        pContainer.scrollTop = this.scrollTop;
    };

    grid = new Grid();
    piano = new Piano();

    piano.drawPiano();
    grid.drawGrid();
}



class Piano {
    constructor() {
        this.canvas = document.getElementById("piano");
        this.ctx = this.canvas.getContext("2d");
        this.areaWidth = this.canvas.clientWidth;
        this.areaHeight = this.canvas.clientHeight;
    
    }

    drawPiano() {
        console.log(this.areaWidth, this.areaHeight);
        this.ctx.fillRect(0, 0, this.areaWidth, this.areaHeight);
//        this.ctx.font = "20px serif"
//        this.ctx.fillText("Something like Piano", 0, 40);    
    }
}


class Grid {
    constructor() {
        this.canvas = document.getElementById("grid");
        this.ctx = this.canvas.getContext("2d");
        this.areaWidth = this.canvas.clientWidth;
        this.areaHeight = this.canvas.clientHeight;
        this.cellWidth = 100;
        this.cellHeight = 50;
    
    }   

    drawGrid() {
        for(var w = 0; w <= this.areaWidth; w+=this.cellWidth){
            this.ctx.beginPath();
            this.ctx.moveTo(w, 0);
            this.ctx.lineTo(w, this.areaHeight);
            this.ctx.stroke();
        }
    
        for(var h = 0; h <= this.areaHeight; h+=this.cellHeight){
            this.ctx.beginPath();
            this.ctx.moveTo(0, h);
            this.ctx.lineTo(this.areaWidth, h);
            this.ctx.stroke();
        }
    }

}