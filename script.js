/** @type {{HTMLCanvasElement}} */

class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.didGameStart = false;
  }

  startGame() {
    this.clearGameArea();
    if (!this.didGameStart) {
      const startBtn = document.getElementById("start-btn");
      startBtn.style.display = "none";

      const startLevel = document.getElementById("start-level-btn");
      startLevel.style.display = "block";
    }
  }

  clearGameArea() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}

const startScreen = new Game();

class FirstLevel extends Game {
  constructor(ctx, width, height, didGameStart) {
    super(ctx, width, height, didGameStart);
  }

  drawBackground(img, src) {
    img.src = src;
    this.ctx.drawImage(img, 0, 0, this.width, this.height);
  }
}

const levelOne = new FirstLevel();

const berlinImg = new Image();
berlinImg.src = "./images/berlin.jpg";

const startBtn = document.getElementById("start-btn");
startBtn.addEventListener("click", () => {
  startScreen.startGame();
});

const initializeGame = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.drawImage(berlinImg, 0, 0, width, height);
};

window.onload = () => {
  initializeGame();
};
