import { Utils } from "../../../utils/Utils";
import { ResourceType } from "../../enum/enums";
import ResourceManager from "./ResourceManager";

const OFFSET_X = 15;

export default class Counter extends Phaser.GameObjects.Container {
  private counterKey: ResourceType;
  private counter: number = 0;
  private icon: Phaser.GameObjects.Sprite;
  private countText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, iconKey: string, counterKey: ResourceType) {
    super(scene);
    this.counterKey = counterKey;

    this.init(iconKey);
  }

  public update(time: number, delta: number): void {
    const newCounter = ResourceManager.getInstance().getResource(this.counterKey);
    if (newCounter !== this.counter) {
      this.counter = newCounter;
      const text = this.counter > 999 ? "1k" : this.counter.toString();
      this.countText.setText(text);
    }
  }
  
  public resize(width: number, height: number): void {
    this.icon.setPosition(-OFFSET_X, 0);
    this.countText.setPosition(OFFSET_X, 0);
  }

  private init(iconKey: string): void {
    this.initIcon(iconKey);
    this.initText();
  }

  private initIcon(iconKey: string): void {
    const icon = this.icon = Utils.spriteMake(this.scene, 0, 0, iconKey);
    icon.setScale(0.1);
    this.add(icon);
  }

  private initText(): void {
    const text = this.countText = Utils.textMake(this.scene, 0, 0, this.counter.toString(), {
      fontSize: "24px",
      color: "#36103d",
    });
    text.setOrigin(0.5);
    this.add(text);
  }
}