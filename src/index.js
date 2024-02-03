const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
setEventListeners(moles);
const startButton = document.querySelector('#start');
const score = document.querySelector('#score');
const timerDisplay = document.querySelector('#timer');

let time = 0;
let timer;
let lastHole = 0;
let points = 0;
let difficulty = "hard";

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setDelay(difficulty) {
  if (difficulty === "easy") {
    return 1500;
  } else if (difficulty === "normal") {
    return 1000;
  } else if (difficulty === "hard") {
    return randomInteger(600, 1200);
  } else {
    console.warn("Unexpected difficulty level:", difficulty);
    return 1000;
  }
}

let lastHoleIndex = -1;

function chooseHole(holes) {
  let index = randomInteger(0, holes.length - 1);
  if (index === lastHoleIndex) {
    return chooseHole(holes);
  } else {
    lastHoleIndex = index;
    return holes[index];
  }
}

function gameOver() {
  if (time > 0) {
    showUp();
    return "game continues";
  } else {
    stopGame();
    return "game stopped";
  }
}

function showUp() {
  let delay = setDelay(difficulty);
  const hole = chooseHole(holes);
  return showAndHide(hole, delay);
}

function showAndHide(hole, delay) {
  toggleVisibility(hole);
  const timeoutID = setTimeout(() => {
    toggleVisibility(hole);
    gameOver();
  }, delay);

  return timeoutID;
}

function toggleVisibility(hole) {
  hole.classList.toggle('show');
  return hole;
}

let points = 0;

function updateScore() {
  points += 1;
  score.textContent = points;
  return points;
}

function clearScore() {
  points = 0;
  score.textContent = points;
  return points;
}

function updateTimer() {
  if (time > 0){
    time -= 1;
    timerDisplay.textContent = time;
  }
  return time;
}

function startTimer() {
  timer = setInterval(updateTimer, 1000);
  return timer;
}

function startGame() {
  time = 60;
  points = 0;
  score.textContent = points;

  if (gameInterval) clearInterval(gameInterval);

  gameInterval = setInterval(() => {
    showUp();
    time -= 1;
    updateTimer();

    if (time <= 0) {
      clearInterval(gameInterval);
      gameOver();
    }
  }, 1000);

  return "game started";
}

startButton.addEventListener("click", startGame);

function whack(event) {
  if (event.target.classList.contains('mole')) {
    updateScore();
  }
}

function setEventListeners(moles) {
  moles.forEach((mole) => {
    mole.addEventListener('click', whack);
  });

  return moles;
}
