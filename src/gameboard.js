import {
  arraysHaveOverlap,
  cols,
  convertArrToCoord,
  getAdjacentCoords,
  getRowAndCol,
  rows,
} from "./helper";
import { createShip } from "./ship";

function createGameboard() {
  const ships = [];

  function placeShip(start, end, length, name) {
    const newShip = createShip(start, end, length, name);

    const shipCoords = [];

    // Remove coordinates from ship of the same name
    const shipsWithoutSameShip = ships.filter((ship) => {
      return ship.name !== name;
    });

    shipsWithoutSameShip.forEach((ship) => {
      ship.coords.forEach((coord) => {
        shipCoords.push(coord);
      });
    });

    if (arraysHaveOverlap(newShip.coords, shipCoords)) {
      throw new Error("Ship cannot be placed atop another ship");
    }

    // Removing ship before placing it again if already placed
    let shipIndex = ships.findIndex((ship) => {
      return ship.name === name;
    });

    if (shipIndex >= 0) {
      ships.splice(shipIndex, 1, newShip);
    } else {
      ships.push(newShip);
    }
  }

  function placePatrolBoat(start, end) {
    placeShip(start, end, 2, "Patrol Boat");
  }

  function placeSubmarine(start, end) {
    placeShip(start, end, 3, "Submarine");
  }

  function placeDestroyer(start, end) {
    placeShip(start, end, 3, "Destroyer");
  }

  function placeBattleship(start, end) {
    placeShip(start, end, 4, "Battleship");
  }

  function placeCarrier(start, end) {
    placeShip(start, end, 5, "Carrier");
  }

  // Random ship placements
  function placeShipRandomly(length, name) {
    try {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      let startArr = [x, y];
      let possibleEnds = [];
      possibleEnds.push([x - (length - 1), y]);
      possibleEnds.push([x + (length - 1), y]);
      possibleEnds.push([x, y - (length - 1)]);
      possibleEnds.push([x, y + (length - 1)]);
      let endArr = possibleEnds[Math.floor(Math.random() * 4)];

      const start = convertArrToCoord(startArr);
      const end = convertArrToCoord(endArr);

      placeShip(start, end, length, name);
    } catch (err) {
      if (
        err.message ===
          "Must enter a letter A-J followed by a number 1-10 for each coordinate like [ C7 ] or [ J10 ]." ||
        err.message === "Ship cannot be placed atop another ship"
      ) {
        placeShipRandomly(length, name);
      } else {
        throw new Error(err.message);
      }
    }
  }

  function placePatrolBoatRandomly() {
    placeShipRandomly(2, "Patrol Boat");
  }

  function placeSubmarineRandomly() {
    placeShipRandomly(3, "Submarine");
  }

  function placeDestroyerRandomly() {
    placeShipRandomly(3, "Destroyer");
  }

  function placeBattleshipRandomly() {
    placeShipRandomly(4, "Battleship");
  }

  function placeCarrierRandomly() {
    placeShipRandomly(5, "Carrier");
  }

  function placeAllShipsRandomly() {
    placePatrolBoatRandomly();
    placeSubmarineRandomly();
    placeDestroyerRandomly();
    placeBattleshipRandomly();
    placeCarrierRandomly();
  }

  function getAllShipCoords() {
    let allCoords = [];
    ships.forEach((ship) => {
      allCoords = [...allCoords, ...ship.coords];
    });
    return allCoords;
  }

  const neverAttackedCoords = [];
  // Starts with every coord on the board
  function resetNeverAttackedCoords() {
    neverAttackedCoords.length = 0;
    for (const row of rows) {
      for (const col of cols) {
        neverAttackedCoords.push(row + col);
      }
    }
  }
  resetNeverAttackedCoords();
  const attackedCoords = [];

  function receiveAttack(coord) {
    // This is just to throw an error if the argument is not a valid coord
    getRowAndCol(coord);

    if (attackedCoords.includes(coord)) {
      throw new Error(`[ ${coord} ] has already been hit.`);
    }

    attackedCoords.push(coord);
    neverAttackedCoords.splice(neverAttackedCoords.indexOf(coord), 1);

    let outputMsg = "";
    for (const ship of ships) {
      if (ship.coords.includes(coord)) {
        ship.hit();
        if (ship.isSunk()) {
          outputMsg = `sunk the ${ship.name}!`;
        } else {
          outputMsg = "landed a successful hit on a ship!";
        }
        break;
      }
    }

    return outputMsg ? outputMsg : "missed.";
  }

  function receiveAttackRandomly() {
    const randomCoord =
      neverAttackedCoords[
        Math.floor(neverAttackedCoords.length * Math.random())
      ];
    return receiveAttack(randomCoord);
  }

  // Probability Mapping
  // TODO: Move functions to helper.js, then add tests.
  const possibleShips = [];

  function resetPossibleShips() {
    possibleShips.length = 0;
    addShipPossibilities(2, "Patrol Boat");
    addShipPossibilities(3, "Submarine");
    addShipPossibilities(3, "Destroyer");
    addShipPossibilities(4, "Battleship");
    addShipPossibilities(5, "Carrier");
  }

  function addShipPossibilities(length, name) {
    addHorizontalPossibilities(length, name);
    addVerticalPossibilities(length, name);
  }

  function addHorizontalPossibilities(length, name) {
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

  function addVerticalPossibilities(length, name) {
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
  function reducePossibleShips(coord) {
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

  let probabilityMap;

  function resetProbabilityMap() {
    resetPossibleShips();
    probabilityMap = generateProbabilityMap(possibleShips);
  }
  resetProbabilityMap();

  function generateProbabilityMap(pShips) {
    const pMap = [];
    for (const ship of pShips) {
      for (const coord of ship.coords) {
        let coordCounter;
        if (pMap.length > 0) {
          coordCounter = pMap.find((coordCounter) => {
            return coordCounter.coord === coord;
          });
        } else {
          coordCounter = undefined;
        }
        if (coordCounter) {
          coordCounter.count++;
        } else {
          pMap.push({ coord: coord, count: 1 });
        }
      }
    }
    return pMap;
  }

  function reduceProbabilityMap(coord) {
    const removedPossibleShips = reducePossibleShips(coord);
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

  const hitList = [];

  let finisherMap = [];

  function generateFinisherMap() {
    const possibleFinisherShips = possibleShips.filter((ship) => {
      for (const hitCoord of hitList) {
        if (ship.coords.includes(hitCoord)) {
          return true;
        }
      }
      return false;
    });
    const fMap = generateProbabilityMap(possibleFinisherShips);
    let adjacentCoords = [];
    for (const hitCoord of hitList) {
      adjacentCoords = adjacentCoords.concat(getAdjacentCoords(hitCoord));
    }
    adjacentCoords = adjacentCoords.filter((coord) => {
      return !hitList.includes(coord);
    });
    for (const coord of adjacentCoords) {
      const coordCounter = fMap.find((coordCounter) => {
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
        for (const coordCounter of fMap) {
          const [row, col] = getRowAndCol(coordCounter.coord);
          if (row === counter.rowOrCol || col === counter.rowOrCol) {
            coordCounter.count += 100;
          }
        }
      }
    }
    return fMap;
  }

  function getAttackCoordFromMap(pMap) {
    // Find coords with most possible hits
    pMap.sort((a, b) => a.count - b.count);
    const highestCount = pMap[pMap.length - 1].count;
    const highestCoordCounters = pMap.filter((coordCounter) => {
      return coordCounter.count === highestCount;
    });
    // Randomly choose coord from coords with most hits
    return highestCoordCounters[
      Math.floor(Math.random() * highestCoordCounters.length)
    ].coord;
  }

  function receiveAttackWithProbabilityMap() {
    let attackCoord;
    if (hitList.length > 0) {
      finisherMap = generateFinisherMap();
      attackCoord = getAttackCoordFromMap(finisherMap);
    } else {
      attackCoord = getAttackCoordFromMap(probabilityMap);
    }
    // Store receiveAttack(coord) output msg
    const output = receiveAttack(attackCoord);
    // Take action based on result of attack
    if (output === "missed.") {
      reduceProbabilityMap(attackCoord);
    } else if (output === "landed a successful hit on a ship!") {
      hitList.push(attackCoord);
    } else {
      const sunkenShip = ships.find((ship) => {
        return ship.coords.includes(attackCoord);
      });
      for (const coord of sunkenShip.coords) {
        const index = hitList.indexOf(coord);
        if (index >= 0) {
          hitList.splice(index, 1);
        }
        reduceProbabilityMap(coord);
      }
    }
    // return output msg
    return output;
  }

  function resetGameboard() {
    ships.length = 0;
    resetNeverAttackedCoords();
    attackedCoords.length = 0;
    resetProbabilityMap();
  }

  return {
    ships,
    placePatrolBoat,
    placeSubmarine,
    placeDestroyer,
    placeBattleship,
    placeCarrier,
    placePatrolBoatRandomly,
    placeSubmarineRandomly,
    placeDestroyerRandomly,
    placeBattleshipRandomly,
    placeCarrierRandomly,
    placeAllShipsRandomly,
    getAllShipCoords,
    neverAttackedCoords,
    attackedCoords,
    receiveAttack,
    receiveAttackRandomly,
    receiveAttackWithProbabilityMap,
    resetGameboard,
  };
}

export { createGameboard };
