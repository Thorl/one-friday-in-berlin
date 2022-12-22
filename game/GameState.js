class GameState {
  constructor() {
    this.levelToLoad = 1;
    this.levelToStart = 1;
    this.shouldStartLevel = false;
    this.didLevelStart = false;
    this.frames = 0;
  }

  updateFrames() {
    this.frames += 1;
  }
}

export const gameState = new GameState();
