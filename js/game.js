let players = [];
const gameMode = Number(localStorage.getItem("gameMode")) || 301;

const savedGame = localStorage.getItem("dartGamePlayers");

if (savedGame) {
  players = JSON.parse(savedGame);
} else {
  players = JSON.parse(localStorage.getItem("players")) || [];

  players.forEach(player => {
    player.score = gameMode;
    player.throws = [];
  });
}

const gamePlayersContainer = document.getElementById("game-players");
let turnStartScore = 0;
let switchTimeout = null;



const navResetBtn = document.getElementById("nav-reset");

if (navResetBtn) {
  navResetBtn.addEventListener("click", () => {

    // 🔥 ПОЛНЫЙ СБРОС ИГРЫ
    localStorage.removeItem("dartGamePlayers");
    localStorage.removeItem("dartGameActivePlayer");
    localStorage.removeItem("dartGameDartsThrown");
    localStorage.removeItem("dartGameSeconds");

    // (не обязательно, но можно)
    localStorage.removeItem("players");
    localStorage.removeItem("gameMode");

    // ⏮ возврат в меню
    window.location.href = "index.html";
  });
}



function saveGame() {
  localStorage.setItem("dartGamePlayers", JSON.stringify(players));
  localStorage.setItem("dartGameActivePlayer", getActivePlayerIndex());
  localStorage.setItem("dartGameDartsThrown", dartsThrown);
  localStorage.setItem("dartGameSeconds", seconds);
  localStorage.setItem("dartGameTurnStartScore", turnStartScore);
}

function getActivePlayerIndex() {
  const activeCard = document.querySelector(".player-card-game.active");
  return Array.from(gamePlayersContainer.children).indexOf(activeCard);
}




function renderGamePlayers() {
  gamePlayersContainer.innerHTML = "";

  players.forEach((player, index) => {
    const card = document.createElement("div");
    card.classList.add("player-card-game");
    if (index === 0) card.classList.add("active");


    const left = document.createElement("div");
    left.classList.add("player-left");
    left.innerHTML = `
            <div class="player-score">${player.score}</div>
            <div class="player-name">${player.name}</div>
        `;



    const center = document.createElement("div");
    center.classList.add("player-center");
    center.innerHTML = `
      <div class="throws-history"> 
      <span class="throw">-</span> 
      <span class="throw">-</span> 
      <span class="throw">-</span> 
      </div> 
      <div class="throw-sum">0</div> 
      `;


    const right = document.createElement("div");
    right.classList.add("player-right");
    right.innerHTML = `
            <div class="player-average">Ø 0</div>
            <div class="player-darts">🎯 0</div>
        `;

    card.appendChild(left);
    card.appendChild(center);
    card.appendChild(right);

    gamePlayersContainer.appendChild(card);
  });
}




function restoreGame() {
  const savedIndex = localStorage.getItem("dartGameActivePlayer");
  const savedDarts = localStorage.getItem("dartGameDartsThrown");
  const savedTurnStartScore = localStorage.getItem("dartGameTurnStartScore");

  // Восстанавливаем счетчики
  dartsThrown = savedDarts !== null ? Number(savedDarts) : 0;
  turnStartScore = savedTurnStartScore !== null ? Number(savedTurnStartScore) : 0;

  // Снимаем активность со всех карточек
  document.querySelectorAll(".player-card-game").forEach(card => card.classList.remove("active"));

  // Восстанавливаем активного игрока
  let index = 0;
  if (savedIndex !== null && gamePlayersContainer.children[savedIndex]) {
    index = Number(savedIndex);
  }
  const activeCard = gamePlayersContainer.children[index];
  activeCard.classList.add("active");

  // Обновляем UI всех игроков
  document.querySelectorAll(".player-card-game").forEach((card, i) => {
    updateThrowUI(players[i], card);
    card.querySelector(".player-score").textContent = players[i].score;
  });

  // 🔹 Если игрок уже сделал броски, запускаем таймер смены игрока
  if (dartsThrown > 0 && dartsThrown < 3) {
    // Запускаем таймаут для auto-switch, как будто игрок продолжает ход
    switchTimeout = setTimeout(() => {
      nextPlayer();
      switchTimeout = null;
    }, 1500);
  }
}












let currentThrowSum = 0;
let dartsThrown = 0;
let multiplier = 1;




const dartButtons = document.querySelectorAll(".dart-keyboard button");
dartButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const text = btn.textContent;

    if (text === "Undo") {
      undoLastThrow();
      return;
    }

    if (text === "Bull") {
      addThrow(25);
      return;
    }

    if (text === "D") {
      multiplier = 2;
      return;
    }

    if (text === "T") {
      multiplier = 3;
      return;
    }

    const value = Number(text);
    if (!isNaN(value)) {
      addThrow(value);
    }
  });
});



function addThrow(value) {
  const activeCard = document.querySelector(".player-card-game.active");
  if (!activeCard || dartsThrown >= 3) return;

  const playerIndex = Array.from(gamePlayersContainer.children).indexOf(activeCard);
  const player = players[playerIndex];

  if (!player.throws) player.throws = [];


  if (dartsThrown === 0) {
    turnStartScore = player.score;
  }

  const throwValue = value * multiplier;
  player.throws.push(throwValue);
  dartsThrown++;
  multiplier = 1;


  const newScore = player.score - throwValue;

  if (newScore < 0) {
    alert("Bust!!");
    player.score = turnStartScore;
    activeCard.querySelector(".player-score").textContent = player.score;
    dartsThrown = 0;
    nextPlayer();
    return;
  }


  player.score = newScore;
  activeCard.querySelector(".player-score").textContent = player.score;

  updateThrowUI(player, activeCard);


  if (player.score === 0) {
    showEndGameModal();
    return;
  }



  if (dartsThrown === 3) {
    switchTimeout = setTimeout(() => {
      nextPlayer();
      switchTimeout = null;
    }, 1500);
  }

  saveGame()
}




function resetThrow() {
  const activeCard = document.querySelector(".player-card-game.active");
  if (!activeCard) return;

  const playerIndex = Array.from(gamePlayersContainer.children).indexOf(activeCard);
  const player = players[playerIndex];

  if (!player.throws) player.throws = [];

  Array(dartsThrown).fill().forEach(() => player.throws.pop());

  dartsThrown = 0;
  multiplier = 1;
  updateThrowUI(player, activeCard);
}



function updateThrowUI(player, card) {
  const throws = card.querySelectorAll(".throw");


  throws.forEach(span => span.textContent = "-");



  const startIndex = player.throws.length - dartsThrown;
  throws.forEach((span, i) => {
    if (i < dartsThrown) {
      span.textContent = player.throws[startIndex + i];
    }
  });



  let sum = 0;
  player.throws.slice(startIndex, startIndex + dartsThrown).forEach(val => {
    sum += val;
  });

  card.querySelector(".throw-sum").textContent = sum;



  card.querySelector(".player-darts").textContent = 
  "🎯 " + player.throws.length;



  let totalPoints = 0;

  player.throws.forEach(val => {
    totalPoints += val;
  });

  let average;

if (player.throws.length > 0) {
  average = (totalPoints / player.throws.length).toFixed(1);
} else {
  average = 0;
}

  card.querySelector(".player-average").textContent = "Ø " + average;
}






function nextPlayer() {

  const activeCard = document.querySelector(".player-card-game.active");
  if (!activeCard) return;


  const playerIndex = Array.from(gamePlayersContainer.children).indexOf(activeCard);


  activeCard.classList.remove("active");


  const nextIndex = (playerIndex + 1) % players.length;
  const nextCard = gamePlayersContainer.children[nextIndex];
  nextCard.classList.add("active");


  dartsThrown = 0;
  multiplier = 1;


  const throws = nextCard.querySelectorAll(".throw");
  throws.forEach(span => span.textContent = "-");
  nextCard.querySelector(".throw-sum").textContent = 0;
}




function prevPlayer() {
  
}






function undoLastThrow() {

  if (switchTimeout) {
    clearTimeout(switchTimeout);
    switchTimeout = null;
  }

  const activeCard = document.querySelector(".player-card-game.active");
  if (!activeCard) return;

  const playerIndex = Array.from(gamePlayersContainer.children).indexOf(activeCard);
  const player = players[playerIndex];

  if (!player.throws || player.throws.length === 0) return;


  if (dartsThrown === 0) {
    prevPlayer();
    return;
  }


  const lastThrow = player.throws.pop();
  player.score += lastThrow;
  dartsThrown--;

  activeCard.querySelector(".player-score").textContent = player.score;
  updateThrowUI(player, activeCard);
  saveGame()
}




document.getElementById("play-again").addEventListener("click", () => {
  // очищаем сохранённую игру
  localStorage.removeItem("dartGamePlayers");
  localStorage.removeItem("dartGameActivePlayer");
  localStorage.removeItem("dartGameDartsThrown");
  localStorage.removeItem("dartGameSeconds");

  // перезапуск страницы или возврат в меню
  location.reload();
});
document.getElementById("return-menu").addEventListener("click", () => {

  // ❗ полностью сбрасываем игру
  localStorage.removeItem("dartGamePlayers");
  localStorage.removeItem("dartGameActivePlayer");
  localStorage.removeItem("dartGameDartsThrown");
  localStorage.removeItem("dartGameSeconds");


});



function showEndGameModal() {
  const modal = document.getElementById("end-game-modal");
  const standings = document.getElementById("final-standings");


  const sortedPlayers = [];

  players.forEach(player => {
    sortedPlayers.push(player);
  });


  sortedPlayers.sort(function (a, b) {
    if (a.score > b.score) {
      return 1;
    } else if (a.score < b.score) {
      return -1;
    } else {
      return 0;
    }
  });


  standings.innerHTML = "";
  sortedPlayers.forEach((player, index) => {
    const div = document.createElement("div");
    div.textContent = `${index + 1}. ${player.name} — ${player.score} pts`;
    standings.appendChild(div);
  });

  modal.classList.remove("hidden");
}



let seconds = 0;
function startTimer() {
  setInterval(function () {
    seconds++;

    let minutes = Math.floor(seconds / 60);
    let sec = seconds % 60;

    if (sec < 10) {
      sec = "0" + sec;
    }

    document.getElementById("game-timer").textContent =
      minutes + ":" + sec;
  }, 1000);
}


startTimer();
renderGamePlayers();
restoreGame();


