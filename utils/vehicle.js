import { GameObject } from "./game-object.js";
import { gameAssets } from "../game/GameAssets.js";
import { gameArea } from "../game/GameArea.js";

export class Vehicle extends GameObject {
  constructor(xPos, yPos, width, height, speed) {
    super(xPos, yPos, width, height);
    this.speed = speed;
  }

  drawVehicle() {
    const ctx = gameArea.ctx;
    ctx.drawImage(
      gameAssets.images.bus,
      this.xPos,
      this.yPos,
      this.width,
      this.height
    );
  }
}
