const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let foodX, foodY;
let gameOver = false;
let snakeX = 5, snakeY= 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

// Getting high score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.textContent = `High Score: ${highScore}`;

const changeFoodPosition = () => {
    // Passing a random 0 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Clearing the timer and reloading the page on Game Over
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to Replay!");
    location.reload();
}

const changeDirection = (event) => {
    if(event.key === "ArrowUp" && velocityY != 1 ){
        velocityX = 0;
        velocityY = -1;
    } else if(event.key === "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    } else if(event.key === "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    } else if(event.key === "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    } 
}

controls.forEach(key => {
    // Calling changeDirection on each key click and passing key dataset value as an object
    key.addEventListener('click', () => changeDirection({ key: key.dataset.key}));
})

const initGame = () => {

    if(gameOver) return handleGameOver();

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;

        scoreElement.textContent = `Score: ${score}`;

        highScore = Math.max(highScore, score);
        localStorage.setItem("high-score", highScore);

        highScoreElement.textContent = `High Score: ${highScore}`;
    }

    for(let i = snakeBody.length - 1; i > 0; i--) {
        // Shifting forward  the values of the element in the snake body by one
        snakeBody[i] = snakeBody[i - 1];
    }

    // Setting first element of snake body to current snake position
    snakeBody[0] = [snakeX, snakeY]; 

    //Updating the snake's head position based on the current valocity
    snakeX += velocityX;
    snakeY += velocityY;

    // Checking for collisions with the walls, if so setting gameOver to true
    if( snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        gameOver = true;
    }

    for(let i=0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake's body
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        // Checking if the snake head hit the body, if so set gameOver to true
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;    
        }
 
    }

    playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);

