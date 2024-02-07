import { createShip } from "./ship";

// Ship can take hits until it is sunk.

test("hit() increments hitsTaken", () => {
  const testShip = createShip([0, 0], [0, 4], 5, "test");
  testShip.hit();
  expect(testShip.hitsTaken).toBe(1);
  testShip.hit();
  expect(testShip.hitsTaken).toBe(2);
  testShip.hit();
  expect(testShip.hitsTaken).toBe(3);
});

test("isSunk() returns false before taking any hits", () => {
  const testShip = createShip([0, 0], [0, 4], 5, "test");
  expect(testShip.isSunk()).toBe(false);
});

test("isSunk() returns false until it's sunk", () => {
  const testShip = createShip([0, 0], [0, 4], 5, "test");
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
  const testShip = createShip([0, 0], [0, 4], 5, "test");
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
  const testShip = createShip([0, 0], [0, 4], 5, "test");
  expect(testShip.name).toBe("test");
});

test("Ship generates correct coords horizontally", () => {
  const testShip = createShip([0, 0], [0, 4], 5, "test");
  expect(testShip.coords).toEqual([
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
  ]);
});

test("Ship generates correct coords vertically", () => {
  const testShip = createShip([3, 4], [0, 4], 4, "test");
  expect(testShip.coords).toEqual([
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
  ]);
});

test("Coordinates not in line throw an error", () => {
  expect(() => createShip([1, 1], [4, 4], 4, "test")).toThrow(
    "Coordinates must be vertically or horizontally in line"
  );
});

test("Coordinates must create the correct length for the ship", () => {
  expect(() => createShip([1, 1], [1, 4], 17, "test")).toThrow(
    "Ship length must be 17"
  );
});
