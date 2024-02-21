import { createGameboard } from "./gameboard";

const gb1 = createGameboard();
const gb2 = createGameboard();

const board1 = document.getElementById("board1");
const board2 = document.getElementById("board2");

const rows = "ABCDEFGHIJ".split("");
const cols = "1,2,3,4,5,6,7,8,9,10".split(",");

for (let i = 0; i < gb1.board.length; i++) {
  for (let j = 0; j < gb1.board[0].length; j++) {
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

const rowLabelWrapper1 = document.getElementById("rowLabelWrapper1");
const colLabelWrapper1 = document.getElementById("colLabelWrapper1");

const rowLabelWrapper2 = document.getElementById("rowLabelWrapper2");
const colLabelWrapper2 = document.getElementById("colLabelWrapper2");

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
