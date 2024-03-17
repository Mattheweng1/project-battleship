import { rows, cols, arrayContainsCoord, convertCoordToArr } from "./helper.js";

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

test("arrayContainsCoord() can determine whether an equivalent object exists within an array", () => {
  const testArr = [
    [1, 2],
    [3, 4],
    [5, 6],
  ];
  const testCoord1 = [3, 4];
  const testCoord2 = [1, 6];
  expect(arrayContainsCoord(testArr, testCoord1)).toBe(true);
  expect(arrayContainsCoord(testArr, testCoord2)).toBe(false);
});

test("convertCoordToArr() converts letter-number coord to '[num, num]' coord", () => {
  const letterNumCoord1 = "A1";
  const letterNumCoord2 = "J10";
  const letterNumCoord3 = "S3";
  const letterNumCoord4 = "D12";
  const letterNumCoord5 = "DD";
  const letterNumCoord6 = "36";
  expect(convertCoordToArr(letterNumCoord1)).toEqual([0, 0]);
  expect(convertCoordToArr(letterNumCoord2)).toEqual([9, 9]);
  expect(() => convertCoordToArr(letterNumCoord3)).toThrow(
    "Must enter a letter A-J followed by a number 1-10 for each coordinate like [ C7 ] or [ J10 ]."
  );
  expect(() => convertCoordToArr(letterNumCoord4)).toThrow(
    "Must enter a letter A-J followed by a number 1-10 for each coordinate like [ C7 ] or [ J10 ]."
  );
  expect(() => convertCoordToArr(letterNumCoord5)).toThrow(
    "Must enter a letter A-J followed by a number 1-10 for each coordinate like [ C7 ] or [ J10 ]."
  );
  expect(() => convertCoordToArr(letterNumCoord6)).toThrow(
    "Must enter a letter A-J followed by a number 1-10 for each coordinate like [ C7 ] or [ J10 ]."
  );
});
