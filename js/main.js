// ===== RULES MODAL =====
const openRulesBtn = document.getElementById("open-rules-btn");
const rulesModal = document.getElementById("rules-modal");
const closeRulesBtn = document.getElementById("close-rules");

openRulesBtn.addEventListener("click", () => {
  rulesModal.classList.remove("hidden");
});

closeRulesBtn.addEventListener("click", () => {
  rulesModal.classList.add("hidden");
});

rulesModal.addEventListener("click", (e) => {
  if (e.target === rulesModal) {
    rulesModal.classList.add("hidden");
  }
});


// ===== PLAYERS =====
const addPlayerBtn = document.getElementById("add-player");
const playerInputs = document.querySelectorAll("#player-list input");
const playersDisplay = document.getElementById("players-display");
const startBtn = document.getElementById("start-btn");
const errorMsg = document.getElementById("player-error");

//  ОДИН массив, без дублей
let players = JSON.parse(localStorage.getItem("players")) || [];








// ===== RENDER =====
function renderPlayers() {
  playersDisplay.innerHTML = "";

  players.forEach((player, index) => {
    const div = document.createElement("div");
    div.classList.add("player-card");

    const nameSpan = document.createElement("span");
    nameSpan.textContent = player.name;
    div.appendChild(nameSpan);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "—";
    removeBtn.style.marginLeft = "10px";

    removeBtn.addEventListener("click", () => {
      removePlayer(index);
    });

    div.appendChild(removeBtn);
    playersDisplay.appendChild(div);
  });
}


// ===== SAVE =====
function savePlayers() {
  localStorage.setItem("players", JSON.stringify(players));
}


// ===== REMOVE =====
function removePlayer(index) {
  players.splice(index, 1);
  savePlayers();
  renderPlayers();
}


// ===== ADD PLAYER =====
addPlayerBtn.addEventListener("click", () => {
  playerInputs.forEach(input => {
    const name = input.value.trim();

    if (name) {
      players.push({
        id: Date.now(),
        name: name,
        score: 301,
        darts: 0,
        throws: []
      });
    }

    input.value = "";
  });

  savePlayers();
  renderPlayers();
});



function saveGameMode() {
  const selectedMode = document.querySelector('input[name="mode"]:checked');
  localStorage.setItem("gameMode", selectedMode.value);
}


// ===== START GAME =====
startBtn.addEventListener("click", () => {
  if (players.length === 0) {
    if (errorMsg) {
      errorMsg.style.display = "block";
      errorMsg.textContent = "Min. 1 Player!";
    }
    return;
  }
  if (errorMsg) errorMsg.style.display = "none";

  savePlayers();
  saveGameMode();
  window.location.href = "game.html";
});






// ===== INIT =====
renderPlayers();






