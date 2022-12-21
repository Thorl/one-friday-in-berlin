import { GameObject } from "./game-object.js";
import { game } from "../app.js";

export class Bottle extends GameObject {
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
