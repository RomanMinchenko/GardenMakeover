import EventManager from "../../../utils/EventManager";
import { Utils } from "../../../utils/Utils";
import { ResourceType } from "../../enum/enums";
import { GameEventType } from "../../events/GameEvents";

export default class ResourceUnit extends Phaser.GameObjects.Container {
  public unitId: string;
  public unitType: ResourceType;

  private icon: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, unitId: string, unitType: ResourceType) {
    super(scene);
    this.unitId = unitId;
    this.unitType = unitType;
    this.visible = false;
    this.init();
  }

  public update(time: number, delta: number): void {
    // Update resource unit elements here
  }

  public resize(width: number, height: number): void {
    const iconWidth = this.icon.displayWidth;

    const iconX = -iconWidth / 2;
    this.icon.setPosition(iconX, 0);
  }

  public show(): Promise<void> {
    const startX = this.x;
    const startY = this.y;
    const difX = Phaser.Math.Between(-50, 50);
    const difY = Phaser.Math.Between(-50, 50);
    const randomFlip = Phaser.Math.Between(0, 1) === 0;
    this.icon.setFlipX(randomFlip);
    this.setScale(0);
    this.setVisible(true);

    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this,
        scale: 1,
        duration: 250,
        ease: "Cubic.easeOut",
        onUpdate: (tween) => {
          const progress = tween.progress;
          const bounce = Math.sin(progress * Math.PI)
            * -Math.sign(difY)

          const offsetX = difX * progress;
          const offsetY = difY * bounce;

          this.setPosition(startX + offsetX, startY + offsetY);
        },
        onComplete: () => {
          resolve();
        }
      });
    });
  }

  public collect(counter: Phaser.GameObjects.Container, delay: number): Promise<void> {
    const startX = this.x;
    const startY = this.y;
    const targetX = counter.x;
    const targetY = counter.y;
    const difX = targetX - startX;
    const difY = targetY - startY;

    const obj = {
      t: 0,
      s: 1
    };

    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: obj,
        t: 1,
        s: 0.5,
        duration: 1000,
        delay: delay,
        ease: "Cubic.easeIn",
        onUpdate: () => {
          const { t, s } = obj;
          const bounce = -Math.pow(t - 1, 2) + 1;

          const offsetY = difY * bounce;
          const offsetX = difX * t;

          this.setPosition(startX + offsetX, startY + offsetY);
          this.setScale(s);
        },
        onComplete: () => {
          this.setVisible(false);
          resolve();
        }
      });
    });
  }

  public reset(): void {
    this.setPosition(0, 0);
    this.setScale(1);
    this.setVisible(false);
    this.parentContainer?.remove(this);
  }

  private init(): void {
    this.initIcon();
    this.listenSignal();
  }

  private initIcon(): void {
    const icon = this.icon = Utils.spriteMake(this.scene, 0, 0, this.unitType);
    icon.setScale(0.1);
    this.add(icon);
  }

  private listenSignal(): void {
    this.icon.setInteractive({ useHandCursor: true });
    this.icon.on("pointerdown", () => {
      EventManager.getInstance().emit(GameEventType.ON_RESOURCE_UNIT_CLICKED, { type: this.unitType });
    });
  }
}
