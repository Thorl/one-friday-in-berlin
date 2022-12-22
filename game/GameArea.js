import { FONT_STYLE } from "../utils/fonts.js";
import { game } from "../app.js";
import { gameState } from "./GameState.js";

class GameArea {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.abortController;
  }

  clearGameArea() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

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

        if (isMouseOnBtn && !gameState.shouldStartLevel) {
          this.abortController.abort();
          game.loadLevel(gameState.levelToLoad);
        } else if (isMouseOnBtn && gameState.shouldStartLevel) {
          this.abortController.abort();
          game.startLevel(gameState.levelToStart);
        }
      },
      { signal: signal }
    );
  }
}

export const gameArea = new GameArea();
