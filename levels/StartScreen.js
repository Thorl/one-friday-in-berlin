import { game } from "../app.js";
import { FONT_STYLE } from "../utils/fonts.js";

class StartScreen {
  load() {
    game.clearGameArea();
    game.gameState.levelToLoad = 1;
    game.gameState.shouldStartLevel = false;

    game.ctx.drawImage(game.images.startScreen, 0, 0, game.width, game.height);

    game.ctx.fillStyle = "rgba(0,0,0,0.7)";
    game.ctx.fillRect(0, 0, game.width, game.height);

    const header = "One Friday in Berlin...";
    const p1 = "you have made plans with your friends to go to a bar.";
    const p2 = "During the night, you'll have to perform different tasks.";
    const p3 = "Follow the instruction on the screen to know what to do.";
    const p4 = "Begin playing by clicking the 'Start Game' button.";

    game.ctx.font = `28px ${FONT_STYLE}`;
    game.ctx.fillStyle = "#fff";
    game.ctx.textAlign = "left";
    game.ctx.fillText(header, 50, 100);

    game.ctx.font = `11px ${FONT_STYLE}`;
    game.ctx.fillText(p1, 50, 200);
    game.ctx.fillText(p2, 50, 250);
    game.ctx.fillText(p3, 50, 300);
    game.ctx.fillText(p4, 50, 350);

    game.drawButton("Start Game");
  }
}

export const startScreen = new StartScreen();
