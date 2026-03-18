import { Utils } from "../../../utils/Utils";
import { ResourceType } from "../../enum/enums";
import Counter from "./Counter";

const OFFSET_Y = 35;

export default class ResourceCounter extends Phaser.GameObjects.Container {
  private moneyCounter: Counter;
  private cornCounter: Counter;
  private eggCounter: Counter;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.init();
  }

  public update(time: number, delta: number): void {
    this.moneyCounter.update(time, delta);
    this.cornCounter.update(time, delta);
    this.eggCounter.update(time, delta);
  }

  public resize(width: number, height: number): void {
    this.moneyCounter.setPosition(0, -OFFSET_Y);
    this.cornCounter.setPosition(0, 0);
    this.eggCounter.setPosition(0, OFFSET_Y);

    this.moneyCounter.resize(width, height);
    this.cornCounter.resize(width, height);
    this.eggCounter.resize(width, height);
  }

  private init(): void {
    this.initBg();

    this.moneyCounter = this.initCounter(ResourceType.MONEY);
    this.cornCounter = this.initCounter(ResourceType.CORN);
    this.eggCounter = this.initCounter(ResourceType.EGGS);
  }

  private initBg(): void {
    const bg = Utils.spriteMake(this.scene, 0, 0, "resourcesBg");
    this.add(bg);
  }

  private initCounter(counterName: ResourceType): Counter {
    const counter = new Counter(this.scene, counterName, counterName);
    this.add(counter);

    return counter;
  }
}