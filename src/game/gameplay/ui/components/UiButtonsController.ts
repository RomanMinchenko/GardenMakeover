import EventManager from "../../../utils/EventManager";
import { ResourceType } from "../../enum/enums";
import { GameEventType } from "../../events/GameEvents";
import { UnitType } from "../../world/unit/UnitTypes";
import { EButtonKey } from "../enums/enums";
import UiButtonsGroup from "./UiButtonsGroup";

const ITEM_TYPE_BUTTONS = [EButtonKey.PLANTS_BUTTON, EButtonKey.ANIMALS_BUTTON, EButtonKey.CONSTRUCTION_BUTTON];
const PLANT_BUTTONS = [EButtonKey.STRAWBERRY_BUTTON, EButtonKey.CORN_BUTTON, EButtonKey.TOMATO_BUTTON, EButtonKey.GRAPE_BUTTON];
const ANIMAL_BUTTONS = [EButtonKey.CHICKEN_BUTTON, EButtonKey.SHEEP_BUTTON, EButtonKey.COW_BUTTON];
const CONSTRUCTION_BUTTONS = [EButtonKey.BARN_BUTTON, EButtonKey.FENCE_BUTTON];
const UNIT_TYPE_BY_BUTTON_KEY: Record<EButtonKey, UnitType | null> = {
  [EButtonKey.STRAWBERRY_BUTTON]: UnitType.STRAWBERRY,
  [EButtonKey.CORN_BUTTON]: UnitType.CORN,
  [EButtonKey.TOMATO_BUTTON]: UnitType.TOMATO,
  [EButtonKey.GRAPE_BUTTON]: UnitType.GRAPE,
  [EButtonKey.CHICKEN_BUTTON]: UnitType.CHICKEN,
  [EButtonKey.SHEEP_BUTTON]: UnitType.SHEEP,
  [EButtonKey.COW_BUTTON]: UnitType.COW,
  [EButtonKey.BARN_BUTTON]: UnitType.BARN,
  [EButtonKey.FENCE_BUTTON]: UnitType.FENCE,
  [EButtonKey.START_BUTTON]: null,
  [EButtonKey.LINK_BUTTON]: null,
  [EButtonKey.NEXT_DAY]: null,
  [EButtonKey.CONSTRUCTION_BUTTON]: null,
  [EButtonKey.ANIMALS_BUTTON]: null,
  [EButtonKey.PLANTS_BUTTON]: null,
}

export default class UiButtonsController {
  public selectedItemType: EButtonKey | null = null;
  private itemsButtonGroup: UiButtonsGroup;
  private plantsButtonGroup: UiButtonsGroup;
  private animalsButtonGroup: UiButtonsGroup;
  private constructionButtonGroup: UiButtonsGroup;

  constructor(
    itemsButtonGroup: UiButtonsGroup,
    plantsButtonGroup: UiButtonsGroup,
    animalsButtonGroup: UiButtonsGroup,
    constructionButtonGroup: UiButtonsGroup
  ) {
    this.itemsButtonGroup = itemsButtonGroup;
    this.plantsButtonGroup = plantsButtonGroup;
    this.animalsButtonGroup = animalsButtonGroup;
    this.constructionButtonGroup = constructionButtonGroup;

    this.listenSignals();
  }

  private listenSignals(): void {
    const eventManager = EventManager.getInstance();

    eventManager.on(GameEventType.BUTTON_CLICK, (data) => {
      const { buttonKey } = data;
      if (ITEM_TYPE_BUTTONS.includes(buttonKey)) {
        this.onItemsButtonClick(buttonKey);
      } else if (PLANT_BUTTONS.includes(buttonKey)) {
        this.onPlantsButtonClick(buttonKey);
      } else if (ANIMAL_BUTTONS.includes(buttonKey)) {
        this.onAnimalsButtonClick(buttonKey);
      } else if (CONSTRUCTION_BUTTONS.includes(buttonKey)) {
        this.onConstructorsButtonClick(buttonKey);
      }

      const itemType = UNIT_TYPE_BY_BUTTON_KEY[this.selectedItemType as EButtonKey] ?? null;
      eventManager.emit(GameEventType.ITEM_SELECTED, { itemType });
    });

    eventManager.on(GameEventType.UNIT_PLACED, () => {
      this.setButtonsUnclickedState();
      this.itemsButtonGroup.enableInput();
      this.selectedItemType = null;
    });

    eventManager.on(GameEventType.RESOURCE_USED, (data) => {
      this.updateButtonsStates(data);
    });

    eventManager.on(GameEventType.RESOURCE_COLLECTED, (data) => {
      this.updateButtonsStates(data);
    });
  }

  private updateButtonsStates(data: { resourceType: ResourceType; amount: number }): void {
    if (data.resourceType === ResourceType.MONEY) {

      this.plantsButtonGroup
        .disableInput()
        .enableInput();
      this.animalsButtonGroup
        .disableInput()
        .enableInput();
    }
  }

  private onItemsButtonClick(buttonKey: EButtonKey): void {
    const button = this.itemsButtonGroup.getButtons();
    const clickedButton = button.get(buttonKey);
    this.setButtonsUnclickedState();
    this.selectedItemType = null;

    const clickedButtonState = clickedButton?.isClicked ?? false;
    if (!clickedButtonState) this.selectedItemType = null;
    switch (buttonKey) {
      case EButtonKey.PLANTS_BUTTON:
        this.onPlantsGroupButtonClick(clickedButtonState);
        break;
      case EButtonKey.ANIMALS_BUTTON:
        this.onAnimalsGroupButtonClick(clickedButtonState);
        break;
      case EButtonKey.CONSTRUCTION_BUTTON:
        this.onConstructionGroupButtonClick(clickedButtonState);
        break;
    }
  }

  private onPlantsGroupButtonClick(isButtonClicked: boolean): void {
    if (isButtonClicked) {
      this.plantsButtonGroup.show();
      this.plantsButtonGroup.enableInput();

      this.animalsButtonGroup.hide();
      this.animalsButtonGroup.disableInput();

      this.constructionButtonGroup.hide();
      this.constructionButtonGroup.disableInput();
      const buttons = this.itemsButtonGroup.getButtons();
      buttons.forEach((button) => {
        if (button.buttonKey !== EButtonKey.PLANTS_BUTTON) {
          button.isClicked = false;
        }
      });
    } else {
      const buttons = this.plantsButtonGroup.getButtons();
      buttons.forEach((button) => button.isClicked = false);
      this.plantsButtonGroup.hide();
      this.plantsButtonGroup.disableInput();
    }
  }

  private onAnimalsGroupButtonClick(isButtonClicked: boolean): void {
    if (isButtonClicked) {
      this.animalsButtonGroup.show();
      this.animalsButtonGroup.enableInput();

      this.plantsButtonGroup.hide();
      this.plantsButtonGroup.disableInput();

      this.constructionButtonGroup.hide();
      this.constructionButtonGroup.disableInput();
      const buttons = this.itemsButtonGroup.getButtons();
      buttons.forEach((button) => {
        if (button.buttonKey !== EButtonKey.ANIMALS_BUTTON) {
          button.isClicked = false;
        }
      });
    } else {
      this.animalsButtonGroup.hide();
      this.animalsButtonGroup.disableInput();
    }
  }

  private onConstructionGroupButtonClick(isButtonClicked: boolean): void {
    if (isButtonClicked) {
      this.constructionButtonGroup.show();
      this.constructionButtonGroup.enableInput();

      this.plantsButtonGroup.hide();
      this.plantsButtonGroup.disableInput();

      this.animalsButtonGroup.hide();
      this.animalsButtonGroup.disableInput();
      const buttons = this.itemsButtonGroup.getButtons();
      buttons.forEach((button) => {
        if (button.buttonKey !== EButtonKey.CONSTRUCTION_BUTTON) {
          button.isClicked = false;
        }
      });
    } else {
      this.constructionButtonGroup.hide();
      this.constructionButtonGroup.disableInput();
    }
  }

  private onPlantsButtonClick(buttonKey: EButtonKey): void {
    const buttons = this.plantsButtonGroup.getButtons();
    const clickedButton = buttons.get(buttonKey);

    const clickedButtonState = clickedButton?.isClicked ?? false;
    this.onItemButtonClick(buttonKey, clickedButtonState, buttons);
  }

  private onItemButtonClick(buttonKey: EButtonKey, isButtonClicked: boolean, buttons: Map<EButtonKey, any>): void {
    buttons.forEach(button => {
      if (button.buttonKey !== buttonKey) {
        button.isClicked = false;
      }
    });

    this.selectedItemType = isButtonClicked ? buttonKey : null;
  }

  private onAnimalsButtonClick(buttonKey: EButtonKey): void {
    const buttons = this.animalsButtonGroup.getButtons();
    const clickedButton = buttons.get(buttonKey);

    const nonClickedButtons = Array.from(buttons.values())
      .filter(button => button.buttonKey !== buttonKey);
    nonClickedButtons.forEach(button => {
      clickedButton?.isClicked
        ? button.disableInput()
        : button.enableInput();
    });

    const clickedButtonState = clickedButton?.isClicked ?? false;
    this.onItemButtonClick(buttonKey, clickedButtonState, buttons);
  }

  private onConstructorsButtonClick(buttonKey: EButtonKey): void {
    const buttons = this.constructionButtonGroup.getButtons();
    const clickedButton = buttons.get(buttonKey);

    const nonClickedButtons = Array.from(buttons.values())
      .filter(button => button.buttonKey !== buttonKey);
    nonClickedButtons.forEach(button => {
      clickedButton?.isClicked
        ? button.disableInput()
        : button.enableInput();
    });

    const clickedButtonState = clickedButton?.isClicked ?? false;
    this.onItemButtonClick(buttonKey, clickedButtonState, buttons);
  }

  private setButtonsUnclickedState(): void {
    this.plantsButtonGroup.getButtons().forEach(button => button.isClicked = false);
    this.animalsButtonGroup.getButtons().forEach(button => button.isClicked = false);
    this.constructionButtonGroup.getButtons().forEach(button => button.isClicked = false);
  }
}
