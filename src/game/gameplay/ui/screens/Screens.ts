import EventManager from "../../../utils/EventManager";
import { GameEventType } from "../../events/GameEvents";
import EndScreen from "./EndScreen";
import StartScreen from "./StartScreen";

export default class Screens extends Phaser.GameObjects.Container {
  private startScreen: StartScreen;
  private endScreen: EndScreen;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.init();
  }

  public update(time: number, delta: number): void {
    this.startScreen.update(time, delta);
    this.endScreen.update(time, delta);
  }
  
  public resize(width: number, height: number): void {
    this.startScreen.resize(width, height);
    this.endScreen.resize(width, height);
  }

  private init(): void {
    this.initStartScreen();
    this.initEndScreen();

    this.listenSignals();
  }

  private initStartScreen(): void {
    const startScreen = this.startScreen = new StartScreen(this.scene);
    this.add(startScreen);
  }

  private initEndScreen(): void {
    const endScreen = this.endScreen = new EndScreen(this.scene);
    this.add(endScreen);
  }

  private listenSignals(): void {
    const eventManager = EventManager.getInstance();

    eventManager.on(GameEventType.GAME_CREATED, () => {
      this.startScreen.show();
      this.startScreen.enableInput();
    });

    eventManager.on(GameEventType.GAME_STARTED, () => {
      this.startScreen.hide();
    });

    eventManager.on(GameEventType.TASK_COMPLETED, (data) => {
      this.endScreen.show();
    });
  }
}