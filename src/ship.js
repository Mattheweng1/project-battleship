import { convertArrToCoord, convertCoordToArr } from "./helper";

function createShip(start, end, length, name) {
  const startArr = convertCoordToArr(start);
  const endArr = convertCoordToArr(end);

  if (
    (startArr[0] === endArr[0] && startArr[1] === endArr[1]) ||
    (startArr[0] !== endArr[0] && startArr[1] !== endArr[1])
  ) {
    throw new Error("Coordinates must be vertically or horizontally in line.");
  } else if (
    length !==
    Math.abs(startArr[0] - endArr[0]) + Math.abs(startArr[1] - endArr[1]) + 1
  ) {
    throw new Error(`${name} length must be ${length}.`);
  }

  const coords = [];

  if (startArr[0] < endArr[0]) {
    for (let i = startArr[0]; i <= endArr[0]; i++) {
      coords.push(convertArrToCoord([i, startArr[1]]));
    }
  } else if (endArr[0] < startArr[0]) {
    for (let i = endArr[0]; i <= startArr[0]; i++) {
      coords.push(convertArrToCoord([i, endArr[1]]));
    }
  } else if (startArr[1] < endArr[1]) {
    for (let i = startArr[1]; i <= endArr[1]; i++) {
      coords.push(convertArrToCoord([startArr[0], i]));
    }
  } else if (endArr[1] < startArr[1]) {
    for (let i = endArr[1]; i <= startArr[1]; i++) {
      coords.push(convertArrToCoord([endArr[0], i]));
    }
  }

  return {
    name,
    coords,
    length,
    hitsTaken: 0,
    isSunk: function () {
      return this.length - this.hitsTaken <= 0;
    },
    hit: function () {
      if (!this.isSunk()) {
        this.hitsTaken++;
      }
    },
  };
}

export { createShip };
