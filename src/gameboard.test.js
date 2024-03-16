import { createGameboard } from "./gameboard";

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

test("receiveAttack() changes the attackedCoords", () => {
  const testGameboard = createGameboard();
  testGameboard.receiveAttack([0, 0]);
  expect(testGameboard.attackedCoords[0]).toEqual([0, 0]);
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

// Able to getAllShipCoords() in one array

test("Calling placePatrolBoatRandomly(), and then getting all ship coords returns 2 coords", () => {
  const testGameboard = createGameboard();
  testGameboard.placePatrolBoatRandomly();
  expect(testGameboard.getAllShipCoords().length).toBe(2);
});

test("Calling placeAllShipsRandomly(), and then getting all ship coords returns 17 coords", () => {
  const testGameboard = createGameboard();
  testGameboard.placeAllShipsRandomly();
  expect(testGameboard.getAllShipCoords().length).toBe(17);
});
