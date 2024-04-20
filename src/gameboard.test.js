import { createGameboard } from "./gameboard";

// Testing ship placements

test("Placing a ship outside of the matrix throws an error", () => {
  const testGameboard = createGameboard();
  expect(() => testGameboard.placeCarrier("A1", "A12")).toThrow(
    "Must enter a letter A-J followed by a number 1-10 for each coordinate like [ C7 ] or [ J10 ]."
  );
});

test("Placing a ship stores the ship in the 'ships' array", () => {
  const testGameboard = createGameboard();
  testGameboard.placeBattleship("A4", "D4");
  expect(testGameboard.ships[0].name).toBe("Battleship");
});

test("Placing a ship overlapping another ship throws an error", () => {
  const testGameboard = createGameboard();
  testGameboard.placeBattleship("A4", "D4");
  expect(() => testGameboard.placeCarrier("A1", "A5")).toThrow(
    "Ship cannot be placed atop another ship"
  );
});

test("Placing a ship with the name of a ship that is already placed will replace that ship, even if it overlaps the old location", () => {
  const testGameboard = createGameboard();
  testGameboard.placeCarrier("A4", "E4");
  testGameboard.placeCarrier("A4", "A8");
  expect(testGameboard.ships.length).toBe(1);
  expect(testGameboard.ships[0].length).toBe(5);
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

// Attack related tests

test("neverAttackedCoord starts with all coords on the board", () => {
  const testGameboard = createGameboard();
  expect(testGameboard.neverAttackedCoords.length).toEqual(100);
  expect(testGameboard.neverAttackedCoords[0]).toEqual("A1");
  expect(testGameboard.neverAttackedCoords[99]).toEqual("J10");
});

test("receiveAttack() removes coord from neverAttackedCoords", () => {
  const testGameboard = createGameboard();
  testGameboard.receiveAttack("A1");
  expect(testGameboard.neverAttackedCoords.length).toEqual(99);
  expect(testGameboard.neverAttackedCoords.includes("A1")).toEqual(false);
});

test("receiveAttack() adds coord to attackedCoords", () => {
  const testGameboard = createGameboard();
  testGameboard.receiveAttack("A1");
  expect(testGameboard.attackedCoords[0]).toEqual("A1");
});

test("receiveAttack() returns output message", () => {
  const testGameboard = createGameboard();
  expect(testGameboard.receiveAttack("A1")).toEqual("missed.");
  testGameboard.placePatrolBoat("A2", "A3");
  expect(testGameboard.receiveAttack("A2")).toEqual(
    "landed a successful hit on a ship!"
  );
  expect(testGameboard.receiveAttack("A3")).toEqual("sunk the Patrol Boat!");
});

test("receiveAttack() with invalid input throws error", () => {
  const testGameboard = createGameboard();
  expect(() => testGameboard.receiveAttack("A12")).toThrow(
    "Must enter a letter A-J followed by a number 1-10 for each coordinate like [ C7 ] or [ J10 ]."
  );
});

test("receiveAttack() on repeat coord throws error", () => {
  const testGameboard = createGameboard();
  testGameboard.receiveAttack("A1");
  expect(() => testGameboard.receiveAttack("A1")).toThrow(
    "[ A1 ] has already been hit."
  );
  expect(testGameboard.attackedCoords.length).toEqual(1);
});

test("receiveAttackRandomly() attacks random coord", () => {
  const testGameboard = createGameboard();
  testGameboard.receiveAttackRandomly();
  expect(testGameboard.attackedCoords.length).toEqual(1);
  for (let i = 0; i < 98; i++) {
    testGameboard.receiveAttackRandomly();
  }
  expect(testGameboard.attackedCoords.length).toEqual(99);
});

// receiveAttackWithProbabilityMap() tests
// Composed of functions tested in helper.js

test("receiveAttackWithProbabilityMap() successfully attacks coords", () => {
  const testGameboard = createGameboard();
  for (let i = 0; i < 9; i++) {
    testGameboard.receiveAttackWithProbabilityMap();
  }
  expect(testGameboard.attackedCoords.length).toEqual(9);
});

test("receiveAttackWithProbabilityMap() successfully finishes ships after hitting", () => {
  for (let j = 0; j < 49; j++) {
    const testGameboard = createGameboard();
    testGameboard.placeCarrier("E5", "E9");
    for (let i = 0; i < 9; i++) {
      testGameboard.receiveAttackWithProbabilityMap();
    }
    expect(testGameboard.ships[0].isSunk()).toEqual(true);
  }
});

// resetGameboard() tests

test("resetGameboard() resets ships, neverAttackedCoords, and attackedCoords", () => {
  const testGameboard = createGameboard();
  testGameboard.placeAllShipsRandomly();
  expect(testGameboard.ships.length).toEqual(5);
  for (let i = 0; i < 30; i++) {
    testGameboard.receiveAttackRandomly();
  }
  expect(testGameboard.attackedCoords.length).toEqual(30);
  expect(testGameboard.neverAttackedCoords.length).toEqual(70);
  testGameboard.resetGameboard();
  expect(testGameboard.ships.length).toEqual(0);
  expect(testGameboard.attackedCoords.length).toEqual(0);
  expect(testGameboard.neverAttackedCoords.length).toEqual(100);
});
