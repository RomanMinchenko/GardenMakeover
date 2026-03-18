import EventManager from "../../../utils/EventManager";
import { Utils } from "../../../utils/Utils";
import { GameEventType } from "../../events/GameEvents";
import Button from "../components/Button";
import { EButtonKey } from "../enums/enums";

export default class StartScreen extends Phaser.GameObjects.Container {
  private overlay: Phaser.GameObjects.Rectangle;
  private startButton: Button;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.setVisible(false);
    this.init();
  }

  public update(time: number, delta: number): void {
    // Update screen elements here
  }

  public resize(width: number, height: number): void {
    this.overlay.setSize(width, height);
  }

  public show(): void {
    this.setVisible(true);
  }

  public hide(): void {
    this.setVisible(false);
  }

  public enableInput(): void {
    this.startButton.enableInput();
  }

  public disableInput(): void {
    this.startButton.disableInput();
  }

  private init(): void {
    this.initOverlay();
    this.initStartButton();
    this.initText();

    this.listenSignals();
  }

  private initOverlay(): void {
    const overlay = this.overlay = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 100, 100, 0xcfe8a9, 0.7);
    this.add(overlay);

    overlay.setInteractive();
  }

  private initStartButton(): void {
    const buttonConfig = {
      bgTexture: {
        value: "start",
        position: { x: 0, y: 0 },
        scale: 1
      },
    };

    const startButton = this.startButton = new Button(this.scene, EButtonKey.START_BUTTON, buttonConfig);
    this.add(startButton);
  }

  private initText(): void {
    const titleText = Utils.textMake(this.scene, 0, 100, "START GAME", {
      fontSize: "48px",
      color: "#4CAF50",
    });
    titleText.setOrigin(0.5);
    titleText.setStroke("#1B5E20", 4);
    this.add(titleText);
  }

  private listenSignals(): void {
    const eventManager = EventManager.getInstance();
    eventManager.on(GameEventType.BUTTON_CLICK, (data) => {
      if (data.buttonKey !== EButtonKey.START_BUTTON) return;
      eventManager.emit(GameEventType.GAME_STARTED, {});
    });
  }
}
