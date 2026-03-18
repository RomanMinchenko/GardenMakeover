import EventManager from "../../../utils/EventManager";
import { Utils } from "../../../utils/Utils";
import { GameEventType } from "../../events/GameEvents";
import { EButtonKey } from "../enums/enums";
import { IButtonConfig, IButtonContentConfig } from "../interface/interfaces";

export default class Button extends Phaser.GameObjects.Container {
  public isClicked: boolean = false;
  public buttonKey: EButtonKey;
  public permanentDisable: boolean = false;

  private config: IButtonConfig;
  private bgTexture: Phaser.GameObjects.Sprite | null;
  private mainIconTexture: Phaser.GameObjects.Sprite | null;
  private additionalIconTexture: Phaser.GameObjects.Sprite | null;
  private btnText: Phaser.GameObjects.Text | null;

  constructor(scene: Phaser.Scene, key: EButtonKey, config: IButtonConfig) {
    super(scene);
    this.buttonKey = key;

    this.config = config;
    this.init();
    this.calculateContainerSize();
    this.listenSignals();
  }

  public enableInput(): void {
    if (this.permanentDisable) return;

    const { width, height } = this;
    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, width, height),
      Phaser.Geom.Rectangle.Contains
    );

    this.alpha = 1;
  }

  public disableInput(): void {
    this.disableInteractive();
    this.alpha = 0.5;
  }

  public getTextValue(): string | null {
    return this.btnText ? this.btnText.text : null;
  }

  private init(): void {
    const { bgTexture, mainIconTexture, additionalIconTexture, text } = this.config;
    this.bgTexture = bgTexture && this.initTexture(bgTexture) || null;
    this.mainIconTexture = mainIconTexture && this.initTexture(mainIconTexture) || null;
    this.additionalIconTexture = additionalIconTexture && this.initTexture(additionalIconTexture) || null;
    this.btnText = text && this.initText(text) || null;
  }

  private calculateContainerSize(): void {
    const {
      bgTexture,
      mainIconTexture,
      additionalIconTexture,
      btnText,
    } = this;

    const width = Math.max(
      bgTexture?.displayWidth || 0,
      mainIconTexture?.displayWidth || 0,
      additionalIconTexture?.displayWidth || 0,
      btnText?.width || 0
    );

    const height = Math.max(
      bgTexture?.displayHeight || 0,
      mainIconTexture?.displayHeight || 0,
      additionalIconTexture?.displayHeight || 0,
      btnText?.height || 0
    );

    this.setSize(width, height);
  }

  private initTexture(contentConfig: IButtonContentConfig): Phaser.GameObjects.Sprite {
    const { value, position, scale } = contentConfig;
    const { x, y } = position;
    const view = Utils.spriteMake(this.scene, x, y, value);
    view.setScale(scale);
    view.setOrigin(0.5);
    this.add(view);

    return view;
  }

  private initText(contentConfig: IButtonContentConfig): Phaser.GameObjects.Text {
    const { value, position } = contentConfig;
    const { x, y } = position;
    const text = Utils.textMake(this.scene, x, y, value, {
      color: "#36103d",
    });
    text.setOrigin(0.5);
    this.add(text);

    return text;
  }

  private listenSignals(): void {
    this.on("pointerdown", () => {
      this.onPointerDown();
    });
  }

  private async onPointerDown(): Promise<void> {
    await this.animateClick();
    this.isClicked = !this.isClicked;
    EventManager.getInstance().emit(GameEventType.BUTTON_CLICK, { buttonKey: this.buttonKey });
  }

  private animateClick(): Promise<void> {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 100,
        yoyo: true,
        onComplete: () => resolve(),
      });
    });
  }
}