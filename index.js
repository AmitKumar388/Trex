const playerElement = document.querySelector('.player');
const obstacleElement = document.querySelector('.obstacle');
const scoreElement = document.querySelector('.score-card .score');
const highScoreElement = document.querySelector('.score-card .high-score');
const restartGameElement = document.querySelector('.restart-game');
const gameContainerElement = document.querySelector('.game-container');

const OBSTACLE_SIZES = ['xs','s','m','l'];
/**
 * JUMP
 */
function addJumpListener() {
    document.addEventListener('keydown', event => {
        if(event.key === ' ' || event.key === 'ArrowUp') {
            jump();
        }
    })
}

function addRestartListener() {
    document.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            restart();  
        }
    });
}

let jumping = false;
function jump() {
    if(jumping) {
        return;
    }

    jumping = true;
    playerElement.classList.add('jump');
    setTimeout(() => {
        playerElement.classList.remove('jump');
        jumping = false;
    }, 1200)
}


let collisionInterval;
function monitorCollision() {
    collisionInterval = setInterval(() => {
        if(isCollision()) {
            checkForHighScore();
            stopGame();
        }
    }, 10);
}

const LEFT_BUFFER = 50;
function isCollision() {
    const playerClientRect = playerElement.getBoundingClientRect();
    const playerL = playerClientRect.left;
    const playerR = playerClientRect.right;
    const playerB = playerClientRect.bottom;
    

    const obstacleClientRect = obstacleElement.getBoundingClientRect();
    const obstacleL = obstacleClientRect.left;
    const obstacleR = obstacleClientRect.right;
    const obstacleT = obstacleClientRect.top;

    const xCollision = (obstacleR - LEFT_BUFFER) > playerL && obstacleL < playerR;
    const yCollision = playerB > obstacleT;

    return xCollision && yCollision;
}
let score = 0;
function setScore(newScore) {
    scoreElement.innerHTML = score = newScore;
}

let scoreInterval;
function countScore() {
    scoreInterval = setInterval(() => {
        setScore(score + 1);
    }, 100);
}

let highscore = localStorage.getItem('highscore') || 0;
function setHighScore(newScore) {
    highScoreElement.innerText = highscore = newScore;
    localStorage.setItem('highscore', newScore);
}

function checkForHighScore() {
    if(score > highscore) {
        setHighScore(score);
    }
}

function getRandomObstacleSize() {
    const index = Math.floor(Math.random() * (OBSTACLE_SIZES.length - 1));
    return OBSTACLE_SIZES[index];
}

let changeObstacleInterval;
function randomiseObstacle() {
    changeObstacleInterval = setInterval(() => {
        const obstacleSize = getRandomObstacleSize();
        obstacleElement.className = `obstacle obstacle-${obstacleSize}`;
    }, 3000);
}

function stopGame() {
    clearInterval(collisionInterval);
    clearInterval(scoreInterval);
    clearInterval(changeObstacleInterval);
    restartGameElement.classList.add('show');
    gameContainerElement.classList.add('stop')
}

function restart() {
    location.reload();  
}

function main() {
    addJumpListener();
    monitorCollision();
    countScore();
    setHighScore(highscore);
    randomiseObstacle();
    addRestartListener();  
};

main();