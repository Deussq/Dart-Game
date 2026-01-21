const players = JSON.parse(localStorage.getItem("players")) || [];
const gamePlayersContainer = document.getElementById("game-players");
const gameMode = Number(localStorage.getItem("gameMode")) || 301;
let turnStartScore = 0;
let switchTimeout = null;







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
  const cards = gamePlayersContainer.children;
  let currentIndex = [...cards].findIndex(card =>
    card.classList.contains("active")
  );
  cards[currentIndex].classList.remove("active");

  const prevIndex = (currentIndex - 1 + cards.length) % cards.length;

  cards[prevIndex].classList.add("active");
  dartsThrown = 3;
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
}

document.getElementById("play-again").addEventListener("click", () => {
  location.reload(); // просто перезагружаем страницу для новой игры
});

document.getElementById("return-menu").addEventListener("click", () => {
  window.location.href = "index.html"; // возвращаемся в меню
});



function showEndGameModal() {
  const modal = document.getElementById("end-game-modal");
  const standings = document.getElementById("final-standings");

  // Сортируем игроков по очкам (меньше = лучше)
  const sortedPlayers = [...players].sort((a,b) => a.score - b.score);

  standings.innerHTML = ""; // чистим
  sortedPlayers.forEach((player, index) => {
    const div = document.createElement("div");
    div.textContent = `${index + 1}. ${player.name} — ${player.score} pts`;
    standings.appendChild(div);
  });

  modal.classList.remove("hidden");
}






renderGamePlayers();




