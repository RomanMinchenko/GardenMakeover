import EventManager from "../../utils/EventManager";
import { GameEventType } from "../events/GameEvents";

export default class InputController {
  private enabled: boolean = false;

  constructor(private scene: Phaser.Scene) {
    this.initListeners();
  }

  private initListeners(): void {
    const eventManager = EventManager.getInstance();
    this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => this.onPointerDown(pointer));

    eventManager.on(GameEventType.ITEM_SELECTED, (data) => {
      const { itemType } = data;
      this.enabled = itemType ? true : false;
    });

    eventManager.on(GameEventType.UNIT_PLACED, () => {
      this.enabled = false;
    });
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (!this.enabled) return;
    EventManager.getInstance().emit(GameEventType.INPUT_POINTER_DOWN, { pointer });
  }
}