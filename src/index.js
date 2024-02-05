document.addEventListener('DOMContentLoaded', function() {
  const holes = document.querySelectorAll('.hole');
  const moles = document.querySelectorAll('.mole');
  setEventListeners(moles);
  const startButton = document.querySelector('#start');
  startButton.addEventListener("click", startGame);
  const score = document.querySelector('#score');
  const timerDisplay = document.querySelector('#timer');

  let time = 0;
  let timer;
  let lastHole = 0;
  let points = 0; // Ensure this is declared only once
  let difficulty = "hard";
  let gameInterval; // Declare the gameInterval variable

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
      clearInterval(gameInterval);
      console.log("Game Over");
  }

  function showUp() {
      let delay = setDelay(difficulty);
      const hole = chooseHole(holes);
      hole.classList.add('show');
      setTimeout(() => {
          hole.classList.remove('show');
          if (time > 0) {
              showUp();
          }
      }, delay);
  }

  function updateScore() {
      points += 1;
      score.textContent = points;
  }

  function clearScore() {
      points = 0;
      score.textContent = points;
  }

  function updateTimer() {
      if (time > 0) {
          time -= 1;
          timerDisplay.textContent = time;
      } else {
          clearInterval(timer);
          gameOver();
      }
  }

  function startGame() {
    clearInterval(gameInterval); // Ensure no previous game intervals are running
    clearInterval(timer); // Ensure no previous timer intervals are running

    time = 60; // Reset the game time to 60 seconds for a new game
    points = 0; // Reset the score for a new game
    score.textContent = '0'; // Display the reset score
    timerDisplay.textContent = '60'; // Show the starting time

    // Start showing moles
    gameInterval = setInterval(showUp, setDelay(difficulty));

    // Start the countdown timer
    timer = setInterval(function() {
        time -= 1;
        timerDisplay.textContent = time.toString();

        if (time <= 0) {
            clearInterval(timer); // Stop the timer when it reaches 0
            clearInterval(gameInterval); // Also stop showing new moles
            gameOver(); // Handle game over logic
        }
    }, 1000);
}

  function setEventListeners(moles) {
      moles.forEach(mole => {
          mole.addEventListener('click', whack);
      });
  }

  function whack(event) {
      if (event.target.classList.contains('mole')) {
          updateScore();
      }
  }

  // Mallet functionality
  const mallet = document.getElementById('mallet');

  // Show the mallet when the mouse moves within the game area
  document.querySelector('.grid').addEventListener('mousemove', function(e) {
      mallet.style.display = 'block'; // Make the mallet visible
      mallet.style.left = e.pageX + 'px';
      mallet.style.top = e.pageY + 'px';
  });

  // Optionally, hide the mallet when the mouse leaves the game area
  document.querySelector('.grid').addEventListener('mouseleave', function() {
      mallet.style.display = 'none';
  });
});
