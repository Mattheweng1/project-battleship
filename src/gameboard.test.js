import { createGameboard } from "./gameboard";

// Gameboard tracks whether a coordinate is empty or has a ship on it, and whether the coordinate has been attacked or not. It can also place ships, make coordinates receive attacks, and determine whether or not all ships have been sunk.

test("Gameboard contains a 10 by 10 matrix", () => {
  const testGameboard = createGameboard();
  expect(testGameboard.board.length).toEqual(10);
  expect(testGameboard.board.every((row) => row.length === 10)).toBe(true);
});

test("Gameboard coordinates contain objects that tell whether they contain a ship or have been attacked", () => {
  const testGameboard = createGameboard();
  expect(testGameboard.board[0][0]).toEqual({
    hasShip: false,
    hasBeenAttacked: false,
  });
  testGameboard.board[0][0].hasShip = true;
  testGameboard.board[0][0].hasBeenAttacked = true;
  expect(testGameboard.board[0][0]).toEqual({
    hasShip: true,
    hasBeenAttacked: true,
  });
});

test("Gameboard coordinates contain objects that can be updated independently", () => {
  const testGameboard = createGameboard();
  expect(testGameboard.board[0][0]).toEqual({
    hasShip: false,
    hasBeenAttacked: false,
  });
  testGameboard.board[0][0].hasShip = true;
  testGameboard.board[0][0].hasBeenAttacked = true;
  expect(testGameboard.board[0][0]).toEqual({
    hasShip: true,
    hasBeenAttacked: true,
  });
  expect(testGameboard.board[1][0]).toEqual({
    hasShip: false,
    hasBeenAttacked: false,
  });
  expect(testGameboard.board[9][9]).toEqual({
    hasShip: false,
    hasBeenAttacked: false,
  });
});

test("Placing a ship outside of the matrix throws an error", () => {
  const testGameboard = createGameboard();
  expect(() => testGameboard.placeCarrier([0, 0], [0, -4])).toThrow(
    "Ship cannot be placed outside of the board"
  );
});

test("Placing a ship stores the ship in the 'ships' array", () => {
  const testGameboard = createGameboard();
  testGameboard.placeBattleship([0, 3], [3, 3]);
  expect(testGameboard.ships[0].name).toBe("Battleship");
});

test("Placing a ship overlapping another ship throws an error", () => {
  const testGameboard = createGameboard();
  testGameboard.placeBattleship([0, 3], [3, 3]);
  expect(() => testGameboard.placeCarrier([0, 0], [0, 4])).toThrow(
    "Ship cannot be placed atop another ship"
  );
});

test("Placing a ship with the name of a ship that is already placed will replace that ship, even if it overlaps the old location", () => {
  const testGameboard = createGameboard();
  testGameboard.placeCarrier([0, 3], [4, 3]);
  testGameboard.placeCarrier([0, 3], [0, 7]);
  expect(testGameboard.ships.length).toBe(1);
  expect(testGameboard.ships[0].length).toBe(5);
});

test("Confirming ship placements changes the board", () => {
  const testGameboard = createGameboard();
  testGameboard.placeBattleship([0, 3], [3, 3]);
  expect(testGameboard.board[0][3].hasShip).toBe(false);
  expect(testGameboard.board[1][3].hasShip).toBe(false);
  expect(testGameboard.board[2][3].hasShip).toBe(false);
  testGameboard.confirmShipPlacements();
  expect(testGameboard.board[0][3].hasShip).toBe(true);
  expect(testGameboard.board[1][3].hasShip).toBe(true);
  expect(testGameboard.board[2][3].hasShip).toBe(true);
});

test("Reset board will undo confirming ship placements", () => {
  const testGameboard = createGameboard();
  testGameboard.placeBattleship([0, 3], [3, 3]);
  expect(testGameboard.board[0][3].hasShip).toBe(false);
  expect(testGameboard.board[1][3].hasShip).toBe(false);
  expect(testGameboard.board[2][3].hasShip).toBe(false);
  testGameboard.confirmShipPlacements();
  expect(testGameboard.board[0][3].hasShip).toBe(true);
  expect(testGameboard.board[1][3].hasShip).toBe(true);
  expect(testGameboard.board[2][3].hasShip).toBe(true);
  testGameboard.resetBoard(true, true);
  expect(testGameboard.board[0][3].hasShip).toBe(false);
  expect(testGameboard.board[1][3].hasShip).toBe(false);
  expect(testGameboard.board[2][3].hasShip).toBe(false);
});

test("receiveAttack() changes the board", () => {
  const testGameboard = createGameboard();
  expect(testGameboard.board[0][0].hasBeenAttacked).toBe(false);
  testGameboard.receiveAttack([0, 0]);
  expect(testGameboard.board[0][0].hasBeenAttacked).toBe(true);
});

test("reset board will undo attack", () => {
  const testGameboard = createGameboard();
  testGameboard.receiveAttack([0, 0]);
  expect(testGameboard.board[0][0].hasBeenAttacked).toBe(true);
  testGameboard.resetBoard(true, true);
  expect(testGameboard.board[0][0].hasBeenAttacked).toBe(false);
});

// Testing random ship placements

test("placePatrolBoatRandomly() places one patrol boat", () => {
  const testGameboard = createGameboard();
  testGameboard.placePatrolBoatRandomly();
  expect(testGameboard.ships.length).toBe(1);
  expect(testGameboard.ships[0].name).toBe("Patrol Boat");
});

test("placeAllShipsRandomly() places all ships", () => {
  const testGameboard = createGameboard();
  testGameboard.placeAllShipsRandomly();
  expect(testGameboard.ships.length).toBe(5);
  expect(testGameboard.ships[0].name).toBe("Patrol Boat");
  expect(testGameboard.ships[1].name).toBe("Submarine");
  expect(testGameboard.ships[2].name).toBe("Destroyer");
  expect(testGameboard.ships[3].name).toBe("Battleship");
  expect(testGameboard.ships[4].name).toBe("Carrier");
});

test("Calling placeAllShipsRandomly() twice, still only places one of each ship", () => {
  const testGameboard = createGameboard();
  testGameboard.placeAllShipsRandomly();
  testGameboard.placeAllShipsRandomly();
  expect(testGameboard.ships.length).toBe(5);
  expect(testGameboard.ships[0].name).toBe("Patrol Boat");
  expect(testGameboard.ships[1].name).toBe("Submarine");
  expect(testGameboard.ships[2].name).toBe("Destroyer");
  expect(testGameboard.ships[3].name).toBe("Battleship");
  expect(testGameboard.ships[4].name).toBe("Carrier");
});
