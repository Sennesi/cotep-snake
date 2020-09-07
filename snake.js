var canvas;
var ctx;

//info/item game
var head;
var apple;
var ball;
var delay = 200;
var score = 0;

// musique
var sfx_themeOne = 0;
var sfx_appleCoin = new Audio("musiques/Coin02.wav");
var sfx_gameOver = new Audio("musiques/metal-gear-solid-game-over-screen-clean-background.mp3");
var sfx_musiqueTheme = new Audio("musiques/songbest.mp3");

var dots;
var apple_x;
var apple_y;

var leftDirection = false;
var rightDirection = true;
var upDirection = false;
var downDirection = false;
var inGame = true;  

// info de la map
const DOT_SIZE = 10;
const ALL_DOTS = 900;
const MAX_RAND = 29;
const C_HEIGHT = 500;
const C_WIDTH = 500;    

// keyboard
const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;
var   oneMove = 0;

// Emplacement du serpent
var x = new Array(ALL_DOTS);
var y = new Array(ALL_DOTS);   

//initialisation du jeu
var init = () => {
    sfx_appleCoin.volume = 0.05;    
    sfx_gameOver.volume = 0.05;
    sfx_musiqueTheme.volume = 0.05;
    sfx_musiqueTheme.loop = true;
    
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    loadImages();
    createSnake();
    locateApple();
    setTimeout("gameCycle()", delay);
}

//charge les images
var loadImages = () => {
    
    head = new Image();
    head.src = 'images/head.png';    
    
    ball = new Image();
    ball.src = 'images/dot.png'; 
    
    apple = new Image();
    apple.src = 'images/apple.png'; 
}

//creer le snake
var createSnake = () => {

    dots = 3;
    for (var z = 0; z < dots; z++) {
        x[z] = 50 - z * 10;
        y[z] = 50;
    }
}

//Augmente le snake si head est sur apple
var checkApple = () => {

    if ((x[0] == apple_x) && (y[0] == apple_y)) {

        dots++;
        locateApple();
    }
}    
// affiche les images du serpent ou Game Over
var doDrawing = () => {
    
    ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    
    if (inGame) {

        ctx.drawImage(apple, apple_x, apple_y);

        for (var z = 0; z < dots; z++) {
            
            if (z == 0) {
                ctx.drawImage(head, x[z], y[z]);
            } else {
                ctx.drawImage(ball, x[z], y[z]);
            }
        }    
    } else {

        gameOver();
    }        
}

var gameOver = () => {
    sfx_musiqueTheme.pause();
    sfx_gameOver.play();
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'normal bold 18px serif';
    
    ctx.fillText('Game over', C_WIDTH/2, C_HEIGHT/2);
}

// change le score
var updateScore = () => {
    sfx_appleCoin.play();
    score++;
    document.getElementById('GFG').innerHTML = "score = " + score;
}
//verification que la pomme est toujours presente sur la map
var checkApple = () => {

    if ((x[0] == apple_x) && (y[0] == apple_y)) {

        dots++;
        locateApple();
        updateScore();
        if (delay > 50) {
            delay = delay - 10;
        }
    }
}
//deplacement du serpent
var move = () => {

    for (var z = dots; z > 0; z--) {
        x[z] = x[(z - 1)];
        y[z] = y[(z - 1)];
    }

    if (leftDirection) {
        x[0] -= DOT_SIZE;
    }

    if (rightDirection) {
        x[0] += DOT_SIZE;
    }

    if (upDirection) {
        y[0] -= DOT_SIZE;
    }

    if (downDirection) {
        y[0] += DOT_SIZE;
    }
}    
// check si le serpent entre en collision avec les murs ou avec lui-meme
var checkCollision = () => {

    for (var z = dots; z > 0; z--) {
        if ((z > 3) && (x[0] == x[z]) && (y[0] == y[z])) {
            inGame = false;
        }
    }

    if (y[0] >= C_HEIGHT) {
        inGame = false;
    }

    if (y[0] < 0) {
       inGame = false;
    }

    if (x[0] >= C_WIDTH) {
      inGame = false;
    }

    if (x[0] < 0) {
      inGame = false;
    }
}
// ajoute une articulation au snake
var locateApple = () => {

    var r = Math.floor(Math.random() * MAX_RAND);
    apple_x = r * DOT_SIZE;

    r = Math.floor(Math.random() * MAX_RAND);
    apple_y = r * DOT_SIZE;
}    
// gestion de chaque cycle
var gameCycle = () => {

    if (inGame) {       
        if (!sfx_themeOne) {
            sfx_musiqueTheme.play().then(() => {sfx_themeOne++});
        }   
        checkApple();
        checkCollision();
        move();
        doDrawing();
        if (oneMove !=0){
            oneMove--;
        }
        setTimeout("gameCycle()", delay);
    }
}
// utilisation du clavier
onkeydown = (e) => {
    if (oneMove){
        return;
    }
    oneMove++;
    var key = e.keyCode;
    
    if ((key == LEFT_KEY) && (!rightDirection)) {
        
        leftDirection = true;
        upDirection = false;
        downDirection = false;
    }

    if ((key == RIGHT_KEY) && (!leftDirection)) {
        
        rightDirection = true;
        upDirection = false;
        downDirection = false;
    }

    if ((key == UP_KEY) && (!downDirection)) {
        
        upDirection = true;
        rightDirection = false;
        leftDirection = false;
    }

    if ((key == DOWN_KEY) && (!upDirection)) {
        
        downDirection = true;
        rightDirection = false;
        leftDirection = false;
    }        
};    