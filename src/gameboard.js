import {
  arraysHaveOverlap,
  cols,
  convertArrToCoord,
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
      throw new Error("This coordinate has already been hit.");
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

  function resetGameboard() {
    ships.length = 0;
    resetNeverAttackedCoords();
    attackedCoords.length = 0;
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
    resetGameboard,
  };
}

export { createGameboard };
