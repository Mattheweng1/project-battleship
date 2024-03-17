// Arrays of the rows and cols as labeled on the boards

const rows = "ABCDEFGHIJ".split("");
const cols = "1,2,3,4,5,6,7,8,9,10".split(",");

// Checks if a coord exists within an array of coords

function arrayContainsCoord(arr, coord) {
  return arr.some((otherCoord) => {
    return JSON.stringify(coord) === JSON.stringify(otherCoord);
  });
}

// Convert letter-number coordinate to array of indices ([0-9, 0-9])

function convertCoordToArr(coord) {
  const splitCoord = coord.split("");
  const letter = splitCoord.shift();
  const numStr = splitCoord.join("");
  if (!isRowLetter(letter) || !isColNumStr(numStr)) {
    throw new Error(
      "Must enter a letter A-J followed by a number 1-10 for each coordinate like [ C7 ] or [ J10 ]."
    );
  } else {
    const coordArr = [];
    coordArr.push(rows.indexOf(letter));
    coordArr.push(cols.indexOf(`${numStr}`));
    return coordArr;
  }
}

function isRowLetter(str) {
  return str.length === 1 && str.match(/[A-J]/i);
}

function isColNumStr(numStr) {
  if (numStr.length === 1) {
    return numStr.match(/\d/);
  } else if (numStr.length === 2) {
    return numStr === "10";
  }
}

// Log error message in Event Log

function logErrorEvent(errMsg) {
  const errorEvents = document.querySelectorAll(".errorEvent");
  const oldErrorEvent = [...errorEvents].find((errorEvent) => {
    return errorEvent.innerText === errMsg;
  });
  if (oldErrorEvent) {
    eventLog.prepend(oldErrorEvent);
    flashErrorEvent();
  } else {
    const newErrorEvent = document.createElement("div");
    newErrorEvent.classList.add("event");
    newErrorEvent.classList.add("errorEvent");
    newErrorEvent.textContent = errMsg;
    eventLog.prepend(newErrorEvent);
    flashErrorEvent();
  }
}

// Flash Event Log messages

function flashErrorEvent() {
  const firstErrorEvent = document.querySelector(".errorEvent");
  firstErrorEvent.classList.add("flashErrorEvent");
  setTimeout(() => {
    firstErrorEvent.classList.remove("flashErrorEvent");
  }, 100);
}

function flashInfoEvent() {
  const firstInfoEvent = document.querySelector(".infoEvent");
  firstInfoEvent.classList.add("flashInfoEvent");
  setTimeout(() => {
    firstInfoEvent.classList.remove("flashInfoEvent");
  }, 100);
}

export {
  rows,
  cols,
  arrayContainsCoord,
  convertCoordToArr,
  logErrorEvent,
  flashInfoEvent,
};
