function createGame(gameboard1, gameboard2, player1, player2) {
  const gb1 = gameboard1;
  const gb2 = gameboard2;
  const p1 = player1;
  const p2 = player2;
  let turn = 0;
  let setupPhase = true;

  function resetGame() {
    gb1.resetGameboard();
    gb2.resetGameboard();
    this.setupPhase = true;
    this.turn = 0;
  }

  function playerAttacksComputer(random, coords) {
    if (isGameOver()) {
      throw new Error("The game is already over.");
    }
    this.turn++;
    let msg1 = "You ";
    if (random) {
      msg1 += gb2.receiveAttackRandomly();
    } else {
      msg1 += gb2.receiveAttack(coords);
    }
    if (isGameOver()) {
      // Player wins
      return "You sunk all the enemy ships! You actually won!";
    }
    const msg2 = "Computer " + gb1.receiveAttackWithProbabilityMap();
    if (isGameOver()) {
      // Computer wins
      return (
        msg1 + " And then you lost. Your final ship has sunk. Computer wins."
      );
    }
    return [msg1, msg2];
  }

  function isGameOver() {
    return (
      gb1.ships.every((ship) => ship.isSunk()) ||
      gb2.ships.every((ship) => ship.isSunk())
    );
  }

  return {
    gb1,
    gb2,
    p1,
    p2,
    resetGame,
    turn,
    setupPhase,
    playerAttacksComputer,
  };
}

export { createGame };
