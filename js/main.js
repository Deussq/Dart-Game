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



const addPlayerBtn = document.getElementById("add-player");
const playerInputs = document.querySelectorAll("#player-list input");
const playersDisplay = document.getElementById("players-display");
const startBtn = document.getElementById("start-btn");
const errorMsg = document.getElementById("player-error");


let players = JSON.parse(localStorage.getItem("players")) || [];


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
 removeBtn.style.width = "20%"
  removeBtn.style.padding = "7px 10px"
    removeBtn.addEventListener("click", () => {
      removePlayer(index);
    });

    div.appendChild(removeBtn);
    playersDisplay.appendChild(div);
  });
}


function savePlayers() {
  localStorage.setItem("players", JSON.stringify(players));
}



function removePlayer(index) {
  players.splice(index, 1);
  savePlayers();
  renderPlayers();
}




addPlayerBtn.addEventListener("click", () => {
  playerInputs.forEach(input => {
    let name = input.value.trim();

   
    name = name.replace(/[^A-Za-zÄÖÜäöüßА-Яа-яЁё ]/g, "");

  
    if (name.length > 10) {
      name = name.slice(0, 10);
    }

   
    if (name.length === 0) {
      alert("Name cannot be empty and must contain only letters!");
      return;
    }

    players.push({
      id: Math.floor(Math.random() * 1000000),
      name: name,
      score: 301,
      darts: 0,
      throws: []
    });

    input.value = "";
  });

  localStorage.setItem("players", JSON.stringify(players));
savePlayers();
  renderPlayers();


});




function saveGameMode() {
  const selectedMode = document.querySelector('input[name="mode"]:checked');
  localStorage.setItem("gameMode", selectedMode.value);
}



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


renderPlayers();