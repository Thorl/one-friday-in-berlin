import { GameObject } from "./game-object.js";
import { gameAssets } from "../game/GameAssets.js";
import { gameArea } from "../game/GameArea.js";

export class Bottle extends GameObject {
  constructor(xPos, yPos, width, height) {
    super(xPos, yPos, width, height);
  }

  drawBottle() {
    const ctx = gameArea.ctx;
    ctx.drawImage(
      gameAssets.images.beerBottle,
      this.xPos,
      this.yPos,
      this.width,
      this.height
    );
  }
}
