function createShip(start, end, length, name) {
  if (
    (start[0] === end[0] && start[1] === end[1]) ||
    (start[0] !== end[0] && start[1] !== end[1])
  ) {
    throw new Error("Coordinates must be vertically or horizontally in line");
  } else if (
    length !==
    Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1]) + 1
  ) {
    throw new Error(`Ship length must be ${length}`);
  }

  const coords = [];

  if (start[0] < end[0]) {
    for (let i = start[0]; i <= end[0]; i++) {
      coords.push([i, start[1]]);
    }
  } else if (end[0] < start[0]) {
    for (let i = end[0]; i <= start[0]; i++) {
      coords.push([i, end[1]]);
    }
  } else if (start[1] < end[1]) {
    for (let i = start[1]; i <= end[1]; i++) {
      coords.push([start[0], i]);
    }
  } else if (end[1] < start[1]) {
    for (let i = end[1]; i <= start[1]; i++) {
      coords.push([end[0], i]);
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
