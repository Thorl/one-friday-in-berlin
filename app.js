/** @type {{HTMLCanvasElement}} */

import { startScreen } from "./levels/StartScreen.js";
import { levelOne } from "./levels/LevelOne.js";
import { levelTwo } from "./levels/LevelTwo.js";

class Game {
  constructor() {
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

  loadAssets(imageSrcArray, currentIndex) {
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
      this.loadAssets(imageSrcArray, currentIndex);
      return;
    };
  }

  loadFonts() {
    let retroFont = new FontFace(
      "retroGame",
      "url(./fonts/PressStart2P-Regular.ttf)"
    );

    retroFont.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      startScreen.load();
    });
  }
}

export const game = new Game();

window.addEventListener("load", () => {
  game.loadAssets(game.imageSrcs, 0);
});
