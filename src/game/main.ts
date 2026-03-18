import { Game as MainGame } from "./scenes/Game";
import { Preloader } from "./scenes/Preloader";
import { Game } from "phaser";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
  transparent: true,
  scene: [
    Preloader,
    MainGame,
  ]
};

class Main extends Game {
  constructor(GAME_CONFIG: any) {
    super(GAME_CONFIG);

    this.canvas.id = "garden_makeover";
  }
}

const StartGame = (parent: string) => {
  return new Main({ ...config, parent });
}

export default StartGame;
