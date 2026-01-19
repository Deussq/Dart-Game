const players = JSON.parse(localStorage.getItem("players")) || [];
const gamePlayersContainer = document.getElementById("game-players");
const gameMode = Number(localStorage.getItem("gameMode")) || 301;


players.forEach(player => {
  player.score = gameMode;
});


function renderGamePlayers() {
    gamePlayersContainer.innerHTML = "";

    players.forEach((player, index) => {
        const card = document.createElement("div");
        card.classList.add("player-card-game");
        if (index === 0) card.classList.add("active"); // первый игрок активный

        // ЛЕВАЯ КОЛОНКА
        const left = document.createElement("div");
        left.classList.add("player-left");
        left.innerHTML = `
            <div class="player-score">${player.score}</div>
            <div class="player-name">${player.name}</div>
        `;

        // ЦЕНТР
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

        // ПРАВАЯ КОЛОНКА
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





let currentThrowSum = 0; // сумма за ход
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

  // Добавляем бросок
  const throwValue = value * multiplier;
  player.throws.push(throwValue);
  dartsThrown++;
  multiplier = 1;

  updateThrowUI(player, activeCard);

  if (dartsThrown === 3) {
    // Считаем сумму бросков текущего хода через простой цикл
    let turnSum = 0;
    for (let i = player.throws.length - 3; i < player.throws.length; i++) {
      if (i >= 0) turnSum += player.throws[i];
    }

   player.score = player.score - turnSum;
    activeCard.querySelector(".player-score").textContent = player.score;

    // Здесь можно вызвать смену игрока nextPlayer()
  }
}

function resetThrow() {
  const activeCard = document.querySelector(".player-card-game.active");
  if (!activeCard) return;

  const playerIndex = Array.from(gamePlayersContainer.children).indexOf(activeCard);
  const player = players[playerIndex];

  if (!player.throws) player.throws = [];

  for (let i = 0; i < dartsThrown; i++) {
    player.throws.pop();
  }

  dartsThrown = 0;
  multiplier = 1;
  updateThrowUI(player, activeCard);
}

function updateThrowUI(player, card) {
  const historyDiv = card.querySelector(".throws-history");
  historyDiv.innerHTML = "";

  player.throws.forEach(t => {
    const span = document.createElement("span");
    span.className = "throw";
    span.textContent = t;
    historyDiv.appendChild(span);
  });

  // Показать только последний бросок
  if (player.throws.length > 0) {
    card.querySelector(".throw-sum").textContent = player.throws[player.throws.length - 1];
  } else {
    card.querySelector(".throw-sum").textContent = 0;
  }
}



renderGamePlayers();




