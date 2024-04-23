import { createGame } from "./game";
import { createGameboard } from "./gameboard";
import {
  cols,
  flashClassEvent,
  getRowAndCol,
  logErrorEvent,
  logInfoEvent,
  logTurnEvent,
  rows,
} from "./helper";

// Declare elements

const board1 = document.getElementById("board1");
const board2 = document.getElementById("board2");

const rowLabelWrapper1 = document.getElementById("rowLabelWrapper1");
const colLabelWrapper1 = document.getElementById("colLabelWrapper1");

const rowLabelWrapper2 = document.getElementById("rowLabelWrapper2");
const colLabelWrapper2 = document.getElementById("colLabelWrapper2");

const shipOptions = document.getElementsByName("ship");

const shipCoordInput1 = document.getElementById("shipCoord1");
const shipCoordInput2 = document.getElementById("shipCoord2");
const attackCoordInput = document.getElementById("attackCoord");

const setUpForm = document.getElementById("setUpForm");

const randomlyPlaceShipBtn = document.getElementById("randomlyPlaceShip");
const randomlyPlaceAllShipsBtn = document.getElementById(
  "randomlyPlaceAllShips"
);
const startGameBtn = document.getElementById("startGame");

const surrenderBtn = document.getElementById("surrender");
const anotherGameBtn = document.getElementById("anotherGame");

const attackForm = document.getElementById("attackForm");
const randomlyAttackBtn = document.getElementById("randomlyAttack");

const modalResult = document.getElementById("modalResult");
const gameOverModal = document.getElementById("gameOverModal");

// Render gameboards

const gb1 = createGameboard();
const gb2 = createGameboard();

const game = createGame(gb1, gb2);

function renderBoards() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const b1Cell = document.createElement("div");
      const b2Cell = document.createElement("div");
      b1Cell.classList.add("cell");
      b2Cell.classList.add("cell");
      b1Cell.setAttribute("row", rows[i]);
      b2Cell.setAttribute("row", rows[i]);
      b1Cell.setAttribute("col", cols[j]);
      b2Cell.setAttribute("col", cols[j]);
      board1.appendChild(b1Cell);
      board2.appendChild(b2Cell);
    }
  }

  for (let i = 0; i < rows.length; i++) {
    const rowLabel1 = document.createElement("div");
    const colLabel1 = document.createElement("div");
    const rowLabel2 = document.createElement("div");
    const colLabel2 = document.createElement("div");
    rowLabel1.classList.add("rowLabel");
    colLabel1.classList.add("colLabel");
    rowLabel2.classList.add("rowLabel");
    colLabel2.classList.add("colLabel");
    rowLabel1.textContent = rows[i];
    colLabel1.textContent = cols[i];
    rowLabel2.textContent = rows[i];
    colLabel2.textContent = cols[i];
    rowLabelWrapper1.appendChild(rowLabel1);
    colLabelWrapper1.appendChild(colLabel1);
    rowLabelWrapper2.appendChild(rowLabel2);
    colLabelWrapper2.appendChild(colLabel2);
  }
}

// Initialize all listeners

function initListeners() {
  placeShipListen();
  randomlyPlaceShipListen();
  randomlyPlaceAllShipsListen();
  clickShipCoordListen();
  inputToUpperCaseListen();
  renderSelectedCoordListen();
  startGameListen();
  newGameListen();
  surrenderListen();
  clickAttackCoordListen();
  attackListen();
  randomlyAttackListen();
}

// Place Ship event listener

function placeShipListen() {
  setUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      placeShipEvent();
    } catch (err) {
      logErrorEvent(err.message);
    }
  });
}

function placeShipEvent() {
  const shipChecked = [...shipOptions].find((ship) => {
    return ship.checked;
  });

  const coord1 = shipCoordInput1.value;
  const coord2 = shipCoordInput2.value;

  switch (shipChecked.value) {
    case "Patrol Boat":
      gb1.placePatrolBoat(coord1, coord2);
      break;
    case "Submarine":
      gb1.placeSubmarine(coord1, coord2);
      break;
    case "Destroyer":
      gb1.placeDestroyer(coord1, coord2);
      break;
    case "Battleship":
      gb1.placeBattleship(coord1, coord2);
      break;
    case "Carrier":
      gb1.placeCarrier(coord1, coord2);
      break;
    default:
      throw new Error("Unable to find selected ship.");
  }

  renderAllShipsOnBoard(gb1, board1);

  shipCoordInput1.value = "";
  shipCoordInput2.value = "";
  renderAllSelectedOnB1();
}

// Randomly Place Ship event listener

function randomlyPlaceShipListen() {
  randomlyPlaceShipBtn.addEventListener("click", randomlyPlaceShipEvent);
}

function randomlyPlaceShipEvent() {
  const shipChecked = [...shipOptions].find((ship) => {
    return ship.checked;
  });

  switch (shipChecked.value) {
    case "Patrol Boat":
      gb1.placePatrolBoatRandomly();
      break;
    case "Submarine":
      gb1.placeSubmarineRandomly();
      break;
    case "Destroyer":
      gb1.placeDestroyerRandomly();
      break;
    case "Battleship":
      gb1.placeBattleshipRandomly();
      break;
    case "Carrier":
      gb1.placeCarrierRandomly();
      break;
    default:
      throw new Error("Unable to find selected ship.");
  }

  renderAllShipsOnBoard(gb1, board1);

  shipCoordInput1.value = "";
  shipCoordInput2.value = "";
  renderAllSelectedOnB1();
}

// Randomly Place All Ships event listener

function randomlyPlaceAllShipsListen() {
  randomlyPlaceAllShipsBtn.addEventListener(
    "click",
    randomlyPlaceAllShipsEvent
  );
}

function randomlyPlaceAllShipsEvent() {
  gb1.placeAllShipsRandomly();

  renderAllShipsOnBoard(gb1, board1);

  shipCoordInput1.value = "";
  shipCoordInput2.value = "";
  renderAllSelectedOnB1();
}

// Click coord to add input value for ship

function clickShipCoordListen() {
  const b1Cells = document.querySelectorAll("#board1>.cell");
  b1Cells.forEach((cell) => {
    cell.addEventListener("click", clickShipCoordEvent);
  });
}

function clickShipCoordEvent(e) {
  const clickedCoord =
    e.target.getAttribute("row") + e.target.getAttribute("col");

  if (shipCoordInput1.value === "") {
    shipCoordInput1.value = clickedCoord;
  } else if (shipCoordInput1.value !== "" && shipCoordInput2.value !== "") {
    shipCoordInput1.value = clickedCoord;
    shipCoordInput2.value = "";
  } else if (
    shipCoordInput1.value !== "" &&
    shipCoordInput1.value !== clickedCoord
  ) {
    shipCoordInput2.value = clickedCoord;
  }

  renderAllSelectedOnB1();
}

// Turn all coord values to upperCase

function inputToUpperCaseListen() {
  shipCoordInput1.addEventListener("input", inputToUpperCase);
  shipCoordInput2.addEventListener("input", inputToUpperCase);
  attackCoordInput.addEventListener("input", inputToUpperCase);
}

function inputToUpperCase(e) {
  e.target.value = e.target.value.toUpperCase();
}

// Make coord inputs show selected coords on board

function renderSelectedCoordListen() {
  shipCoordInput1.addEventListener("input", () => {
    renderSelected(board1, shipCoordInput1, b1Selected1);
  });
  shipCoordInput2.addEventListener("input", () => {
    renderSelected(board1, shipCoordInput2, b1Selected2);
  });
  attackCoordInput.addEventListener("input", () => {
    renderSelected(board2, attackCoordInput, b2Selected);
  });
}

function renderAllSelectedOnB1() {
  renderSelected(board1, shipCoordInput2, b1Selected2);
  renderSelected(board1, shipCoordInput1, b1Selected1);
}

let b1Selected1 = [null];
let b1Selected2 = [null];
let b2Selected = [null];

function renderSelected(board, inputElement, selected) {
  let newSelected;

  if (inputElement.value.length < 2) {
    newSelected = null;
  } else {
    const [row, col] = getRowAndCol(inputElement.value);

    newSelected = board.querySelector(`[row="${row}"][col="${col}"]`);
  }

  if (selected[0] !== null) {
    selected[0].classList.remove("selected");
  }

  if (newSelected !== null) {
    newSelected.classList.add("selected");
  }

  selected[0] = newSelected;
}

// Render ships

function renderAllShipsOnBoard(gameboard, board) {
  gameboard.ships.forEach((ship) => {
    renderAnyShip(ship, board);
  });
}

function unrenderAllShips() {
  const shipPieces = document.querySelectorAll(".shipPiece");
  for (const shipPiece of shipPieces) {
    shipPiece.classList.add("displayNone");
  }
}

function renderAnyShip(ship, board) {
  switch (ship.name) {
    case "Patrol Boat":
      renderShip(ship, board);
      break;
    case "Submarine":
      renderShip(ship, board);
      break;
    case "Destroyer":
      renderShip(ship, board);
      break;
    case "Battleship":
      renderShip(ship, board);
      break;
    case "Carrier":
      renderShip(ship, board);
      break;
    default:
      throw Error("Ship name not found");
  }
}

function renderShip(ship, board) {
  const shipPieces = board.querySelectorAll(".shipPiece");
  const shipPiece = [...shipPieces].find((shipPiece) => {
    return shipPiece.getAttribute("shipName") === ship.name;
  });
  shipPiece.classList.remove("displayNone");

  // Get row and col for first ship coord
  const [row, col] = getRowAndCol(ship.coords[0]);

  const cell = board.querySelector(`[row="${row}"][col="${col}"]`);

  cell.appendChild(shipPiece);

  const [row2, col2] = getRowAndCol(ship.coords[1]);
  // If ship orientation is vertical...
  if (row !== row2) {
    shipPiece.classList.add("verticalPiece");
  } else {
    shipPiece.classList.remove("verticalPiece");
  }
}

// Start Game event listener

function startGameListen() {
  startGameBtn.addEventListener("click", startGameEvent);
}

function startGameEvent() {
  if (gb1.ships.length !== 5) {
    flashClassEvent("infoEvent");
  } else {
    gb2.placeAllShipsRandomly();
    renderAllShipsOnBoard(gb2, board2);
    setUpForm.classList.add("displayNone");
    logInfoEvent("The game has begun. Make your move.");
    game.setupPhase = false;
  }
}

// New Game event listener

function newGameListen() {
  anotherGameBtn.addEventListener("click", newGameEvent);
}

function newGameEvent() {
  gameOverModal.classList.add("displayNone");
  unrenderAllShips();
  unrenderAllAttacks();
  setUpForm.classList.remove("displayNone");
  // Clearing textContent clears all children
  eventLog.textContent = "";
  logInfoEvent("Place your ships to complete the set up phase.");
  game.resetGame();
}

// Surrender event listener

function surrenderListen() {
  surrenderBtn.addEventListener("click", surrenderEvent);
}

function surrenderEvent() {
  if (game.setupPhase) {
    modalResult.innerText =
      "Who knew you could surrender before the game even starts? This is clearly the profound outcome of humanity's free will and desire to break the mold.";
  } else {
    modalResult.innerText =
      "How pitiful, humanity surrendering to its own creation. The Singularity grows ever closer.";
  }
  gameOverModal.classList.remove("displayNone");
}

// Click coord to add input value for attack

function clickAttackCoordListen() {
  const b2Cells = document.querySelectorAll("#board2>.cell");
  b2Cells.forEach((cell) => {
    cell.addEventListener("click", clickAttackCoordEvent);
  });
}

function clickAttackCoordEvent(e) {
  const clickedCoord =
    e.target.getAttribute("row") + e.target.getAttribute("col");

  attackCoordInput.value = clickedCoord;

  renderSelected(board2, attackCoordInput, b2Selected);
}

// Attack event listener

function attackListen() {
  attackForm.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      attackEvent(false);
    } catch (err) {
      logErrorEvent(err.message);
    }
  });
}

function randomlyAttackListen() {
  randomlyAttackBtn.addEventListener("click", () => {
    try {
      attackEvent(true);
    } catch (err) {
      logErrorEvent(err.message);
    }
  });
}

function attackEvent(random) {
  const output = game.playerAttacksComputer(random, attackCoordInput.value);

  if (typeof output === "string") {
    logTurnEvent(game.turn, output);
    modalResult.innerText = output;
    gameOverModal.classList.remove("displayNone");
  } else {
    logTurnEvent(game.turn, output[0] + " " + output[1]);
  }

  renderAttacks(gb2, board2);
  renderAttacks(gb1, board1);

  attackCoordInput.value = "";
  renderSelected(board2, attackCoordInput, b2Selected);
}

// Render hit and missed attacks on board

function renderAttacks(gameboard, board) {
  const allShipCoords = gameboard.getAllShipCoords();
  const hitCoords = gameboard.attackedCoords.filter((coord) => {
    return allShipCoords.includes(coord);
  });
  const attackedCells = [];
  gameboard.attackedCoords.forEach((coord) => {
    const [row, col] = getRowAndCol(coord);
    const cell = board.querySelector(`[row="${row}"][col="${col}"]`);
    attackedCells.push(cell);
  });
  const hitCells = [];
  hitCoords.forEach((coord) => {
    const [row, col] = getRowAndCol(coord);
    const cell = board.querySelector(`[row="${row}"][col="${col}"]`);
    hitCells.push(cell);
  });
  attackedCells.forEach((cell) => {
    cell.classList.add("missedCell");
  });
  hitCells.forEach((cell) => {
    cell.classList.remove("missedCell");
    cell.classList.add("hitCell");
  });
}

function unrenderAllAttacks() {
  const allMissedCells = document.querySelectorAll(".missedCell");
  const allHitCells = document.querySelectorAll(".hitCell");
  for (const missedCell of allMissedCells) {
    missedCell.classList.remove("missedCell");
  }
  for (const hitCell of allHitCells) {
    hitCell.classList.remove("hitCell");
  }
}

export { renderBoards, initListeners, game };
