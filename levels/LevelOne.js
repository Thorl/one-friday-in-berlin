import { FONT_STYLE } from "../utils/fonts.js";
import { Player } from "../utils/player.js";
import { player } from "../utils/player.js";
import { Vehicle } from "../utils/vehicle.js";
import { gameAssets } from "../game/GameAssets.js";
import { gameArea } from "../game/GameArea.js";
import { gameState } from "../game/GameState.js";

class LevelOne {
  constructor() {
    this.vehicles = { bus: [] };
  }

  load() {
    gameArea.clearGameArea();

    gameState.levelToStart = 1;

    gameArea.ctx.drawImage(
      gameAssets.images.levelOne,
      0,
      0,
      gameArea.width,
      gameArea.height
    );

    gameArea.ctx.fillStyle = "rgba(0,0,0,0.7)";
    gameArea.ctx.fillRect(0, 0, gameArea.width, gameArea.height);

    const header = "On the way to the bar...";
    const p1 = "you decide to not find the nearest crosswalk.";
    const p2 = "Instead, you opt for crossing the 4-lane road.";
    const p3 =
      "Get to the other side of the road as quickly as possible without getting hit by a bus.";
    const p4 =
      "Control your character by using the up, down, left, and right keyboard buttons.";
    const p5 = "Begin playing by clicking the 'Start Level' button.";

    gameArea.ctx.font = `26px ${FONT_STYLE}`;
    gameArea.ctx.fillStyle = "#fff";
    gameArea.ctx.textAlign = "left";
    gameArea.ctx.fillText(header, 50, 100);

    gameArea.ctx.font = `11px ${FONT_STYLE}`;
    gameArea.ctx.fillText(p1, 50, 200, 600);
    gameArea.ctx.fillText(p2, 50, 250, 600);
    gameArea.ctx.fillText(p3, 50, 300, 600);
    gameArea.ctx.fillText(p4, 50, 350, 600);
    gameArea.ctx.fillText(p5, 50, 400, 600);

    gameArea.drawButton("Start Level");
    gameState.shouldStartLevel = true;
  }

  start() {
    this.interval = setInterval(this.drawLevelOne, 10);
  }

  drawBackground() {
    gameArea.ctx.drawImage(
      gameAssets.images.levelOneInGame,
      0,
      0,
      gameArea.width,
      gameArea.height
    );
  }

  drawLevelOne = () => {
    gameState.updateFrames();
    gameArea.clearGameArea();
    this.drawBackground();
    player.levelOne.drawPlayer(gameAssets.images.playerLevelOne);
    this.updateVehiclePos();
    this.countdownToStart();
    this.checkLevelOneCollision(this.vehicles.bus);
    this.victoryCheck(player.levelOne.yPos);
  };

  checkLevelOneCollision = (vehicleArray) => {
    const collided = vehicleArray.some((vehicle) => {
      return this.didPlayerCollide(vehicle);
    });
    if (collided) {
      this.stop();
      this.loadGameOverScreen();
    }
  };

  didPlayerCollide(vehicle) {
    return !(
      player.levelOne.top() > vehicle.bottom() ||
      player.levelOne.bottom() < vehicle.top() ||
      player.levelOne.left() > vehicle.right() ||
      (player.levelOne.left() < vehicle.left() &&
        player.levelOne.right() < vehicle.left()) ||
      player.levelOne.right() < vehicle.left()
    );
  }

  countdownToStart() {
    let count = 3 - Math.floor(gameState.frames / 100);

    if (count < -2) return;

    gameArea.ctx.font = `28px ${FONT_STYLE}`;
    gameArea.ctx.fillStyle = "red";
    if (count === 0 && !gameState.didLevelStart) {
      gameState.didLevelStart = true;
      gameArea.abortController = new AbortController();
      const signal = gameArea.abortController.signal;

      gameArea.ctx.fillStyle = "green";
      gameArea.ctx.fillText("GO!", gameArea.width / 2, 240);

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
    } else if (count == 0 && gameState.didLevelStart) {
      gameArea.ctx.fillStyle = "green";
      gameArea.ctx.fillText("GO!", gameArea.width / 2, 240);
    } else if (count > 0) {
      gameArea.ctx.fillText(`${count}`, gameArea.width / 2, 240);
    }
  }

  updateVehiclePos() {
    const startingXPos = gameArea.width;
    const rowFourStartingYPos = 400;
    const rowThreeStartingYPos = 290;
    const rowTwoStartingYPos = 180;
    const rowOneStartingYpos = 65;

    if (gameState.frames % 300 === 0) {
      this.vehicles.bus.push(
        new Vehicle(startingXPos, rowOneStartingYpos, 150, 75, 1)
      );
    }

    if (gameState.frames % 200 === 0) {
      this.vehicles.bus.push(
        new Vehicle(startingXPos, rowTwoStartingYPos, 150, 75, 2)
      );

      this.vehicles.bus.push(
        new Vehicle(startingXPos, rowThreeStartingYPos, 150, 75, 3)
      );

      this.vehicles.bus.push(
        new Vehicle(startingXPos, rowFourStartingYPos, 150, 75, 6)
      );
    }

    for (let i = 0; i < this.vehicles.bus.length; i++) {
      this.vehicles.bus[i].xPos -= this.vehicles.bus[i].speed;
      this.vehicles.bus[i].drawVehicle();
    }
  }

  stop() {
    clearInterval(this.interval);
  }

  loadGameOverScreen() {
    this.reset();
    this.removeKeyDownEventListener();

    gameArea.clearGameArea();
    gameState.levelToLoad = 0;
    gameState.shouldStartLevel = false;

    gameArea.ctx.drawImage(
      gameAssets.images.levelOneGameOver,
      0,
      0,
      gameArea.width,
      gameArea.height
    );

    gameArea.ctx.fillStyle = "rgba(0,0,0,0.7)";
    gameArea.ctx.fillRect(0, 0, gameArea.width, gameArea.height);

    const header = "Game Over...";
    const p1 = "you were hit by a bus.";
    const p2 = "You'll need some time to recover at the hospital.";
    const p3 = "But don't worry. Another weekend you can always...";

    gameArea.ctx.font = `32px ${FONT_STYLE}`;
    gameArea.ctx.fillStyle = "red";
    gameArea.ctx.textAlign = "left";
    gameArea.ctx.fillText(header, 50, 100);

    gameArea.ctx.fillStyle = "white";
    gameArea.ctx.font = `16px ${FONT_STYLE}`;
    gameArea.ctx.fillText(p1, 50, 200, 600);
    gameArea.ctx.fillText(p2, 50, 250, 600);
    gameArea.ctx.fillText(p3, 50, 300, 600);

    gameArea.drawButton("Try Again");
  }

  reset() {
    player.levelOne = new Player(330, 485, 40, 60);

    this.vehicles.bus = [];

    gameState.frames = 0;

    gameState.didLevelStart = false;
  }

  victoryCheck(playerYPos) {
    if (playerYPos < 30) {
      this.stop();
      this.loadVictoryScreen();
    }
  }

  loadVictoryScreen() {
    gameArea.clearGameArea();
    this.removeKeyDownEventListener();

    gameState.levelToLoad = 2;
    gameState.shouldStartLevel = false;

    gameArea.ctx.drawImage(
      gameAssets.images.levelOneVictory,
      0,
      0,
      gameArea.width,
      gameArea.height
    );

    gameArea.ctx.fillStyle = "rgba(0,0,0,0.7)";
    gameArea.ctx.fillRect(0, 0, gameArea.width, gameArea.height);

    const header = "Success!";
    const p1 = "You made it safely to the other side.";
    const p2 = "Time to have some beer with your friends.";

    gameArea.ctx.font = `36px ${FONT_STYLE}`;
    gameArea.ctx.fillStyle = "green";
    gameArea.ctx.textAlign = "left";
    gameArea.ctx.fillText(header, 50, 100);

    gameArea.ctx.font = `18px ${FONT_STYLE}`;
    gameArea.ctx.fillStyle = "white";
    gameArea.ctx.fillText(p1, 50, 200, 600);
    gameArea.ctx.fillText(p2, 50, 250, 600);

    gameArea.drawButton("Enter Bar");
  }

  removeKeyDownEventListener() {
    gameArea.abortController.abort();
  }
}

export const levelOne = new LevelOne();
