function start(){
    var piano = document.getElementById("piano-container");
    var grid = document.getElementById("grid-container");

    piano.onscroll = function(){
        grid.scrollTop = this.scrollTop;
        console.log()
    };
    
    grid.onscroll = function(){
        piano.scrollTop = this.scrollTop;
    };
}


var Piano = function(){
    this.canvas = document.getElementById("piano");
    this.context = this.canvas.getContext("2d");
    this.areaWidth = this.canvas.clientWidth;
    this.areaHeight = this.canvas.clientHeight;
}

Piano.prototype.drawPiano = function(){
    this.context.font = "20px serif"
    this.context.fillText("Something like Piano", 0, 40);

}



var Grid = function(){
    this.canvas = document.getElementById("grid");
    this.context = this.canvas.getContext("2d");
    this.areaWidth = this.canvas.clientWidth;
    this.areaHeight = this.canvas.clientHeight;
    this.cellWidth = 100;
    this.cellHeight = 50;
}

Grid.prototype.drawGrid = function(){
    for(var w = 0; w <= this.areaWidth; w+=this.cellWidth){
        this.context.beginPath();
        this.context.moveTo(w, 0);
        this.context.lineTo(w, this.areaHeight);
        this.context.stroke();
    }

    for(var h = 0; h <= this.areaHeight; h+=this.cellHeight){
        this.context.beginPath();
        this.context.moveTo(0, h);
        this.context.lineTo(this.areaWidth, h);
        this.context.stroke();
    }
}

grid = new Grid();
piano = new Piano();

piano.drawPiano();
grid.drawGrid();