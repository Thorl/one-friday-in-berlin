import { GameObject } from "./game-object.js";
import { game } from "../app.js";

export class Player extends GameObject {
  constructor(xPos, yPos, width, height) {
    super(xPos, yPos, width, height);
  }

  drawPlayer(playerImg) {
    const ctx = game.ctx;

    ctx.drawImage(playerImg, this.xPos, this.yPos, this.width, this.height);
  }

  moveUp() {
    if (this.yPos - 25 >= 0) {
      this.yPos -= 25;
    }
  }

  moveDown() {
    if (this.yPos + this.height + 25 <= game.height) {
      this.yPos += 25;
    }
  }

  moveLeft() {
    if (this.xPos - 25 >= 0) {
      this.xPos -= 25;
    }
  }

  moveRight() {
    if (this.xPos + this.width + 25 <= game.width) {
      this.xPos += 25;
    }
  }
}

export const player = {
  levelOne: new Player(330, 485, 40, 60),
  levelTwo: new Player(275, 340, 100, 200),
};
