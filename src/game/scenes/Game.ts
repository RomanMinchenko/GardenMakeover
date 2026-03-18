import { Scene } from "phaser";
import { GameContainer } from "../gameplay/GameContainer";
import EventManager from "../utils/EventManager";
import { GameEventType } from "../gameplay/events/GameEvents";
import AudioManager from "../utils/AudioManager";

export class Game extends Scene {
  private viewContainer: Phaser.GameObjects.Container;
  private gameContainer: GameContainer;
  private timeMultiplier: number = 0;

  constructor() {
    super("Game");
  }

  public update(time: number, delta: number): void {
    if (this.gameContainer) {
      const deltaInSeconds = (delta / 1000) * this.timeMultiplier;
      const safeDelta = Math.min(deltaInSeconds, 0.1);
      this.gameContainer.update(time, safeDelta);
    }
  }

  public create() {
    this.createAudioManager();
    this.createViewContainer();
    this.initGameContainer();
    this.listenBrowserEvents();
    this.listenGameSignals();

    EventManager.getInstance().emit(GameEventType.GAME_CREATED, {});
  }

  private createAudioManager(): void {
    new AudioManager(this);
  }

  private createViewContainer(): void {
    this.viewContainer = this.add.container();
  }

  private initGameContainer(): void {
    this.gameContainer = new GameContainer(this);
    this.viewContainer.add(this.gameContainer);
  }

  private listenBrowserEvents(): void {
    window.addEventListener("blur", this.onBlur);
    window.addEventListener("focus", this.onFocus);
    window.addEventListener("resize", this.onResize);
    this.onResize();
  }

  private onFocus = (): void => {
    if (this.gameContainer) {
      this.time.paused = false;
    }
  }

  private onBlur = (): void => {
    if (this.gameContainer) {
      this.time.paused = true;
    }
  }

  private onResize = (): void => {
    const container = document.getElementById("game-container");

    const width = container?.clientWidth ?? window.innerWidth;
    const height = container?.clientHeight ?? window.innerHeight;
    this.game.scale.resize(width, height);
    this.viewContainer.setPosition(width / 2, height / 2);

    if (this.gameContainer) {
      this.gameContainer.resize(width, height);
    }
  }

  private listenGameSignals(): void {
    const eventManager = EventManager.getInstance();
    eventManager.on(GameEventType.GAME_STARTED, () => this.startGame());
    eventManager.on(GameEventType.GAME_STOPPED, () => this.stopGame());
    eventManager.on(GameEventType.SKIP_DAY_CLICKED, () => this.onNextDayButtonClicked());
    eventManager.on(GameEventType.NEW_DAY_STARTED, () => this.onNextDayStarted());
  }

  private startGame(): void {
    this.timeMultiplier = 1;
    this.onResize();
  }

  private stopGame(): void {
    this.timeMultiplier = 0;
  }

  private onNextDayButtonClicked(): void {
    this.timeMultiplier = 20;
  }

  private onNextDayStarted(): void {
    this.timeMultiplier = 1;
  }
}
