import { createShip } from "./ship";

// Ship can take hits until it is sunk.

test("hit() increments hitsTaken", () => {
  const testShip = createShip("A1", "A5", 5, "test");
  testShip.hit();
  expect(testShip.hitsTaken).toBe(1);
  testShip.hit();
  expect(testShip.hitsTaken).toBe(2);
  testShip.hit();
  expect(testShip.hitsTaken).toBe(3);
});

test("isSunk() returns false before taking any hits", () => {
  const testShip = createShip("A1", "A5", 5, "test");
  expect(testShip.isSunk()).toBe(false);
});

test("isSunk() returns false until it's sunk", () => {
  const testShip = createShip("A1", "A5", 5, "test");
  testShip.hit();
  expect(testShip.isSunk()).toBe(false);
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
  const testShip = createShip("A1", "A5", 5, "test");
  testShip.hit();
  expect(testShip.hitsTaken).toBe(1);
  testShip.hit();
  expect(testShip.hitsTaken).toBe(2);
  testShip.hit();
  expect(testShip.hitsTaken).toBe(3);
  expect(testShip.isSunk()).toBe(false);
  testShip.hit();
  expect(testShip.hitsTaken).toBe(4);
  expect(testShip.isSunk()).toBe(false);
  testShip.hit();
  expect(testShip.hitsTaken).toBe(5);
  expect(testShip.isSunk()).toBe(true);
  testShip.hit();
  expect(testShip.hitsTaken).toBe(5);
  expect(testShip.isSunk()).toBe(true);
});

test("Ship has the name given to it", () => {
  const testShip = createShip("A1", "A5", 5, "test");
  expect(testShip.name).toBe("test");
});

test("Ship generates correct coords horizontally", () => {
  const testShip = createShip("A1", "A5", 5, "test");
  expect(testShip.coords).toEqual(["A1", "A2", "A3", "A4", "A5"]);
});

test("Ship generates correct coords vertically", () => {
  const testShip = createShip("D5", "A5", 4, "test");
  expect(testShip.coords).toEqual(["A5", "B5", "C5", "D5"]);
});

test("Coordinates not in line throw an error", () => {
  expect(() => createShip("B2", "E5", 4, "test")).toThrow(
    "Coordinates must be vertically or horizontally in line"
  );
});

test("Coordinates must create the correct length for the ship", () => {
  expect(() => createShip("B2", "B5", 17, "Super Long Ship")).toThrow(
    "Super Long Ship length must be 17"
  );
});
