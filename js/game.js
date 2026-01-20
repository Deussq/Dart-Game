const players = JSON.parse(localStorage.getItem("players")) || [];
const gamePlayersContainer = document.getElementById("game-players");
const gameMode = Number(localStorage.getItem("gameMode")) || 301;
let turnStartScore = 0;



players.forEach(player => {
  player.score = gameMode;
});


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





let currentThrowSum = 0;
let dartsThrown = 0;
let multiplier = 1;

const dartButtons = document.querySelectorAll(".dart-keyboard button");

dartButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const text = btn.textContent;

    if (text === "Cancel") {
      resetThrow();
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

  // стартовый счёт хода
  if (dartsThrown === 0) {
    turnStartScore = player.score;
  }

  const throwValue = value * multiplier;
  player.throws.push(throwValue);
  dartsThrown++;
  multiplier = 1;

  // считаем временный счёт
  const newScore = player.score - throwValue;

  //  BUST 
  if (newScore < 0) {
    alert("Bust!!");
    player.score = turnStartScore;
    activeCard.querySelector(".player-score").textContent = player.score;
    dartsThrown = 0;
    nextPlayer();
    return;
  }

  //  применяем счёт
  player.score = newScore;
  activeCard.querySelector(".player-score").textContent = player.score;

  updateThrowUI(player, activeCard);

  //  победа
  if (player.score === 0) {
    alert(player.name + " wins the game!! 🎉");
    return;
  }

  // конец хода
  if (dartsThrown === 3) {
    nextPlayer();
  }
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
player.throws.slice(startIndex, startIndex + dartsThrown).forEach(throwValue => {
  sum += throwValue;
});


  card.querySelector(".throw-sum").textContent = sum || 0;
}





function nextPlayer() {
  //  Найти текущего активного игрока
  const activeCard = document.querySelector(".player-card-game.active");
  if (!activeCard) return;

  // Узнать индекс текущего игрока
  const playerIndex = Array.from(gamePlayersContainer.children).indexOf(activeCard);

  // Снять активный класс
  activeCard.classList.remove("active");

  // Найти следующего игрока по кругу
  const nextIndex = (playerIndex + 1) % players.length;
  const nextCard = gamePlayersContainer.children[nextIndex];
  nextCard.classList.add("active");

  // Сбросить счётчик бросков и множитель
  dartsThrown = 0;
  multiplier = 1;

  // Очистить квадраты бросков для нового хода
  const throws = nextCard.querySelectorAll(".throw");
  throws.forEach(span => span.textContent = "-");
  nextCard.querySelector(".throw-sum").textContent = 0;
}





renderGamePlayers();




