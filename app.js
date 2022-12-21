/** @type {{HTMLCanvasElement}} */

import { FONT_STYLE } from "./utils/fonts.js";
import { GameObject } from "./utils/game-object.js";
import { startScreen } from "./levels/StartScreen.js";
import { levelOne } from "./levels/LevelOne.js";
import { playerLevelTwo } from "./utils/player.js";

class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.gameState = {
      levelToLoad: 1,
      levelToStart: 1,
      shouldStartLevel: false,
    };
    this.didLevelStart = false;
    this.frames = 0;
    this.abortController;
    this.loadedImageCount = 0;
    this.imageNames = [
      "startScreen",
      "levelOne",
      "levelOneInGame",
      "playerLevelOne",
      "bus",
      "levelOneGameOver",
      "levelOneVictory",
      "levelTwo",
      "levelTwoInGame",
      "playerLevelTwo",
      "beerBottle",
      "levelTwoGameOver",
    ];
    this.imageSrcs = [
      "./images/start-screen-low-res.jpg",
      "./images/level-one.jpeg",
      "./images/level-one-in-game.jpg",
      "./images/player-level-one.png",
      "./images/bus.png",
      "./images/level-one-game-over.jpg",
      "./images/level-one-victory.jpeg",
      "./images/level-two.jpeg",
      "./images/level-two-in-game.jpg",
      "./images/player-level-two.png",
      "./images/beer-bottle.png",
      "./images/level-two-game-over.jpeg",
    ];
    this.images = {};
    this.loadedFontCount = 0;
  }

  /* Utilities */

  drawButton(text) {
    const rectangle = new Path2D();
    const rectangleX = this.width / 3;
    const rectangleY = 450;
    const rectangleWidth = 200;
    const rectangleHeight = 50;
    rectangle.rect(rectangleX, rectangleY, rectangleWidth, rectangleHeight);
    this.ctx.fillStyle = "green";
    this.ctx.fill(rectangle);

    const button = rectangle;
    const buttonDimensions = {
      rectangleX,
      rectangleY,
      rectangleWidth,
      rectangleHeight,
    };

    this.ctx.font = `13px ${FONT_STYLE}`;
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, 335, 483);

    this.setUpEventListener(button, buttonDimensions);
  }

  setUpEventListener(button, buttonDimensions) {
    button.rect(
      buttonDimensions.rectangleX,
      buttonDimensions.rectangleY,
      buttonDimensions.rectangleWidth,
      buttonDimensions.rectangleHeight
    );

    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    this.canvas.addEventListener(
      "click",
      (event) => {
        const isMouseOnBtn = this.ctx.isPointInPath(
          button,
          event.offsetX,
          event.offsetY
        );

        if (isMouseOnBtn && !this.gameState.shouldStartLevel) {
          this.abortController.abort();
          this.loadLevel(this.gameState.levelToLoad);
        } else if (isMouseOnBtn && this.gameState.shouldStartLevel) {
          this.abortController.abort();
          this.startLevel(this.gameState.levelToStart);
        }
      },
      { signal: signal }
    );
  }

  updateFrames() {
    this.frames += 1;
  }

  clearGameArea() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  loadLevel(levelToLoad) {
    switch (levelToLoad) {
      case 0:
        startScreen.load();
        break;
      case 1:
        levelOne.load();
        break;
      case 2:
        levelTwo.load();
        break;
    }
  }

  startLevel(levelToStart) {
    switch (levelToStart) {
      case 1:
        levelOne.start();
        break;
      case 2:
        levelTwo.start();
    }
  }

  loadImages(imageSrcArray, currentIndex) {
    if (imageSrcArray.length === currentIndex) return;

    let currentImage = new Image();
    currentImage.src = imageSrcArray[currentIndex];

    currentImage.onload = () => {
      this.loadedImageCount++;

      this.images[this.imageNames[currentIndex]] = currentImage;

      if (this.loadedImageCount === imageSrcArray.length) {
        this.loadFonts();
      }

      ++currentIndex;
      this.loadImages(imageSrcArray, currentIndex);
      return;
    };
  }

  loadFonts() {
    let font = new FontFace(
      "retroGame",
      "url(./fonts/PressStart2P-Regular.ttf)"
    );

    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      startScreen.load();
    });
  }
}

class LevelTwo {
  constructor() {
    this.levelTwoScore = 0;
  }

  load() {
    game.clearGameArea();

    game.gameState.levelToStart = 2;
    game.frames = 0;
    game.didLevelStart = false;

    game.ctx.drawImage(game.images.levelTwo, 0, 0, game.width, game.height);

    game.ctx.fillStyle = "rgba(0,0,0,0.7)";
    game.ctx.fillRect(0, 0, game.width, game.height);

    const header = "Inside the bar...";
    const p1 = "you're very thirsty and begin ordering beer.";
    const p2 = "You tell the bartender to just keep them coming.";
    const p3 =
      "Drink as much beer as you can before the timer runs out by collecting the falling bottles.";
    const p4 =
      "Control your character by using the left and right keyboard buttons.";
    const p5 = "Begin playing by clicking the 'Start Level' button.";

    game.ctx.font = `36px ${FONT_STYLE}`;
    game.ctx.fillStyle = "#fff";
    game.ctx.textAlign = "left";
    game.ctx.fillText(header, 50, 100);

    game.ctx.font = `12px ${FONT_STYLE}`;
    game.ctx.fillText(p1, 50, 200, 600);
    game.ctx.fillText(p2, 50, 250, 600);
    game.ctx.fillText(p3, 50, 300, 600);
    game.ctx.fillText(p4, 50, 350, 600);
    game.ctx.fillText(p5, 50, 400, 600);

    game.drawButton("Start Level");
    game.gameState.shouldStartLevel = true;
  }

  start() {
    this.interval = setInterval(drawLevelTwo, 10);
  }

  drawBackground() {
    game.ctx.drawImage(
      game.images.levelTwoInGame,
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

      game.ctx.fillstyle = "green";
      game.ctx.fillText("GO!", 320, 240);

      document.addEventListener(
        "keydown",
        (event) => {
          switch (event.keyCode) {
            case 37:
              playerLevelTwo.moveLeft();
              break;
            case 39:
              playerLevelTwo.moveRight();
              break;
          }
        },
        { signal: signal }
      );
    } else if (count == 0 && game.didLevelStart) {
      game.ctx.fillStyle = "green";
      game.ctx.fillText("GO!", 320, 240);
    } else if (count > 0) {
      game.ctx.fillStyle = "red";
      game.ctx.fillText(`${count}`, 320, 240);
    }
  }

  countdownToGameOver() {
    let count = 13 - Math.floor(game.frames / 100);

    if (!game.didLevelStart) return;

    if (count === 0) {
      this.stop();
      this.loadGameOverScreen();
      return;
    }

    game.ctx.font = `20px ${FONT_STYLE}`;

    if (count > 3) {
      game.ctx.fillStyle = "white";
    } else {
      game.ctx.fillStyle = "red";
    }
    game.ctx.fillText(`Timer: ${count}`, 90, 30);
  }

  updateBottlePos() {
    if (!game.didLevelStart) return;
    const yPosition = 0;

    const minX = 40;
    const maxX = 680;

    const xPosition = Math.floor(Math.random() * (maxX - minX + 1) + minX);

    if (game.frames % 50 === 0) {
      bottles.push(new Bottle(xPosition, yPosition, 20, 70));
    }

    for (let i = 0; i < bottles.length; i++) {
      bottles[i].yPos += 4;
      bottles[i].drawBottle();
    }
  }

  updateScore() {
    const score = this.levelTwoScore;

    game.ctx.font = `20px ${FONT_STYLE}`;
    game.ctx.fillStyle = "white";
    game.ctx.fillText(`Score: ${score}`, 590, 30);
  }

  stop() {
    clearInterval(this.interval);
  }

  loadGameOverScreen() {
    game.clearGameArea();
    levelTwo.removeKeyDownEventListener();

    game.gameState.levelToLoad = 0;
    game.gameState.shouldStartLevel = false;

    game.ctx.drawImage(
      game.images.levelTwoGameOver,
      0,
      0,
      game.width,
      game.height
    );

    game.ctx.fillStyle = "rgba(0,0,0,0.7)";
    game.ctx.fillRect(0, 0, game.width, game.height);

    const header = "Well done!";
    const p1 = `You drank ${this.levelTwoScore} beers...`;
    const p2 = "...wait..looks like it was a bit too much.";
    const p3 = "You pass out and your friends have to take you home.";
    const p4 = "But don't worry. Next weekend you can always...";

    game.ctx.font = `36px ${FONT_STYLE}`;
    game.ctx.fillStyle = "green";
    game.ctx.textAlign = "left";
    game.ctx.fillText(header, 50, 100);

    game.ctx.font = `13px ${FONT_STYLE}`;
    game.ctx.fillStyle = "white";
    game.ctx.fillText(p1, 50, 200, 600);
    game.ctx.fillText(p2, 50, 250, 600);
    game.ctx.fillText(p3, 50, 300, 600);
    game.ctx.fillText(p4, 50, 350, 600);

    this.resetGame();
    game.drawButton("Try Again");
  }

  removeKeyDownEventListener() {
    game.abortController.abort();
  }

  resetGame() {
    playerLevelOne = new Player(330, 485, 40, 60);

    vehicles = [];

    playerLevelTwo = new Player(275, 340, 100, 200);

    bottles = [];

    this.levelTwoScore = 0;

    game.frames = 0;

    game.didLevelStart = false;
  }
}

export const game = new Game();
const levelTwo = new LevelTwo();

let bottles = [];

class Bottle extends GameObject {
  constructor(xPos, yPos, width, height) {
    super(xPos, yPos, width, height);
  }

  drawBottle() {
    const ctx = game.ctx;
    ctx.drawImage(
      game.images.beerBottle,
      this.xPos,
      this.yPos,
      this.width,
      this.height
    );
  }
}

const checkLevelTwoCollision = (bottlesArray) => {
  for (let i = 0; i < bottlesArray.length; i++) {
    if (
      !(
        playerLevelTwo.top() > bottlesArray[i].bottom() ||
        playerLevelTwo.bottom() < bottlesArray[i].top() ||
        playerLevelTwo.left() > bottlesArray[i].right() ||
        playerLevelTwo.right() < bottlesArray[i].left()
      )
    ) {
      levelTwo.levelTwoScore += 1;
      bottlesArray.splice(i, 1);
    }
  }
};

const drawLevelTwo = () => {
  game.updateFrames();
  game.clearGameArea();
  levelTwo.drawBackground();
  playerLevelTwo.drawPlayer(game.images.playerLevelTwo);
  levelTwo.updateBottlePos();
  levelTwo.countdownToStart();
  checkLevelTwoCollision(bottles);
  levelTwo.updateScore();
  levelTwo.countdownToGameOver();
};

window.addEventListener("load", () => {
  game.loadImages(game.imageSrcs, 0);
});
