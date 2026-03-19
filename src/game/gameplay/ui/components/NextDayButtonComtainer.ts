import EventManager from "../../../utils/EventManager";
import { Utils } from "../../../utils/Utils";
import { GameEventType } from "../../events/GameEvents";
import { EButtonKey } from "../enums/enums";
import { IButtonConfig } from "../interface/interfaces";
import Button from "./Button";

const GAP = 10;

export default class NextDayButtonContainer extends Phaser.GameObjects.Container {
  private nextDayButton: Button;
  public timeIcon: Phaser.GameObjects.Sprite;
  public timeText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.init();
  }

  public update(time: number, delta: number): void {
    // 
  }

  public resize(width: number, height: number): void {
    this.setPositions();
  }

  public enableInput(): void {
    this.nextDayButton.enableInput();
  }

  public disableInput(): void {
    this.nextDayButton.disableInput();
  }

  private init(): void {
    this.initNextDayButton();
    this.initTimeText();
    this.initTimeIcon();
    this.setPositions();
    this.listenSignals();
  }

  private initNextDayButton(): void {
    const buttonConfig: IButtonConfig = {
      bgTexture: {
        value: "skip_day",
        position: { x: 0, y: 0 },
        scale: 1,
      },
      text: {
        value: "x20",
        position: { x: 0, y: 0 },
        scale: 1,
      },
    };
    const nextDayButton = this.nextDayButton = new Button(this.scene, EButtonKey.NEXT_DAY, buttonConfig);
    this.add(nextDayButton);
  }

  private initTimeText(): void {
    const text = this.timeText = Utils.textMake(this.scene, 0, 0, "x1", {
      fontSize: "16px",
      color: "#FFFFFF",
    });
    text.setOrigin(0.5);
    this.add(text);
  }

  private initTimeIcon(): void {
    const icon = this.timeIcon = Utils.spriteMake(this.scene, 0, 0, "time_icon");
    icon.setScale(0.5);
    this.add(icon);
  }

  private setPositions(): void {
    const { nextDayButton, timeText, timeIcon } = this;
    const totalWidth = [nextDayButton, timeIcon, timeText]
      .reduce((sum, element) => sum + element.displayWidth, 0) + GAP * 2;
    const startX = -totalWidth / 2;

    const timeIconX = startX + timeIcon.displayWidth / 2;
    timeIcon.setPosition(timeIconX, 0);

    const timeTextX = timeIconX + timeIcon.displayWidth / 2 + timeText.displayWidth / 2 + GAP;
    timeText.setPosition(timeTextX, 0);

    const nextDayButtonX = timeTextX + timeText.displayWidth / 2 + nextDayButton.displayWidth / 2 + GAP;
    nextDayButton.setPosition(nextDayButtonX, 0);
  }

  private listenSignals(): void {
    const eventManager = EventManager.getInstance();

    eventManager.on(GameEventType.SKIP_DAY_CLICKED, () => {
      this.timeText.setText("x20");
    });

    eventManager.on(GameEventType.NEW_DAY_STARTED, () => {
      this.timeText.setText("x1");
    });
  }
}
