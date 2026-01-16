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
            <div class="throws-history"></div>
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
let dartsThrown = 0;     // сколько дротиков
let multiplier = 1;     // x1 / x2 / x3

const dartButtons = document.querySelectorAll(".dart-keyboard button");

dartButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    const text = btn.textContent;

    //  Cancel
    if (text === "Cancel") {
      resetThrow();
      return;
    }

    //  Bull
    if (text === "Bull") {
      addThrow(25);
      return;
    }

    //  Double
    if (text === "D") {
      multiplier = 2;
      return;
    }

    //  Triple
    if (text === "T") {
      multiplier = 3;
      return;
    }

    //  ЧИСЛА
    const value = Number(text);
    if (!isNaN(value)) {
      addThrow(value);
    }

  });
});


function addThrow(value) {
  if (dartsThrown >= 3) return;

  currentThrowSum += value * multiplier;
  dartsThrown++;

  multiplier = 1; // сбрасываем D/T
  updateThrowUI();
}


function resetThrow() {
  currentThrowSum = 0;
  dartsThrown = 0;
  multiplier = 1;
  updateThrowUI();
}


function updateThrowUI() {
  const activeCard = document.querySelector(".player-card-game.active");
  if (!activeCard) return;

  activeCard.querySelector(".throw-sum").textContent = currentThrowSum;
}




renderGamePlayers();




