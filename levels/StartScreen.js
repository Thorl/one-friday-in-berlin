import { gameAssets } from "../game/GameAssets.js";
import { gameArea } from "../game/GameArea.js";
import { gameState } from "../game/GameState.js";
import { FONT_STYLE } from "../utils/fonts.js";

class StartScreen {
  load() {
    gameArea.clearGameArea();
    gameState.levelToLoad = 1;
    gameState.shouldStartLevel = false;

    gameArea.ctx.drawImage(
      gameAssets.images.startScreen,
      0,
      0,
      gameArea.width,
      gameArea.height
    );

    gameArea.ctx.fillStyle = "rgba(0,0,0,0.7)";
    gameArea.ctx.fillRect(0, 0, gameArea.width, gameArea.height);

    const header = "One Friday in Berlin...";
    const p1 = "you have made plans with your friends to go to a bar.";
    const p2 = "During the night, you'll have to perform different tasks.";
    const p3 = "Follow the instruction on the screen to know what to do.";
    const p4 = "Begin playing by clicking the 'Start Game' button.";

    gameArea.ctx.font = `28px ${FONT_STYLE}`;
    gameArea.ctx.fillStyle = "#fff";
    gameArea.ctx.textAlign = "left";
    gameArea.ctx.fillText(header, 50, 100);

    gameArea.ctx.font = `11px ${FONT_STYLE}`;
    gameArea.ctx.fillText(p1, 50, 200);
    gameArea.ctx.fillText(p2, 50, 250);
    gameArea.ctx.fillText(p3, 50, 300);
    gameArea.ctx.fillText(p4, 50, 350);

    gameArea.drawButton("Start Game");
  }
}

export const startScreen = new StartScreen();
