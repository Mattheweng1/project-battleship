import {
  rows,
  cols,
  arraysHaveOverlap,
  convertArrToCoord,
  convertCoordToArr,
  getRowAndCol,
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
