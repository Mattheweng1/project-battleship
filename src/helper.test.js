import {
  rows,
  cols,
  arraysHaveOverlap,
  convertArrToCoord,
  convertCoordToArr,
  getRowAndCol,
  resetPossibleShipsAndProbabilityMap,
  generateProbabilityMap,
  reduceProbabilityMap,
  generateFinisherMap,
  getAttackCoordFromMap,
} from "./helper.js";

test("rows[0] is 'A', rows[9] is 'J', and rows.length is 10", () => {
  expect(rows[0]).toBe("A");
  expect(rows[9]).toBe("J");
  expect(rows.length).toBe(10);
});

test("cols[0] is '1', cols[9] is '10', and cols.length is 10", () => {
  expect(cols[0]).toBe("1");
  expect(cols[9]).toBe("10");
  expect(cols.length).toBe(10);
});

test("arraysHaveOverlap() returns correct boolean", () => {
  const arr1 = [1, 2, 3, 4, 5, 6];
  const arr2 = [6, 7, 8, 9];
  const arr3 = [10, 13];
  expect(arraysHaveOverlap(arr1, arr2)).toBe(true);
  expect(arraysHaveOverlap(arr1, arr3)).toBe(false);
});

test("convertArrToCoord() converts '[num, num]' coord to letter-number coord", () => {
  expect(convertArrToCoord([0, 0])).toEqual("A1");
  expect(convertArrToCoord([9, 9])).toEqual("J10");
});

test("convertCoordToArr() converts letter-number coord to '[num, num]' coord", () => {
  expect(convertCoordToArr("A1")).toEqual([0, 0]);
  expect(convertCoordToArr("J10")).toEqual([9, 9]);
});

test("getRowAndCol() takes a letter-number coord and returns an array with the row and col", () => {
  expect(getRowAndCol("A1")).toEqual(["A", "1"]);
  expect(getRowAndCol("J10")).toEqual(["J", "10"]);
});

test("getRowAndCol() throws an error when the argument is an invalid coord", () => {
  expect(() => getRowAndCol("S3")).toThrow(
    "Must enter a letter A-J followed by a number 1-10 for each coordinate like [ C7 ] or [ J10 ]."
  );
  expect(() => getRowAndCol("D12")).toThrow(
    "Must enter a letter A-J followed by a number 1-10 for each coordinate like [ C7 ] or [ J10 ]."
  );
  expect(() => getRowAndCol("DD")).toThrow(
    "Must enter a letter A-J followed by a number 1-10 for each coordinate like [ C7 ] or [ J10 ]."
  );
  expect(() => getRowAndCol("36")).toThrow(
    "Must enter a letter A-J followed by a number 1-10 for each coordinate like [ C7 ] or [ J10 ]."
  );
});

// Probabibility Mapping tests

test("generateProbabilityMap() creates a probability map from an array of possible ships", () => {
  const possibleShips = [
    { coords: ["E6", "E7"] },
    { coords: ["E6", "F6"] },
    { coords: ["E5", "E6"] },
    { coords: ["D6", "E6"] },
  ];
  expect(generateProbabilityMap(possibleShips)).toEqual([
    { coord: "E6", count: 4 },
    { coord: "E7", count: 1 },
    { coord: "F6", count: 1 },
    { coord: "E5", count: 1 },
    { coord: "D6", count: 1 },
  ]);
});

test("resetPossibleShipsAndProbabilityMap() generates possibleShips and probabilityMap", () => {
  const possibleShips = [];
  const probabilityMap = [];
  resetPossibleShipsAndProbabilityMap(possibleShips, probabilityMap);
  expect(possibleShips.length).toEqual(760);
  expect(Object.hasOwn(possibleShips[380], "name")).toEqual(true);
  expect(Object.hasOwn(possibleShips[380], "coords")).toEqual(true);
  expect(Object.hasOwn(possibleShips[380], "length")).toEqual(true);
  expect(Object.hasOwn(possibleShips[380], "hitsTaken")).toEqual(true);
  expect(possibleShips[380].name).toEqual("Destroyer");
  expect(probabilityMap.length).toEqual(100);
  expect(probabilityMap[50]).toEqual({ coord: "F1", count: 22 });
});

test("reduceProbabilityMap() removes possible ships that contain a coord and then updates probability map", () => {
  const possibleShips = [];
  const probabilityMap = [];
  resetPossibleShipsAndProbabilityMap(possibleShips, probabilityMap);
  expect(possibleShips.length).toEqual(760);
  expect(probabilityMap.length).toEqual(100);
  reduceProbabilityMap("E5", possibleShips, probabilityMap);
  expect(possibleShips.length).toEqual(726);
  expect(probabilityMap.length).toEqual(99);
  reduceProbabilityMap("G7", possibleShips, probabilityMap);
  expect(possibleShips.length).toEqual(694);
  expect(probabilityMap.length).toEqual(98);
});

test("generateFinisherMap() creates a probability map for finishing off a ship that has already been hit", () => {
  const possibleShips = [];
  const probabilityMap = [];
  const hitList = ["E5"];
  resetPossibleShipsAndProbabilityMap(possibleShips, probabilityMap);
  expect(generateFinisherMap(possibleShips, hitList).length).toEqual(17);
  const hitList2 = ["E5", "E6"];
  resetPossibleShipsAndProbabilityMap(possibleShips, probabilityMap);
  expect(generateFinisherMap(possibleShips, hitList2).length).toEqual(26);
});

test("getAttackCoordFromMap() returns a coord with the highest probability from a probability map", () => {
  const possibleShips = [];
  const probabilityMap = [];
  const hitList = ["D5", "E5"];
  resetPossibleShipsAndProbabilityMap(possibleShips, probabilityMap);
  reduceProbabilityMap("E5", possibleShips, probabilityMap);
  expect(getAttackCoordFromMap(probabilityMap)).toEqual("F6");
  expect(
    getAttackCoordFromMap(generateFinisherMap(possibleShips, hitList))
  ).toEqual("C5");
});
