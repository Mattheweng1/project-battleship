import { createGame } from "./game";
import { createGameboard } from "./gameboard";

// Resetting gameboards is already tested in gameboard.test.js
test("resetGame() resets setupPhase and turn", () => {
  const gb1 = createGameboard();
  const gb2 = createGameboard();
  const game = createGame(gb1, gb2);
  game.setupPhase = false;
  game.turn = 99;
  expect(game.setupPhase).toBe(false);
  expect(game.turn).toBe(99);
  game.resetGame();
  expect(game.setupPhase).toBe(true);
  expect(game.turn).toBe(0);
});

test("playerAttacksComputer() attacks without specified coord if random", () => {
  const gb1 = createGameboard();
  const gb2 = createGameboard();
  const game = createGame(gb1, gb2);
  gb1.placePatrolBoatRandomly();
  gb2.placePatrolBoatRandomly();
  expect(gb1.attackedCoords.length).toBe(0);
  expect(gb2.attackedCoords.length).toBe(0);
  game.playerAttacksComputer();
  expect(gb1.attackedCoords.length).toBe(1);
  expect(gb2.attackedCoords.length).toBe(1);
});

test("playerAttacksComputer() attacks specified coord when not random", () => {
  const gb1 = createGameboard();
  const gb2 = createGameboard();
  const game = createGame(gb1, gb2);
  gb1.placeCarrierRandomly();
  gb2.placeSubmarine("E5", "E7");
  expect(gb1.attackedCoords.length).toBe(0);
  expect(gb2.attackedCoords.length).toBe(0);
  game.playerAttacksComputer("E5");
  expect(gb1.attackedCoords.length).toBe(1);
  expect(gb2.attackedCoords).toEqual(["E5"]);
  game.playerAttacksComputer("E6");
  expect(gb1.attackedCoords.length).toBe(2);
  expect(gb2.attackedCoords).toEqual(["E5", "E6"]);
});

test("playerAttacksComputer() returns array with two messages when game doesn't end", () => {
  const gb1 = createGameboard();
  const gb2 = createGameboard();
  const game = createGame(gb1, gb2);
  gb1.placeCarrier("A6", "A10");
  gb2.placeCarrier("A6", "A10");
  gb1.placePatrolBoat("A1", "A2");
  gb2.placePatrolBoat("E1", "E2");
  // Computer attacks the center first, so it won't hit any ships on the sides within three attacks
  expect(game.playerAttacksComputer("E2")).toEqual([
    "You landed a successful hit on a ship!",
    "Computer missed.",
  ]);
  expect(game.playerAttacksComputer("J10")).toEqual([
    "You missed.",
    "Computer missed.",
  ]);
  expect(game.playerAttacksComputer("E1")).toEqual([
    "You sunk the Patrol Boat!",
    "Computer missed.",
  ]);
});

test("playerAttacksComputer() returns game over message and updates wins if player wins", () => {
  const gb1 = createGameboard();
  const gb2 = createGameboard();
  const game = createGame(gb1, gb2);
  gb1.placeCarrierRandomly();
  gb2.placePatrolBoat("E5", "E6");
  game.playerAttacksComputer("E5");
  expect(game.playerWins).toBe(0);
  expect(game.computerWins).toBe(0);
  expect(game.playerAttacksComputer("E6")).toBe(
    "You sunk all the enemy ships! You actually won!"
  );
  expect(game.playerWins).toBe(1);
  expect(game.computerWins).toBe(0);
});

test("playerAttacksComputer() returns game over message and updates wins if computer wins", () => {
  const gb1 = createGameboard();
  const gb2 = createGameboard();
  const game = createGame(gb1, gb2);
  gb1.placePatrolBoat("E5", "E6");
  gb2.placeCarrier("A1", "A5");
  expect(game.playerWins).toBe(0);
  expect(game.computerWins).toBe(0);
  let i = 1;
  let output;
  while (i < 10) {
    output = game.playerAttacksComputer(`J${i}`);
    i++;
    if (typeof output === "string") {
      break;
    }
  }
  expect(output).toBe(
    "You missed. And then you lost. Your final ship has sunk. Computer wins."
  );
  expect(game.playerWins).toBe(0);
  expect(game.computerWins).toBe(1);
});
