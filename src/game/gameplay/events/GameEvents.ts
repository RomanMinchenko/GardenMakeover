import { ResourceType, TaskType } from "../enum/enums";
import { EButtonKey } from "../ui/enums/enums";
import { IUnit, UnitType } from "../world/unit/UnitTypes";

export enum GameEventType {
  INPUT_POINTER_DOWN = "inputPointerDown",
  BUTTON_CLICK = "buttonClick",
  GAME_STARTED = "gameStarted",
  GAME_STOPPED = "gameStopped",
  GAME_CREATED = "gameCreated",
  ITEM_SELECTED = "itemSelected",
  UNIT_PLACED = "unitPlaced",
  UNIT_REMOVED = "unitRemoved",
  RESOURCE_PRODUCED = "resourceProduced",
  RESOURCE_COLLECTED = "resourceCollected",
  RESOURCE_USED = "resourceUsed",
  ON_RESOURCE_UNIT_CLICKED = "onResourceUnitClicked",
  TASK_COMPLETED = "taskCompleted",
  SKIP_DAY_CLICKED = "skipDayClicked",
  NEW_DAY_STARTED = "newDayStarted",
}

export interface GameEventPayload {
  [GameEventType.INPUT_POINTER_DOWN]: { pointer: Phaser.Input.Pointer };
  [GameEventType.BUTTON_CLICK]: { buttonKey: EButtonKey };
  [GameEventType.GAME_STARTED]: {};
  [GameEventType.GAME_STOPPED]: {};
  [GameEventType.GAME_CREATED]: {};
  [GameEventType.ITEM_SELECTED]: { itemType: UnitType | null };
  [GameEventType.UNIT_PLACED]: { unitGroup: IUnit };
  [GameEventType.UNIT_REMOVED]: { unitId: string };
  [GameEventType.RESOURCE_PRODUCED]: { type: ResourceType, position: { x: number, y: number } };
  [GameEventType.RESOURCE_COLLECTED]: {resourceType: ResourceType; amount: number};
  [GameEventType.RESOURCE_USED]: {resourceType: ResourceType; amount: number};
  [GameEventType.ON_RESOURCE_UNIT_CLICKED]: { type: ResourceType };
  [GameEventType.TASK_COMPLETED]: { task: TaskType, resourceType: ResourceType };
  [GameEventType.SKIP_DAY_CLICKED]: {};
  [GameEventType.NEW_DAY_STARTED]: {};
}
