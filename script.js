const boardElement = document.getElementById("board");
const turnText = document.getElementById("turnText");
const resultText = document.getElementById("result");
const scoreBoard = document.getElementById("scoreBoard");
const restartBtn = document.getElementById("restartBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const gameModeSelect = document.getElementById("gameMode");
const themeSelect = document.getElementById("themeSelect");
const darkModeBtn = document.getElementById("darkModeBtn");
const soundBtn = document.getElementById("soundBtn");

const nameModal = document.getElementById("nameModal");
const player1Input = document.getElementById("player1Input");
const player2Input = document.getElementById("player2Input");
const player1InputBox = document.getElementById("player1InputBox");
const player2InputBox = document.getElementById("player2InputBox");
const startGameBtn = document.getElementById("startGameBtn");

let board, currentPlayer, gameActive, theme, scores, soundOn = true;
let player1, player2;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

const sounds = {
  move: new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"),
  win: new Audio("https://actions.google.com/sounds/v1/cartoon/concussive_drum_hit.ogg"),
  draw: new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg")
};

function openNameModal() {
  if (gameModeSelect.value === "pvp") {
    player2InputBox.style.display = "block";
  } else {
    player2InputBox.style.display = "none";
  }
  nameModal.style.display = "flex";
}

startGameBtn.addEventListener("click", () => {
  player1 = player1Input.value.trim() || "Player 1";
  if (gameModeSelect.value === "pvp") {
    player2 = player2Input.value.trim() || "Player 2";
  } else {
    player2 = "Computer";
  }
  scores = { [player1]: 0, [player2]: 0 };
  updateScore();
  nameModal.style.display = "none";
  initGame();
});

function initGame() {
  board = Array(9).fill("");
  currentPlayer = player1;
  gameActive = true;
  boardElement.innerHTML = "";
  for (let i=0; i<9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    boardElement.appendChild(cell);
  }
  updateTurnText();
  resultText.textContent = "";
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  e.target.textContent = getSymbol(currentPlayer);
  if (soundOn) sounds.move.play();

  if (checkWin()) {
    endGame(false);
  } else if (!board.includes("")) {
    endGame(true);
  } else {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    updateTurnText();
    if (gameModeSelect.value !== "pvp" && currentPlayer === player2) {
      setTimeout(computerMove, 500);
    }
  }
}

function getSymbol(player) {
  if (theme === "classic") {
    return player === player1 ? "❌" : "⭕";
  } else {
    return player === player1 ? "🤖" : "😎";
  }
}

function checkWin() {
  return winPatterns.some(([a,b,c]) => {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      document.querySelectorAll(".cell")[a].classList.add("winner");
      document.querySelectorAll(".cell")[b].classList.add("winner");
      document.querySelectorAll(".cell")[c].classList.add("winner");
      return true;
    }
    return false;
  });
}

function endGame(draw) {
  gameActive = false;
  if (draw) {
    resultText.textContent = "It's a Draw! 🤝";
    if (soundOn) sounds.draw.play();
  } else {
    resultText.textContent = `${currentPlayer} Wins! 🎉`;
    scores[currentPlayer]++;
    updateScore();
    if (soundOn) sounds.win.play();
  }
}

function updateTurnText() {
  turnText.textContent = `${currentPlayer}'s Turn`;
}

function updateScore() {
  scoreBoard.textContent = `${player1}: ${scores[player1]}   ${player2}: ${scores[player2]}`;
}

function resetGame() { initGame(); }
function resetScore() {
  scores = { [player1]: 0, [player2]: 0 };
  updateScore();
}

function computerMove() {
  let move;
  if (gameModeSelect.value === "easy") {
    const empty = board.map((v,i)=> v===""?i:null).filter(v=>v!==null);
    move = empty[Math.floor(Math.random()*empty.length)];
  } else {
    move = bestMove();
  }
  board[move] = player2;
  const cell = document.querySelectorAll(".cell")[move];
  cell.textContent = getSymbol(player2);
  if (soundOn) sounds.move.play();

  if (checkWin()) {
    endGame(false);
  } else if (!board.includes("")) {
    endGame(true);
  } else {
    currentPlayer = player1;
    updateTurnText();
  }
}

function bestMove() {
  for (let [a,b,c] of winPatterns) {
    if (board[a]===player2 && board[b]===player2 && board[c]==="") return c;
    if (board[a]===player2 && board[c]===player2 && board[b]==="") return b;
    if (board[b]===player2 && board[c]===player2 && board[a]==="") return a;
  }
  for (let [a,b,c] of winPatterns) {
    if (board[a]===player1 && board[b]===player1 && board[c]==="") return c;
    if (board[a]===player1 && board[c]===player1 && board[b]==="") return b;
    if (board[b]===player1 && board[c]===player1 && board[a]==="") return a;
  }
  if (board[4]==="") return 4;
  const empty = board.map((v,i)=> v===""?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

// --- Event Listeners ---
restartBtn.addEventListener("click", resetGame);
resetScoreBtn.addEventListener("click", resetScore);

gameModeSelect.addEventListener("change", () => {
  openNameModal();
});

themeSelect.addEventListener("change", () => {
  theme = themeSelect.value;
  resetGame();
});

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

soundBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  soundBtn.textContent = soundOn ? "🔊 Sound On" : "🔇 Sound Off";
});

// --- Initialize ---
theme = themeSelect.value;
openNameModal();
