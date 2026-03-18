import EventManager from "../../../utils/EventManager";
import { Utils } from "../../../utils/Utils";
import { GAME_TASKS } from "../../data/gameData";
import { ResourceType, TaskType } from "../../enum/enums";
import { GameEventType } from "../../events/GameEvents";
import ProgressBar from "./ProgressBar";

const GAP = 7;

export default class TaskProgressBar extends Phaser.GameObjects.Container {
  private icon: Phaser.GameObjects.Sprite;
  private taskText: Phaser.GameObjects.Text;
  private progressBar: ProgressBar;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.init();
  }

  public update(time: number, delta: number): void {
    this.progressBar.update(time, delta);
  }

  public resize(width: number, height: number): void {
    const textWidth = this.taskText.width;
    const iconWidth = this.icon.displayWidth;
    const textOrIconHeight = Math.max(this.taskText.height, this.icon.displayHeight);
    const barHeight = this.progressBar.getBounds().height;

    const textX = -(iconWidth + GAP) / 2;
    const iconX = (textWidth + GAP) / 2;
    const textNIconY = -(barHeight + GAP) / 2;
    const barY = (textOrIconHeight + GAP) / 2;

    this.taskText.setPosition(textX, textNIconY);
    this.icon.setPosition(iconX, textNIconY);
    this.progressBar.setPosition(0, barY);

    this.progressBar.resize(width, height);
  }

  private init(): void {
    this.initText();
    this.initIcon();
    this.initBar();

    this.listenSignals();
  }

  private initText(): void {
    const taskValue = GAME_TASKS[TaskType.COLLECT][ResourceType.EGGS];
    const text = this.taskText = Utils.textMake(this.scene, 0, 0, `Collect ${taskValue}`, {
      fontSize: "20px",
      color: "#FCF6BE",
    });
    text.setOrigin(0.5);
    text.setStroke("#36103d", 4)
    this.add(text);
  }

  private initIcon(): void {
    const icon = this.icon = Utils.spriteMake(this.scene, 0, 0, "egg");
    icon.setScale(0.08);
    this.add(icon);
  }

  private initBar(): void {
    const bar = this.progressBar = new ProgressBar(this.scene);
    this.add(bar);
  }

  private listenSignals(): void {
    EventManager.getInstance().on(GameEventType.RESOURCE_COLLECTED, (data) => {
      this.onResourceUpdated(data);
    });
  }

  private onResourceUpdated(data: { resourceType: ResourceType; amount: number }): void {
    const { resourceType, amount } = data;
    const eventManager = EventManager.getInstance();
    const taskGoalValue = GAME_TASKS[TaskType.COLLECT][resourceType];
    if (!taskGoalValue) return;
    const progress = amount / taskGoalValue!;
    this.progressBar.setProgress(progress);

    if (progress >= 1) {
      eventManager.emit(GameEventType.TASK_COMPLETED, { task: TaskType.COLLECT, resourceType: resourceType });
      eventManager.emit(GameEventType.GAME_STOPPED, {});
    }
  }
}