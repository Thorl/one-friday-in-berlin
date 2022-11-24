/** @type {{HTMLCanvasElement}} */
class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.wasInfoLoaded = false;
    this.levelToLoad = 1;
    this.levelToStart = 1;
    this.abortController = new AbortController();
  }

  drawButton(text) {
    const rectangle = new Path2D();
    const rectangleX = 250;
    const rectangleY = 450;
    const rectangleWidth = 200;
    const rectangleHeight = 50;
    rectangle.rect(rectangleX, rectangleY, rectangleWidth, rectangleHeight);
    this.ctx.fillStyle = "red";
    this.ctx.fill(rectangle);

    this.ctx.fillStyle = "white";
    this.ctx.fillText(text, 290, 483);

    this.ctx.canvas.addEventListener(
      "click",
      (event) => {
        rectangle.rect(rectangleX, rectangleY, rectangleWidth, rectangleHeight);

        const isMouseOnBtn = this.ctx.isPointInPath(
          rectangle,
          event.offsetX,
          event.offsetY
        );

        if (isMouseOnBtn && !this.wasInfoLoaded) {
          this.loadLevel(this.levelToLoad);
          if (this.levelToLoad < 2) {
            this.levelToLoad++;
          } else {
            this.levelToLoad = 0;
          }
        }

        if (isMouseOnBtn && this.wasInfoLoaded) {
          this.startLevel(this.levelToStart);
          if (this.levelToStart < 2) {
            this.levelToStart++;
          } else {
            this.levelToStart = 1;
          }
        }
      },
      { signal: this.abortController.signal }
    );
  }

  removeEventListener() {
    this.abortController.abort();
  }

  clearGameArea() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  loadLevel(levelToLoad) {
    switch (levelToLoad) {
      case 0:
        startScreen.loadInfoScreen();
        break;
      case 1:
        this.removeEventListener();
        levelOne.loadInfoScreen();
        break;
    }
  }

  startLevel(levelToStart) {
    switch (levelToStart) {
      case 1:
        levelOne.startLevel();
        break;
    }
  }
}

const game = new Game();

class StartScreen extends Game {
  constructor() {
    super();
  }

  loadInfoScreen() {
    this.clearGameArea();
    this.ctx.fillRect(0, 0, this.width, this.height);

    const header = "One Friday in Berlin...";
    const p1 = "you have made plans with your friends to go to a bar.";
    const p2 = "During the night, you'll have to perform different tasks.";
    const p3 = "Follow the instruction on the screen to know what to do.";
    const p4 = "Begin playing by clicking the 'Start Game' button.";

    this.ctx.font = "50px roboto";
    this.ctx.fillStyle = "#fff";
    this.ctx.fillText(header, 50, 100);

    this.ctx.font = "24px roboto";
    this.ctx.fillText(p1, 50, 200);
    this.ctx.fillText(p2, 50, 250);
    this.ctx.fillText(p3, 50, 300);
    this.ctx.fillText(p4, 50, 350);

    this.drawButton("Start Game");
  }
}

class LevelOne extends Game {
  constructor() {
    super();
  }

  loadInfoScreen() {
    this.clearGameArea();

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);

    const header = "On the way to the bar...";
    const p1 = "you decide to not find the nearest crosswalk.";
    const p2 = "Instead, you opt for crossing the 4-lane road.";
    const p3 =
      "Get to the other side of the road without getting hit by a bus.";
    const p4 =
      "Control your character by using the up, down, left, and right keyboard buttons.";
    const p5 = "Begin playing by clicking the 'Start Level' button.";

    this.ctx.font = "50px roboto";
    this.ctx.fillStyle = "#fff";
    this.ctx.fillText(header, 50, 100);

    this.ctx.font = "25px roboto";
    this.ctx.fillText(p1, 50, 200, 600);
    this.ctx.fillText(p2, 50, 250, 600);
    this.ctx.fillText(p3, 50, 300, 600);
    this.ctx.fillText(p4, 50, 350, 600);
    this.ctx.fillText(p5, 50, 400, 600);

    this.drawButton("Start Level");
    this.wasInfoLoaded = true;
  }

  drawBackground() {
    const img = new Image();
    img.src = "./images/4-lane-road.jpg";

    this.ctx.drawImage(img, 0, 0, this.width, this.height);
  }

  startLevel() {
    this.removeEventListener();
    this.intervalId = setInterval(drawLevelOne, 50);
  }
}

class GameObject {
  constructor(xPos, yPos, width, height) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
  }

  top() {
    return this.yPos + this.height;
  }

  bottom() {
    return this.yPos;
  }

  left() {
    return this.xPos;
  }

  right() {
    this.xPos + this.width;
  }
}

class PlayerTopView extends GameObject {
  constructor(xPos, yPos, width, height) {
    super(xPos, yPos, width, height);
  }

  drawPlayer() {
    const ctx = game.ctx;
    const playerImg = new Image();
    playerImg.src = "./images/man-black-hair-green-sweater-v2.png";

    ctx.drawImage(playerImg, this.xPos, this.yPos, this.width, this.height);
  }

  updatePosition() {
    this.drawPlayer();
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

const startScreen = new StartScreen();
const levelOne = new LevelOne();
const playerTopView = new PlayerTopView(300, 480, 50, 70);

function drawLevelOne() {
  game.clearGameArea();
  levelOne.drawBackground();
  playerTopView.updatePosition();
}

window.onload = () => {
  game.loadLevel(0);
};

document.addEventListener("keydown", (event) => {
  switch (event.keyCode) {
    case 38:
      playerTopView.moveUp();
      break;
    case 40:
      playerTopView.moveDown();
      break;
    case 37:
      playerTopView.moveLeft();
      break;
    case 39:
      playerTopView.moveRight();
      break;
  }
});
