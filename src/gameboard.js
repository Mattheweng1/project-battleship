import { createShip } from "./ship";

function createGameboard() {
  let board = newBoard(10, 10);

  function newBoard(rows, columns) {
    return Array.from(Array(rows), () =>
      new Array(columns).fill({ hasShip: false, hasBeenAttacked: false })
    );
  }

  const ships = [];

  function placeShip(start, end, length, name) {
    if (
      start[0] < 0 ||
      start[1] < 0 ||
      end[0] < 0 ||
      end[1] < 0 ||
      start[0] > 9 ||
      start[1] > 9 ||
      end[0] > 9 ||
      end[1] > 9
    ) {
      throw new Error("Ship cannot be placed outside of the board");
    }

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

    if (
      newShip.coords.some((newCoord) => {
        return arrayContainsCoord(shipCoords, newCoord);
      })
    ) {
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
      let start = [x, y];
      let possibleEnds = [];
      possibleEnds.push([x - (length - 1), y]);
      possibleEnds.push([x + (length - 1), y]);
      possibleEnds.push([x, y - (length - 1)]);
      possibleEnds.push([x, y + (length - 1)]);
      let end = possibleEnds[Math.floor(Math.random() * 4)];

      placeShip(start, end, length, name);
    } catch (err) {
      if (
        err.message === "Ship cannot be placed outside of the board" ||
        err.message === "Ship cannot be placed atop another ship"
      ) {
        placeShipRandomly(length, name);
      } else {
        console.error(err);
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

  function confirmShipPlacements() {
    ships.forEach((ship) => {
      ship.coords.forEach((coord) => {
        board[coord[0]][coord[1]].hasShip = true;
      });
    });
  }

  function receiveAttack(coord) {
    board[coord[0]][coord[1]].hasBeenAttacked = true;
  }

  function resetBoard(resetShips, resetAttacks) {
    board.forEach((coordY) => {
      coordY.forEach((coordX) => {
        if (resetShips) {
          coordX.hasShip = false;
        }
        if (resetAttacks) {
          coordX.hasBeenAttacked = false;
        }
      });
    });
  }

  // Helper functions

  function arrayContainsCoord(arr, coord) {
    return arr.some((otherCoord) => {
      return JSON.stringify(coord) === JSON.stringify(otherCoord);
    });
  }

  return {
    board,
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
    confirmShipPlacements,
    receiveAttack,
    resetBoard,
  };
}

export { createGameboard };
