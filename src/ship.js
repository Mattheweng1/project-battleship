function createShip(length) {
  return {
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
