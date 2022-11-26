/** @type {{HTMLCanvasElement}} */
class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.gameState = {
      levelToLoad: 1,
      levelToStart: 1,
      shouldStartLevel: false,
    };
    this.didLevelOneStart = false;
    this.frames = 0;
    this.levelOneController;
  }

  /* Start Screen */

  loadStartScreen() {
    this.clearGameArea();
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.gameState.levelToLoad = 1;
    this.gameState.shouldStartLevel = false;

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

  /*  */

  /* Level One */

  loadLevelOne() {
    this.clearGameArea();

    this.gameState.levelToStart = 1;

    console.log("Loading Level One Screen. Game state: ", this.gameState);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);

    const header = "On the way to the bar...";
    const p1 = "you decide to not find the nearest crosswalk.";
    const p2 = "Instead, you opt for crossing the 4-lane road.";
    const p3 =
      "Get to the other side of the road as quickly as possible without getting hit by a bus.";
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
    this.gameState.shouldStartLevel = true;
  }

  loadLevelOneGameOverScreen() {
    this.resetLevelOne();
    this.clearGameArea();
    this.removeLevelOneKeyEventListener();

    this.gameState.levelToLoad = 0;
    this.gameState.shouldStartLevel = false;

    console.log("Loading Game Over Screen. Game state: ", this.gameState);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);

    const header = "Game Over...";
    const p1 = "you were hit by a bus.";
    const p2 = "You'll need some time to recover at the hospital.";
    const p3 = "But don't worry. Another weekend you can always...";

    this.ctx.font = "50px roboto";
    this.ctx.fillStyle = "red";
    this.ctx.fillText(header, 50, 100);

    this.ctx.font = "25px roboto";
    this.ctx.fillText(p1, 50, 200, 600);
    this.ctx.fillText(p2, 50, 250, 600);
    this.ctx.fillText(p3, 50, 300, 600);

    this.drawButton("Try Again");
  }

  loadLevelOneVictoryScreen() {
    this.clearGameArea();
    this.removeLevelOneKeyEventListener();

    this.gameState.levelToLoad = 2;
    this.gameState.shouldStartLevel = false;

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);

    const header = "Success!";
    const p1 = "You made it safely to the other side.";
    const p2 = "Time to have some beer with your friends.";

    this.ctx.font = "50px roboto";
    this.ctx.fillStyle = "green";
    this.ctx.fillText(header, 50, 100);

    this.ctx.font = "25px roboto";
    this.ctx.fillText(p1, 50, 200, 600);
    this.ctx.fillText(p2, 50, 250, 600);

    this.drawButton("Enter Bar");
  }

  startLevelOne() {
    this.intervalId = setInterval(drawLevelOne, 10);
  }

  stopLevelOne() {
    clearInterval(this.intervalId);
    this.loadLevelOneGameOverScreen();
  }

  drawLevelOneBackground() {
    const img = new Image();
    img.src = "./images/4-lane-road.jpg";

    this.ctx.drawImage(img, 0, 0, this.width, this.height);
  }

  updateLevelOneVehiclePos() {
    this.frames += 1;
    const startingXPos = game.width;
    const rowFourStartingYPos = 400;
    const rowThreeStartingYPos = 290;
    const rowTwoStartingYPos = 180;
    const rowOneStartingYpos = 65;

    if (this.frames % 300 === 0) {
      vehicles.push(new Vehicle(startingXPos, rowOneStartingYpos, 150, 75, 1));
    }

    if (this.frames % 200 === 0) {
      vehicles.push(new Vehicle(startingXPos, rowTwoStartingYPos, 150, 75, 2));

      vehicles.push(
        new Vehicle(startingXPos, rowThreeStartingYPos, 150, 75, 3)
      );

      vehicles.push(new Vehicle(startingXPos, rowFourStartingYPos, 150, 75, 6));
    }

    for (let i = 0; i < vehicles.length; i++) {
      vehicles[i].xPos -= vehicles[i].speed;
      vehicles[i].drawVehicle();
    }
  }

  levelOneCollisionCheck(vehicle) {
    return !(
      playerLevelOne.top() > vehicle.bottom() ||
      playerLevelOne.bottom() < vehicle.top() ||
      playerLevelOne.left() > vehicle.right() ||
      (playerLevelOne.left() < vehicle.left() &&
        playerLevelOne.right() < vehicle.left()) ||
      playerLevelOne.right() < vehicle.left()
    );
  }

  levelOneVictoryCheck(playerYPos) {
    if (playerYPos < 30) {
      this.stopLevelOne();
      this.loadLevelOneVictoryScreen();
    }
  }

  countdownToStartLevelOne() {
    let count = 5 - Math.floor(this.frames / 100);

    if (count < -2) return;

    this.ctx.font = "50px roboto";
    this.ctx.fillStyle = "black";
    if (count === 0 && !this.didLevelOneStart) {
      this.didLevelOneStart = true;
      this.levelOneController = new AbortController();
      const signal = this.levelOneController.signal;

      this.ctx.fillText("GO!", 320, 240);

      document.addEventListener(
        "keydown",
        (event) => {
          switch (event.keyCode) {
            case 38:
              playerLevelOne.moveUp();
              break;
            case 40:
              playerLevelOne.moveDown();
              break;
            case 37:
              playerLevelOne.moveLeft();
              break;
            case 39:
              playerLevelOne.moveRight();
              break;
          }
        },
        { signal: signal }
      );
    } else if (count == 0 && this.didLevelOneStart) {
      this.ctx.fillText("GO!", 320, 240);
    } else if (count > 0) {
      this.ctx.fillText(`${count}`, 320, 240);
    }
  }

  removeLevelOneKeyEventListener() {
    console.log("Removing event listener");
    this.levelOneController.abort();
  }

  resetLevelOne() {
    playerLevelOne = new Player(300, 485, 40, 60);

    vehicles = [];

    this.frames = 0;

    this.didLevelOneStart = false;

    this.levelOneAbortController = new AbortController();
  }

  /* Level Two */

  loadLevelTwo() {
    this.clearGameArea();

    this.gameState.levelToStart = 2;

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);

    const header = "Inside the bar...";
    const p1 = "you're very thirsty and begin ordering beer.";
    const p2 = "You tell the bartender to just keep them coming.";
    const p3 =
      "Drink as much beer as you can by collecting the falling bottles.";
    const p4 =
      "Control your character by using the left and right keyboard buttons.";
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
    this.gameState.shouldStartLevel = true;
  }

  /*  */

  /* Utilities */

  drawButton(text) {
    const rectangle = new Path2D();
    const rectangleX = 250;
    const rectangleY = 450;
    const rectangleWidth = 200;
    const rectangleHeight = 50;
    rectangle.rect(rectangleX, rectangleY, rectangleWidth, rectangleHeight);
    this.ctx.fillStyle = "red";
    this.ctx.fill(rectangle);

    const button = rectangle;
    const buttonDimensions = {
      rectangleX,
      rectangleY,
      rectangleWidth,
      rectangleHeight,
    };

    this.ctx.fillStyle = "white";
    this.ctx.fillText(text, 290, 483);

    this.setUpEventListener(button, buttonDimensions);
  }

  setUpEventListener(button, buttonDimensions) {
    this.canvas.addEventListener(
      "click",
      (event) => {
        button.rect(
          buttonDimensions.rectangleX,
          buttonDimensions.rectangleY,
          buttonDimensions.rectangleWidth,
          buttonDimensions.rectangleHeight
        );

        const isMouseOnBtn = this.ctx.isPointInPath(
          button,
          event.offsetX,
          event.offsetY
        );

        if (isMouseOnBtn && !this.gameState.shouldStartLevel) {
          this.loadLevel(this.gameState.levelToLoad);
        } else if (isMouseOnBtn && this.gameState.shouldStartLevel) {
          this.startLevel(this.gameState.levelToStart);
        }
      },
      { once: true }
    );
  }

  clearGameArea() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  loadLevel(levelToLoad) {
    console.log("Loading level: ", levelToLoad);
    switch (levelToLoad) {
      case 0:
        this.loadStartScreen();
        break;
      case 1:
        this.loadLevelOne();
        break;
      case 2:
        this.loadLevelTwo();
        break;
    }
  }

  startLevel(levelToStart) {
    switch (levelToStart) {
      case 1:
        this.startLevelOne();
        break;
    }
  }
}

const game = new Game();

class GameObject {
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

class Player extends GameObject {
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

let vehicles = [];

class Vehicle extends GameObject {
  constructor(xPos, yPos, width, height, speed) {
    super(xPos, yPos, width, height);
    this.speed = speed;
  }

  drawVehicle() {
    const ctx = game.ctx;
    const vehicleImg = new Image();
    vehicleImg.src = "./images/bus-top-down-v3.png";

    ctx.drawImage(vehicleImg, this.xPos, this.yPos, this.width, this.height);
  }
}

let playerLevelOne = new Player(300, 485, 40, 60);

const checkPlayerCollision = (vehicleArray) => {
  const collided = vehicleArray.some((vehicle) => {
    return game.levelOneCollisionCheck(vehicle);
  });
  if (collided) {
    game.stopLevelOne();
  }
};

const drawLevelOne = () => {
  game.clearGameArea();
  game.drawLevelOneBackground();
  playerLevelOne.updatePosition();
  game.updateLevelOneVehiclePos();
  checkPlayerCollision(vehicles);
  game.levelOneVictoryCheck(playerLevelOne.yPos);
  game.countdownToStartLevelOne();
};

window.onload = () => {
  game.loadStartScreen(0);
};
