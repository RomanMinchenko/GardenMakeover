import Screens from "./ui/screens/Screens";
import UI from "./ui/UI";
import InputController from "./inputController/InputController";
import World from "./world/World";
import { GameEventType } from "./events/GameEvents";
import EventManager from "../utils/EventManager";
import AudioManager from "../utils/AudioManager";
import { UnitType } from "./world/unit/UnitTypes";
import { EButtonKey } from "./ui/enums/enums";

export class GameContainer extends Phaser.GameObjects.Container {
  public inputController: InputController; // TEMP public => private
  private world: World;
  private screens: Screens;
  private ui: UI;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.init();
  }

  public update(time: number, delta: number): void {
    this.world.update(time, delta);
    this.screens.update(time, delta);
    this.ui.update(time, delta);
  }

  public resize(width: number, height: number): void {
    this.world.resize(width, height);
    this.screens.resize(width, height);
    this.ui.resize(width, height);
  }

  private init(): void {
    this.initWorld();
    this.initUI();
    this.initScreens();
    this.initInputController();

    this.listenSignals();
  }

  private initWorld(): void {
    this.world = new World();
  }

  private initUI(): void {
    const ui = (this.ui = new UI(this.scene));
    this.add(ui);
  }

  private initScreens(): void {
    const screens = (this.screens = new Screens(this.scene));
    this.add(screens);
  }

  private initInputController(): void {
    this.inputController = new InputController(this.scene);
  }

  private listenSignals(): void {
    const eventManager = EventManager.getInstance();
    const audioManager = AudioManager.getInstance();

    eventManager.on(GameEventType.GAME_STARTED, () => {
      audioManager.play("theme", 0.5, true);
      this.ui.show();
      this.ui.enableInput();
    });

    eventManager.on(GameEventType.BUTTON_CLICK, (data) => {
      audioManager.play("click", 1);

      if (data.buttonKey === EButtonKey.NEXT_DAY) {
        eventManager.emit(GameEventType.SKIP_DAY_CLICKED, {});
      }
    });

    eventManager.on(GameEventType.UNIT_PLACED, (data) => {
      const { unitGroup } = data;

      if (unitGroup.unitType === UnitType.CHICKEN) {
        audioManager.play("chicken", 1);
      } else {
        audioManager.play("throw_spear", 1);
      }
    });

    eventManager.on(GameEventType.RESOURCE_COLLECTED, () => {
      audioManager.play("collect", 0.3);
    });
    
    eventManager.on(GameEventType.TASK_COMPLETED, (data) => {
      audioManager.stopAll();
      audioManager.play("popup_chest");
    });
  }
}