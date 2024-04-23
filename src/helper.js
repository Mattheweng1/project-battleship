import { createShip } from "./ship";

const eventLog = document.getElementById("eventLog");

// Arrays of the rows and cols as labeled on the boards

const rows = "ABCDEFGHIJ".split("");
const cols = "1,2,3,4,5,6,7,8,9,10".split(",");

// Checks if arrays have any overlap and returns a boolean

function arraysHaveOverlap(arr1, arr2) {
  return [...new Set(arr1.concat(arr2))].length !== arr1.concat(arr2).length;
}

// Convert array of indices to letter-number coord

function convertArrToCoord(coordArr) {
  return rows[coordArr[0]] + cols[coordArr[1]];
}

// Convert letter-number coordinate to array of indices ([0-9, 0-9])

function convertCoordToArr(coord) {
  const [row, col] = getRowAndCol(coord);

  const coordArr = [];
  coordArr.push(rows.indexOf(row));
  coordArr.push(cols.indexOf(col));
  return coordArr;
}

function getRowAndCol(coord) {
  const splitCoord = coord.split("");
  const row = splitCoord.shift();
  const col = splitCoord.join("");

  if (!isRow(row) || !isCol(col)) {
    throw new Error(
      "Must enter a letter A-J followed by a number 1-10 for each coordinate like [ C7 ] or [ J10 ]."
    );
  }

  return [row, col];
}

function isRow(str) {
  return str.length === 1 && str.match(/[A-J]/i);
}

function isCol(numStr) {
  if (numStr.length === 1) {
    return numStr.match(/\d/);
  } else if (numStr.length === 2) {
    return numStr === "10";
  }
}

function getAdjacentCoords(coord) {
  const coordArr = convertCoordToArr(coord);
  const adjacentCoords = [];
  if (coordArr[0] > 0) {
    adjacentCoords.push(rows[coordArr[0] - 1] + cols[coordArr[1]]);
  }
  if (coordArr[0] < 9) {
    adjacentCoords.push(rows[coordArr[0] + 1] + cols[coordArr[1]]);
  }
  if (coordArr[1] > 0) {
    adjacentCoords.push(rows[coordArr[0]] + cols[coordArr[1] - 1]);
  }
  if (coordArr[1] < 9) {
    adjacentCoords.push(rows[coordArr[0]] + cols[coordArr[1] + 1]);
  }
  return adjacentCoords;
}

// Probability Mapping

function resetPossibleShips(possibleShips) {
  possibleShips.length = 0;
  addShipPossibilities(2, "Patrol Boat", possibleShips);
  addShipPossibilities(3, "Submarine", possibleShips);
  addShipPossibilities(3, "Destroyer", possibleShips);
  addShipPossibilities(4, "Battleship", possibleShips);
  addShipPossibilities(5, "Carrier", possibleShips);
}

function addShipPossibilities(length, name, possibleShips) {
  addHorizontalPossibilities(length, name, possibleShips);
  addVerticalPossibilities(length, name, possibleShips);
}

function addHorizontalPossibilities(length, name, possibleShips) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 11 - length; j++) {
      possibleShips.push(
        createShip(
          rows[i] + cols[j],
          rows[i] + cols[j + length - 1],
          length,
          name
        )
      );
    }
  }
}

function addVerticalPossibilities(length, name, possibleShips) {
  for (let i = 0; i < 11 - length; i++) {
    for (let j = 0; j < 10; j++) {
      possibleShips.push(
        createShip(
          rows[i] + cols[j],
          rows[i + length - 1] + cols[j],
          length,
          name
        )
      );
    }
  }
}
function reducePossibleShips(coord, possibleShips) {
  const removedPossibleShips = [];
  const shipsForRemoval = [];
  for (const ship of possibleShips) {
    if (ship.coords.includes(coord)) {
      removedPossibleShips.push(ship);
      shipsForRemoval.push(ship);
    }
  }
  for (const ship of shipsForRemoval) {
    possibleShips.splice(possibleShips.indexOf(ship), 1);
  }
  return removedPossibleShips;
}

function generateProbabilityMap(possibleShips) {
  const probabilityMap = [];
  for (const ship of possibleShips) {
    for (const coord of ship.coords) {
      let coordCounter;
      if (probabilityMap.length > 0) {
        coordCounter = probabilityMap.find((coordCounter) => {
          return coordCounter.coord === coord;
        });
      } else {
        coordCounter = undefined;
      }
      if (coordCounter) {
        coordCounter.count++;
      } else {
        probabilityMap.push({ coord: coord, count: 1 });
      }
    }
  }
  return probabilityMap;
}

function resetPossibleShipsAndProbabilityMap(possibleShips, probabilityMap) {
  resetPossibleShips(possibleShips);
  probabilityMap.length = 0;
  for (const counter of generateProbabilityMap(possibleShips)) {
    probabilityMap.push(counter);
  }
}

function reduceProbabilityMap(coord, possibleShips, probabilityMap) {
  const removedPossibleShips = reducePossibleShips(coord, possibleShips);
  for (const ship of removedPossibleShips) {
    for (const coord of ship.coords) {
      const coordCounter = probabilityMap.find((coordCounter) => {
        return coordCounter.coord === coord;
      });
      if (coordCounter) {
        if (coordCounter.count > 1) {
          coordCounter.count--;
        } else {
          probabilityMap.splice(probabilityMap.indexOf(coordCounter), 1);
        }
      } else {
        throw new Error("Could not find coordCounter in probabilityMap.");
      }
    }
  }
}

function generateFinisherMap(possibleShips, hitList) {
  const possibleFinisherShips = possibleShips.filter((ship) => {
    for (const hitCoord of hitList) {
      if (ship.coords.includes(hitCoord)) {
        return true;
      }
    }
    return false;
  });
  const finisherMap = generateProbabilityMap(possibleFinisherShips);
  let adjacentCoords = [];
  for (const hitCoord of hitList) {
    adjacentCoords = adjacentCoords.concat(getAdjacentCoords(hitCoord));
  }
  adjacentCoords = adjacentCoords.filter((coord) => {
    return !hitList.includes(coord);
  });
  for (const coord of adjacentCoords) {
    const coordCounter = finisherMap.find((coordCounter) => {
      return coordCounter.coord === coord;
    });
    if (coordCounter) {
      coordCounter.count += 1000;
    }
  }
  if (hitList.length > 1) {
    const rowOrColCounters = [];
    for (const hitCoord of hitList) {
      const [row, col] = getRowAndCol(hitCoord);
      const rowCounter = rowOrColCounters.find((counter) => {
        return counter.rowOrCol === row;
      });
      const colCounter = rowOrColCounters.find((counter) => {
        return counter.rowOrCol === col;
      });
      if (rowCounter) {
        rowCounter.count++;
      } else {
        rowOrColCounters.push({ rowOrCol: row, count: 1 });
      }
      if (colCounter) {
        colCounter.count++;
      } else {
        rowOrColCounters.push({ rowOrCol: col, count: 1 });
      }
    }
    const multipleRowOrColCounters = rowOrColCounters.filter((counter) => {
      return counter.count > 1;
    });
    for (const counter of multipleRowOrColCounters) {
      for (const coordCounter of finisherMap) {
        const [row, col] = getRowAndCol(coordCounter.coord);
        if (row === counter.rowOrCol || col === counter.rowOrCol) {
          coordCounter.count += 100;
        }
      }
    }
  }
  return finisherMap;
}

function getAttackCoordFromMap(probabilityMap) {
  // Find coords with most possible hits
  probabilityMap.sort((a, b) => a.count - b.count);
  const highestCount = probabilityMap[probabilityMap.length - 1].count;
  const highestCoordCounters = probabilityMap.filter((coordCounter) => {
    return coordCounter.count === highestCount;
  });
  // Randomly choose coord from coords with most hits
  return highestCoordCounters[
    Math.floor(Math.random() * highestCoordCounters.length)
  ].coord;
}

// Log messages in Event Log

function logErrorEvent(errMsg) {
  const errorEvents = document.querySelectorAll(".errorEvent");
  const oldErrorEvent = [...errorEvents].find((errorEvent) => {
    return errorEvent.innerText === errMsg;
  });
  if (oldErrorEvent) {
    eventLog.prepend(oldErrorEvent);
    flashClassEvent("errorEvent");
  } else {
    const newErrorEvent = document.createElement("div");
    newErrorEvent.classList.add("event");
    newErrorEvent.classList.add("errorEvent");
    newErrorEvent.textContent = errMsg;
    eventLog.prepend(newErrorEvent);
    flashClassEvent("errorEvent");
  }
}

function logTurnEvent(turn, msg) {
  const newTurnEvent = document.createElement("div");
  newTurnEvent.classList.add("event");
  newTurnEvent.classList.add("turnEvent");
  newTurnEvent.innerText = turn + "  :  " + msg;
  eventLog.prepend(newTurnEvent);
  flashClassEvent("turnEvent");
}

function logInfoEvent(msg) {
  const newInfoEvent = document.createElement("div");
  newInfoEvent.classList.add("event");
  newInfoEvent.classList.add("infoEvent");
  newInfoEvent.innerText = msg;
  eventLog.prepend(newInfoEvent);
  flashClassEvent("infoEvent");
}

// Flash Event Log messages

function flashClassEvent(className) {
  const firstClassEvent = document.querySelector("." + className);
  eventLog.prepend(firstClassEvent);
  firstClassEvent.classList.add("flash");
  setTimeout(() => {
    firstClassEvent.classList.remove("flash");
  }, 100);
  firstClassEvent.scrollIntoView(false);
}

export {
  rows,
  cols,
  arraysHaveOverlap,
  convertArrToCoord,
  convertCoordToArr,
  getRowAndCol,
  getAdjacentCoords,
  // Probability Mapping
  generateProbabilityMap,
  resetPossibleShipsAndProbabilityMap,
  reduceProbabilityMap,
  generateFinisherMap,
  getAttackCoordFromMap,
  // Error Logging
  logErrorEvent,
  logTurnEvent,
  logInfoEvent,
  flashClassEvent,
};
