/** @type {{HTMLCanvasElement}} */

import { gameAssets } from "./game/GameAssets.js";
import { startScreen } from "./levels/StartScreen.js";
import { levelOne } from "./levels/LevelOne.js";
import { levelTwo } from "./levels/LevelTwo.js";

class Game {
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
}

export const game = new Game();

window.addEventListener("load", () => {
  gameAssets.loadAssetsAndStartGame(gameAssets.imageSrcs, 0);
});
