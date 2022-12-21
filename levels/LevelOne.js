import { FONT_STYLE } from "../utils/fonts.js";
import { Player } from "../utils/player.js";
import { player } from "../utils/player.js";
import { Vehicle } from "../utils/vehicle.js";
import { game } from "../app.js";

class LevelOne {
  load() {
    game.clearGameArea();

    game.gameState.levelToStart = 1;

    game.ctx.drawImage(game.images.levelOne, 0, 0, game.width, game.height);

    game.ctx.fillStyle = "rgba(0,0,0,0.7)";
    game.ctx.fillRect(0, 0, game.width, game.height);

    const header = "On the way to the bar...";
    const p1 = "you decide to not find the nearest crosswalk.";
    const p2 = "Instead, you opt for crossing the 4-lane road.";
    const p3 =
      "Get to the other side of the road as quickly as possible without getting hit by a bus.";
    const p4 =
      "Control your character by using the up, down, left, and right keyboard buttons.";
    const p5 = "Begin playing by clicking the 'Start Level' button.";

    game.ctx.font = `26px ${FONT_STYLE}`;
    game.ctx.fillStyle = "#fff";
    game.ctx.textAlign = "left";
    game.ctx.fillText(header, 50, 100);

    game.ctx.font = `11px ${FONT_STYLE}`;
    game.ctx.fillText(p1, 50, 200, 600);
    game.ctx.fillText(p2, 50, 250, 600);
    game.ctx.fillText(p3, 50, 300, 600);
    game.ctx.fillText(p4, 50, 350, 600);
    game.ctx.fillText(p5, 50, 400, 600);

    game.drawButton("Start Level");
    game.gameState.shouldStartLevel = true;
  }

  start() {
    this.interval = setInterval(drawLevelOne, 10);
  }

  drawBackground() {
    game.ctx.drawImage(
      game.images.levelOneInGame,
      0,
      0,
      game.width,
      game.height
    );
  }

  countdownToStart() {
    let count = 3 - Math.floor(game.frames / 100);

    if (count < -2) return;

    game.ctx.font = `28px ${FONT_STYLE}`;
    game.ctx.fillStyle = "red";
    if (count === 0 && !game.didLevelStart) {
      game.didLevelStart = true;
      game.abortController = new AbortController();
      const signal = game.abortController.signal;

      game.ctx.fillStyle = "green";
      game.ctx.fillText("GO!", game.width / 2, 240);

      document.addEventListener(
        "keydown",
        (event) => {
          switch (event.keyCode) {
            case 38:
              player.levelOne.moveUp();
              break;
            case 40:
              player.levelOne.moveDown();
              break;
            case 37:
              player.levelOne.moveLeft();
              break;
            case 39:
              player.levelOne.moveRight();
              break;
          }
        },
        { signal: signal }
      );
    } else if (count == 0 && game.didLevelStart) {
      game.ctx.fillStyle = "green";
      game.ctx.fillText("GO!", game.width / 2, 240);
    } else if (count > 0) {
      game.ctx.fillText(`${count}`, game.width / 2, 240);
    }
  }

  updateVehiclePos() {
    const startingXPos = game.width;
    const rowFourStartingYPos = 400;
    const rowThreeStartingYPos = 290;
    const rowTwoStartingYPos = 180;
    const rowOneStartingYpos = 65;

    if (game.frames % 300 === 0) {
      vehicles.bus.push(
        new Vehicle(startingXPos, rowOneStartingYpos, 150, 75, 1)
      );
    }

    if (game.frames % 200 === 0) {
      vehicles.bus.push(
        new Vehicle(startingXPos, rowTwoStartingYPos, 150, 75, 2)
      );

      vehicles.bus.push(
        new Vehicle(startingXPos, rowThreeStartingYPos, 150, 75, 3)
      );

      vehicles.bus.push(
        new Vehicle(startingXPos, rowFourStartingYPos, 150, 75, 6)
      );
    }

    for (let i = 0; i < vehicles.bus.length; i++) {
      vehicles.bus[i].xPos -= vehicles.bus[i].speed;
      vehicles.bus[i].drawVehicle();
    }
  }

  collisionCheck(vehicle) {
    return !(
      player.levelOne.top() > vehicle.bottom() ||
      player.levelOne.bottom() < vehicle.top() ||
      player.levelOne.left() > vehicle.right() ||
      (player.levelOne.left() < vehicle.left() &&
        player.levelOne.right() < vehicle.left()) ||
      player.levelOne.right() < vehicle.left()
    );
  }

  stop() {
    clearInterval(this.interval);
  }

  loadGameOverScreen() {
    this.reset();
    this.removeKeyDownEventListener();

    game.clearGameArea();
    game.gameState.levelToLoad = 0;
    game.gameState.shouldStartLevel = false;

    game.ctx.drawImage(
      game.images.levelOneGameOver,
      0,
      0,
      game.width,
      game.height
    );

    game.ctx.fillStyle = "rgba(0,0,0,0.7)";
    game.ctx.fillRect(0, 0, game.width, game.height);

    const header = "Game Over...";
    const p1 = "you were hit by a bus.";
    const p2 = "You'll need some time to recover at the hospital.";
    const p3 = "But don't worry. Another weekend you can always...";

    game.ctx.font = `32px ${FONT_STYLE}`;
    game.ctx.fillStyle = "red";
    game.ctx.textAlign = "left";
    game.ctx.fillText(header, 50, 100);

    game.ctx.fillStyle = "white";
    game.ctx.font = `16px ${FONT_STYLE}`;
    game.ctx.fillText(p1, 50, 200, 600);
    game.ctx.fillText(p2, 50, 250, 600);
    game.ctx.fillText(p3, 50, 300, 600);

    game.drawButton("Try Again");
  }

  reset() {
    player.levelOne = new Player(330, 485, 40, 60);

    vehicles.bus = [];

    game.frames = 0;

    game.didLevelStart = false;
  }

  victoryCheck(playerYPos) {
    if (playerYPos < 30) {
      this.stop();
      this.loadVictoryScreen();
    }
  }

  loadVictoryScreen() {
    game.clearGameArea();
    this.removeKeyDownEventListener();

    game.gameState.levelToLoad = 2;
    game.gameState.shouldStartLevel = false;

    game.ctx.drawImage(
      game.images.levelOneVictory,
      0,
      0,
      game.width,
      game.height
    );

    game.ctx.fillStyle = "rgba(0,0,0,0.7)";
    game.ctx.fillRect(0, 0, game.width, game.height);

    const header = "Success!";
    const p1 = "You made it safely to the other side.";
    const p2 = "Time to have some beer with your friends.";

    game.ctx.font = `36px ${FONT_STYLE}`;
    game.ctx.fillStyle = "green";
    game.ctx.textAlign = "left";
    game.ctx.fillText(header, 50, 100);

    game.ctx.font = `18px ${FONT_STYLE}`;
    game.ctx.fillStyle = "white";
    game.ctx.fillText(p1, 50, 200, 600);
    game.ctx.fillText(p2, 50, 250, 600);

    game.drawButton("Enter Bar");
  }

  removeKeyDownEventListener() {
    game.abortController.abort();
  }
}

export let vehicles = { bus: [] };

const checkLevelOneCollision = (vehicleArray) => {
  const collided = vehicleArray.some((vehicle) => {
    return levelOne.collisionCheck(vehicle);
  });
  if (collided) {
    levelOne.stop();
    levelOne.loadGameOverScreen();
  }
};

const drawLevelOne = () => {
  game.updateFrames();
  game.clearGameArea();
  levelOne.drawBackground();
  player.levelOne.drawPlayer(game.images.playerLevelOne);
  levelOne.updateVehiclePos();
  levelOne.countdownToStart();
  checkLevelOneCollision(vehicles.bus);
  levelOne.victoryCheck(player.levelOne.yPos);
};

export const levelOne = new LevelOne();
