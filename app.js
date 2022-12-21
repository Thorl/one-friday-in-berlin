/** @type {{HTMLCanvasElement}} */

import { FONT_STYLE } from "./utils/fonts.js";
import { startScreen } from "./levels/StartScreen.js";
import { levelOne } from "./levels/LevelOne.js";
import { levelTwo } from "./levels/LevelTwo.js";

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

export const game = new Game();

window.addEventListener("load", () => {
  game.loadImages(game.imageSrcs, 0);
});
