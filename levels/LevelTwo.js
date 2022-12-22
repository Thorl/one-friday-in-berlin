import { FONT_STYLE } from "../utils/fonts.js";
import { gameAssets } from "../game/GameAssets.js";
import { gameArea } from "../game/GameArea.js";
import { gameState } from "../game/GameState.js";
import { Player } from "../utils/player.js";
import { player } from "../utils/player.js";
import { Bottle } from "../utils/bottle.js";
import { levelOne } from "./LevelOne.js";

class LevelTwo {
  constructor() {
    this.bottles = [];
    this.levelTwoScore = 0;
  }

  load() {
    gameArea.clearGameArea();

    gameState.levelToStart = 2;
    gameState.frames = 0;
    gameState.didLevelStart = false;

    gameArea.ctx.drawImage(
      gameAssets.images.levelTwo,
      0,
      0,
      gameArea.width,
      gameArea.height
    );

    gameArea.ctx.fillStyle = "rgba(0,0,0,0.7)";
    gameArea.ctx.fillRect(0, 0, gameArea.width, gameArea.height);

    const header = "Inside the bar...";
    const p1 = "you're very thirsty and begin ordering beer.";
    const p2 = "You tell the bartender to just keep them coming.";
    const p3 =
      "Drink as much beer as you can before the timer runs out by collecting the falling bottles.";
    const p4 =
      "Control your character by using the left and right keyboard buttons.";
    const p5 = "Begin playing by clicking the 'Start Level' button.";

    gameArea.ctx.font = `36px ${FONT_STYLE}`;
    gameArea.ctx.fillStyle = "#fff";
    gameArea.ctx.textAlign = "left";
    gameArea.ctx.fillText(header, 50, 100);

    gameArea.ctx.font = `12px ${FONT_STYLE}`;
    gameArea.ctx.fillText(p1, 50, 200, 600);
    gameArea.ctx.fillText(p2, 50, 250, 600);
    gameArea.ctx.fillText(p3, 50, 300, 600);
    gameArea.ctx.fillText(p4, 50, 350, 600);
    gameArea.ctx.fillText(p5, 50, 400, 600);

    gameArea.drawButton("Start Level");
    gameState.shouldStartLevel = true;
  }

  start() {
    this.interval = setInterval(this.drawLevelTwo, 10);
  }

  drawLevelTwo = () => {
    gameState.updateFrames();
    gameArea.clearGameArea();
    this.drawBackground();
    player.levelTwo.drawPlayer(gameAssets.images.playerLevelTwo);
    this.updateBottlePos();
    this.countdownToStart();
    this.checkLevelTwoCollision(this.bottles);
    this.updateScore();
    this.countdownToGameOver();
  };

  checkLevelTwoCollision = (bottlesArray) => {
    for (let i = 0; i < bottlesArray.length; i++) {
      if (
        !(
          player.levelTwo.top() > bottlesArray[i].bottom() ||
          player.levelTwo.bottom() < bottlesArray[i].top() ||
          player.levelTwo.left() > bottlesArray[i].right() ||
          player.levelTwo.right() < bottlesArray[i].left()
        )
      ) {
        levelTwo.levelTwoScore += 1;
        bottlesArray.splice(i, 1);
      }
    }
  };

  drawBackground() {
    gameArea.ctx.drawImage(
      gameAssets.images.levelTwoInGame,
      0,
      0,
      gameArea.width,
      gameArea.height
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

      gameArea.ctx.fillstyle = "green";
      gameArea.ctx.fillText("GO!", 320, 240);

      document.addEventListener(
        "keydown",
        (event) => {
          switch (event.keyCode) {
            case 37:
              player.levelTwo.moveLeft();
              break;
            case 39:
              player.levelTwo.moveRight();
              break;
          }
        },
        { signal: signal }
      );
    } else if (count == 0 && gameState.didLevelStart) {
      gameArea.ctx.fillStyle = "green";
      gameArea.ctx.fillText("GO!", 320, 240);
    } else if (count > 0) {
      gameArea.ctx.fillStyle = "red";
      gameArea.ctx.fillText(`${count}`, 320, 240);
    }
  }

  countdownToGameOver() {
    let count = 13 - Math.floor(gameState.frames / 100);

    if (!gameState.didLevelStart) return;

    if (count === 0) {
      this.stop();
      this.loadGameOverScreen();
      return;
    }

    gameArea.ctx.font = `20px ${FONT_STYLE}`;

    if (count > 3) {
      gameArea.ctx.fillStyle = "white";
    } else {
      gameArea.ctx.fillStyle = "red";
    }
    gameArea.ctx.fillText(`Timer: ${count}`, 90, 30);
  }

  updateBottlePos() {
    if (!gameState.didLevelStart) return;
    const yPosition = 0;

    const minX = 40;
    const maxX = 680;

    const xPosition = Math.floor(Math.random() * (maxX - minX + 1) + minX);

    if (gameState.frames % 50 === 0) {
      this.bottles.push(new Bottle(xPosition, yPosition, 20, 70));
    }

    for (let i = 0; i < this.bottles.length; i++) {
      this.bottles[i].yPos += 4;
      this.bottles[i].drawBottle();
    }
  }

  updateScore() {
    const score = this.levelTwoScore;

    gameArea.ctx.font = `20px ${FONT_STYLE}`;
    gameArea.ctx.fillStyle = "white";
    gameArea.ctx.fillText(`Score: ${score}`, 590, 30);
  }

  stop() {
    clearInterval(this.interval);
  }

  loadGameOverScreen() {
    gameArea.clearGameArea();
    this.removeKeyDownEventListener();

    gameState.levelToLoad = 0;
    gameState.shouldStartLevel = false;

    gameArea.ctx.drawImage(
      gameAssets.images.levelTwoGameOver,
      0,
      0,
      gameArea.width,
      gameArea.height
    );

    gameArea.ctx.fillStyle = "rgba(0,0,0,0.7)";
    gameArea.ctx.fillRect(0, 0, gameArea.width, gameArea.height);

    const header = "Well done!";
    const p1 = `You drank ${this.levelTwoScore} beers...`;
    const p2 = "...wait..looks like it was a bit too much.";
    const p3 = "You pass out and your friends have to take you home.";
    const p4 = "But don't worry. Next weekend you can always...";

    gameArea.ctx.font = `36px ${FONT_STYLE}`;
    gameArea.ctx.fillStyle = "green";
    gameArea.ctx.textAlign = "left";
    gameArea.ctx.fillText(header, 50, 100);

    gameArea.ctx.font = `13px ${FONT_STYLE}`;
    gameArea.ctx.fillStyle = "white";
    gameArea.ctx.fillText(p1, 50, 200, 600);
    gameArea.ctx.fillText(p2, 50, 250, 600);
    gameArea.ctx.fillText(p3, 50, 300, 600);
    gameArea.ctx.fillText(p4, 50, 350, 600);

    this.resetGame();
    gameArea.drawButton("Try Again");
  }

  removeKeyDownEventListener() {
    gameArea.abortController.abort();
  }

  resetGame() {
    player.levelOne = new Player(330, 485, 40, 60);

    levelOne.vehicles = [];

    player.levelTwo = new Player(275, 340, 100, 200);

    this.bottles = [];

    this.levelTwoScore = 0;

    gameState.frames = 0;

    gameState.didLevelStart = false;
  }
}

export const levelTwo = new LevelTwo();
