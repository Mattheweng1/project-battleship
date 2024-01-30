import { createShip } from "./ship";

// Ship can take hits until it is sunk.

test("hit() increments hitsTaken", () => {
  const testShip = createShip(4);
  testShip.hit();
  expect(testShip.hitsTaken).toBe(1);
  testShip.hit();
  expect(testShip.hitsTaken).toBe(2);
  testShip.hit();
  expect(testShip.hitsTaken).toBe(3);
});

test("isSunk() returns false before taking any hits", () => {
  const testShip = createShip(4);
  expect(testShip.isSunk()).toBe(false);
});

test("isSunk() returns false until it's sunk", () => {
  const testShip = createShip(4);
  testShip.hit();
  expect(testShip.isSunk()).toBe(false);
  testShip.hit();
  expect(testShip.isSunk()).toBe(false);
  testShip.hit();
  expect(testShip.isSunk()).toBe(false);
  testShip.hit();
  expect(testShip.isSunk()).toBe(true);
});

test("hit() stops incrementing hitsTaken after isSunk() returns true", () => {
  const testShip = createShip(4);
  testShip.hit();
  expect(testShip.hitsTaken).toBe(1);
  testShip.hit();
  expect(testShip.hitsTaken).toBe(2);
  testShip.hit();
  expect(testShip.hitsTaken).toBe(3);
  expect(testShip.isSunk()).toBe(false);
  testShip.hit();
  expect(testShip.hitsTaken).toBe(4);
  expect(testShip.isSunk()).toBe(true);
  testShip.hit();
  expect(testShip.hitsTaken).toBe(4);
  expect(testShip.isSunk()).toBe(true);
});
