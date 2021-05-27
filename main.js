(function () {
    self.Board = function (width, height) {
        this.width = width;
        this.height = height;
        this.playing = false;
        this.gameOver = false;
        this.bars = [];
        this.ball = null;
        this.playing = false;
    }

    self.Board.prototype = {
        get elements() {
            var elements = this.bars.map(function (bar) { return bar; });
            elements.push(this.ball);
            return elements;
        }
    }
})();

(function () {
    self.Ball = function (x, y, radio, board) {
        this.x = x;
        this.y = y;
        this.radio = radio;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 3;

        board.ball = this;
        this.kind = "circle";
    }

    self.Ball.prototype = {
        move: function () {
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
        },

        get width() {
            return this.radio * 2;
        },
        get height() {
            return this.radio * 2;
        },

        collision: function (bar) {

            var relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;
            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if (this.x > (this.board.width / 2)) this.direction = -1;
            else this.direction = 1;
        }
    }
})();

(function () {
    self.Bar = function (x, y, width, height, board) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 10;
    }

    self.Bar.prototype = {

        down: function () {
            if (this.y <= 300) {   //Condicionales para que las barras no transpasen el tablero
            this.y += this.speed;
            }
        },

        up: function () {
            if(this.y >=0) { //Condicionales para que las barras no transpasen el tablero
            this.y -= this.speed;
            }
        },

        toString: function () {
            return "x: " + this.x + " y: " + this.y;
        }
    }
})();

(function () {
    self.BoardView = function (canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    self.BoardView.prototype = {
        clean: function () {
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },

        draw: function () {
            for (var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i];

                draw(this.ctx, el);
            };
        },

        check_collisions: function () {

            for (var i = this.board.bars.length - 1; i >= 0; i--) {
                var bar = this.board.bars[i];
                if (hit(bar, this.board.ball)) {
                    this.board.ball.collision(bar);
                }
            };

            if(this.board.ball.y <= 0){   //Condicionales para que la pelota rebote en los laterales
                this.board.ball.speed_y = this.board.ball.speed_y * -1;
            }
 
            if(this.board.ball.y >= 400){  
                this.board.ball.speed_y = this.board.ball.speed_y * -1;
            }
        },

        play: function () {
            if (this.board.playing) {
                this.clean();
                this.draw();
                this.check_collisions();
                this.board.ball.move();
            }
        }
    }

    function hit(a, b) {
        var hit = false;

        if (b.x + b.width >= a.x && b.x < a.x + a.width) {
            if (b.y + b.height >= a.y && b.y < a.y + a.height)
                hit = true;
        }

        if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
            if (b.y <= a.y && b.y + b.height >= a.y + a.height)
                hit = true;
        }

        if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
            if (a.y <= b.y && a.y + a.height >= b.y + b.height)
                hit = true;
        }

        return hit;
    }

    function draw(ctx, element) {
        switch (element.kind) {

            case "rectangle":
                try {
                ctx.fillRect(element.x, element.y, element.width, element.height);
                } catch(error ) { alert(error); }
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radio, 0, 7);
                ctx.fill();
                ctx.closePath();
                break;
        }
    }
})();

var board = new Board(800, 400);
var bar = new Bar(20, 140, 40, 100, board); // Barra derecha
var bar2 = new Bar(735, 140, 40, 100, board); //Barra izquierda
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas, board);
var ball = new Ball(400, 200, 10, board); //Pelota

document.addEventListener("keydown", function (ev) {

    if (ev.keyCode == 38) {
        ev.preventDefault();
        bar2.up(); //W
    }
    else if (ev.keyCode == 40) {
        ev.preventDefault();
        bar2.down(); //S
    }
    else if (ev.keyCode == 87) {
        ev.preventDefault();
        bar.up(); //Flecha Arriba
    }
    else if (ev.keyCode == 83) {
        ev.preventDefault();
        bar.down(); //Flecha Abajo
    }
    else if (ev.keyCode === 32) {
        ev.preventDefault();
        board.playing = !board.playing;
    }
});

window.requestAnimationFrame(controller);

var puntosJugador1 = document.getElementById("puntosJugador1"); //Variables que se piden de HTML para utilizarlas para aumentar los puntajes
var puntosJugador2 = document.getElementById("puntosJugador2");

function reiniciar() { // Funcion para reiniciar el juego 
    if(ball.x >=800 || ball.x <= 0){
        if(ball.x >=800){
            alert("Ganó el jugador 1");
            puntosJugador1.innerHTML = (Number(puntosJugador1.innerHTML)+1)
        }
        if(ball.x <=0){
            alert("Ganó el jugador 2");
            puntosJugador2.innerHTML = (Number(puntosJugador2.innerHTML)+1)
        } 
        bar.x = 20;
        bar.y = 140;
        bar2.x = 735;
        bar2.y = 140;
        ball.x = 400;
        ball.y = 200;
        ball.direction = 1;
        ball.bounce_angle = 0;
        ball.speed_x = 2;
        ball.speed_y = 0;
        ball.max_bounce_angle = Math.PI / 12;
        board.playing = !board.playing;
    }
}

function controller() {

    board_view.play();
    board_view.clean();
    board_view.draw();
    window.requestAnimationFrame(controller);
    reiniciar();
}