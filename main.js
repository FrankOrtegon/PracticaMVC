(function(){
    self.Board = function(width,height) {
    this.width = width;
    this.height = height;
    this.playing = false;
    this.gameOver = false;
    this.bars = [];
    this.ball = null;
    this.playing = false;
}

self.Board.prototype = {
    get elements(){
        var elements = this.bars.map(function(bar) { return bar; });
        elements.push(this.ball);
        return elements;
    }
}
})();

(function() {
    self.Ball = function(x,y,radio,board) {
        this.x = x;
        this.y = y;
        this.radio = radio;
        this.board = board;
        this.speed_y = 0;
        this.speed_x = 3;
        this.derection = 1;

        board.ball = this;
        this.kind = "circle";
    }
    
    self.Ball.prototype = {
        move: function() {
           this.x += (this.speed_x * this.derection);
           this.y += (this.speed_y);
        }
    }
})();

(function() {
    self.Bar = function(x,y,width,height,board) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 20;
    }

    self.Bar.prototype = {
        down : function() {
            this.y += this.speed;
        },
        up : function() {
            this.y -= this.speed;
        },
        toString : function() {
            return "x: " + this.x + " y: " + this.y;
        }
    }
})();

(function() {
    self.BoardView = function(canvas,board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    self.BoardView.prototype = {
        clean : function() {
            this.ctx.clearRect(0,0,this.board.width,this.board.height);
        },
        draw : function() {
            for (var i = this.board.elements.length - 1; i>= 0; i--) {
                var el = this.board.elements[i];

                draw(this.ctx,el);
            };
        },

        play: function() {
            if (this.board.playing) {
                this.clean();
                this.draw();
                this.board.ball.move();
            }
        }
    }

    function draw(ctx,element) {
      switch(element.kind) {

          case "rectangle":
             ctx.fillRect(element.x,element.y,element.width,element.height);
             break;

          case "circle":
              ctx.beginPath();
              ctx.arc(element.x,element.y,element.radio,0,7);
              ctx.fill();
              ctx.closePath();
              break;
      }
    }
})();

var board = new Board(800,400);
var bar = new Bar(20,130,40,100,board); // Barra derecha
var bar2 = new Bar(735,130,40,100,board); //Barra izquierda
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas,board);
var ball = new Ball(350,100,10,board);

document.addEventListener("keydown",function(ev) {
    
    if (ev.keyCode == 38) {
        ev.preventDefault();
        bar.up(); //Flecha Arriba
    }
    else if(ev.keyCode == 40 ) {
        ev.preventDefault();
        bar.down(); //Flecha Abajo
    }
    else if(ev.keyCode == 87) {
        ev.preventDefault();
        bar2.up(); //W
    }
    else if (ev.keyCode == 83) {
        ev.preventDefault();
        bar2.down(); //S
    }
    else if(ev.keyCode === 32) {
        ev.preventDefault();
        board.playing = !board.playing;
    }
});

window.requestAnimationFrame(controller);
setTimeout(function() {
    ball.derection = -1;
},4000);

function controller() {
    
    board_view.play();
    window.requestAnimationFrame(controller);

}