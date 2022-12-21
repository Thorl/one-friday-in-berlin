export class GameObject {
  constructor(xPos, yPos, width, height) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
  }

  top() {
    return this.yPos;
  }

  bottom() {
    return this.yPos + this.height;
  }

  left() {
    return this.xPos;
  }

  right() {
    return this.xPos + this.width;
  }
}
