import { UnitType } from "../../world/unit/UnitTypes";
import { EButtonGroupKey, EButtonKey } from "../enums/enums";
import { IButtonsGroupConfig } from "../interface/interfaces";

export const BUTTONS_GROUP_CONFIG: Record<EButtonGroupKey, IButtonsGroupConfig[]> = {
  [EButtonGroupKey.ITEM_TYPE]: [
    {
      key: EButtonKey.PLANTS_BUTTON,
      config: {
        bgTexture: { value: "plantsIcon", position: { x: 0, y: 0 }, scale: 1 },
      }
    },
    {
      key: EButtonKey.ANIMALS_BUTTON,
      config: {
        bgTexture: { value: "chickenIcon", position: { x: 0, y: 0 }, scale: 1 },
      }
    },
    {
      key: EButtonKey.CONSTRUCTION_BUTTON,
      config: {
        bgTexture: { value: "barnIcon", position: { x: 0, y: 0 }, scale: 1 },
      }
    },
  ],
  [EButtonGroupKey.PLANTS]: [
    {
      key: EButtonKey.STRAWBERRY_BUTTON,
      config: {
        bgTexture: { value: "btn_square_bg", position: { x: 0, y: 0 }, scale: 1 },
        mainIconTexture: { value: "strawberry", position: { x: 0, y: -10 }, scale: 0.14 },
        additionalIconTexture: { value: "moneyIcon", position: { x: -10, y: 15 }, scale: 0.1 },
        text: { value: "10", position: { x: 10, y: 15 }, scale: 1 }
      }
    },
    {
      key: EButtonKey.CORN_BUTTON,
      config: {
        bgTexture: { value: "btn_square_bg", position: { x: 0, y: 0 }, scale: 1 },
        mainIconTexture: { value: "corn", position: { x: 0, y: -10 }, scale: 0.12 },
        additionalIconTexture: { value: "moneyIcon", position: { x: -10, y: 15 }, scale: 0.1 },
        text: { value: "10", position: { x: 10, y: 15 }, scale: 1 }
      }
    },
    {
      key: EButtonKey.TOMATO_BUTTON,
      config: {
        bgTexture: { value: "btn_square_bg", position: { x: 0, y: 0 }, scale: 1 },
        mainIconTexture: { value: "tomato", position: { x: 0, y: -10 }, scale: 0.12 },
        additionalIconTexture: { value: "moneyIcon", position: { x: -10, y: 15 }, scale: 0.1 },
        text: { value: "10", position: { x: 10, y: 15 }, scale: 1 }
      }
    },
    {
      key: EButtonKey.GRAPE_BUTTON,
      config: {
        bgTexture: { value: "btn_square_bg", position: { x: 0, y: 0 }, scale: 1 },
        mainIconTexture: { value: "grape", position: { x: 0, y: -10 }, scale: 0.13 },
        additionalIconTexture: { value: "moneyIcon", position: { x: -10, y: 15 }, scale: 0.1 },
        text: { value: "10", position: { x: 10, y: 15 }, scale: 1 }
      }
    },
  ],
  [EButtonGroupKey.ANIMALS]: [
    {
      key: EButtonKey.CHICKEN_BUTTON,
      config: {
        bgTexture: { value: "btn_square_bg", position: { x: 0, y: 0 }, scale: 1 },
        mainIconTexture: { value: "chicken", position: { x: 0, y: -10 }, scale: 0.12 },
        additionalIconTexture: { value: "moneyIcon", position: { x: -10, y: 15 }, scale: 0.1 },
        text: { value: "10", position: { x: 10, y: 15 }, scale: 1 }
      }
    },
    {
      key: EButtonKey.SHEEP_BUTTON,
      config: {
        bgTexture: { value: "btn_square_bg", position: { x: 0, y: 0 }, scale: 1 },
        mainIconTexture: { value: "sheep", position: { x: 0, y: -10 }, scale: 0.13 },
        additionalIconTexture: { value: "moneyIcon", position: { x: -10, y: 15 }, scale: 0.1 },
        text: { value: "10", position: { x: 10, y: 15 }, scale: 1 },
        permanentDisable: true,
      }
    },
    {
      key: EButtonKey.COW_BUTTON,
      config: {
        bgTexture: { value: "btn_square_bg", position: { x: 0, y: 0 }, scale: 1 },
        mainIconTexture: { value: "cow", position: { x: 0, y: -10 }, scale: 0.12 },
        additionalIconTexture: { value: "moneyIcon", position: { x: -10, y: 15 }, scale: 0.1 },
        text: { value: "10", position: { x: 10, y: 15 }, scale: 1 },
        permanentDisable: true,
      }
    },
  ],
  [EButtonGroupKey.CONSTRUCTION]: [
    {
      key: EButtonKey.FENCE_BUTTON,
      config: {
        bgTexture: { value: "btn_square_bg", position: { x: 0, y: 0 }, scale: 1 },
        mainIconTexture: { value: "fence", position: { x: 0, y: -10 }, scale: 0.14 },
        additionalIconTexture: { value: "moneyIcon", position: { x: -13, y: 15 }, scale: 0.1 },
        text: { value: "100", position: { x: 10, y: 15 }, scale: 1 },
        permanentDisable: true,
      }
    },
    {
      key: EButtonKey.BARN_BUTTON,
      config: {
        bgTexture: { value: "btn_square_bg", position: { x: 0, y: 0 }, scale: 1 },
        mainIconTexture: { value: "barn", position: { x: 0, y: -10 }, scale: 0.14 },
        additionalIconTexture: { value: "moneyIcon", position: { x: -13, y: 15 }, scale: 0.1 },
        text: { value: "100", position: { x: 10, y: 15 }, scale: 1 },
        permanentDisable: true,
      }
    },
  ],
};

export const UNIT_TYPE_BY_BUTTON_KEY: Record<EButtonKey, UnitType | null> = {
  [EButtonKey.STRAWBERRY_BUTTON]: UnitType.STRAWBERRY,
  [EButtonKey.CORN_BUTTON]: UnitType.CORN,
  [EButtonKey.TOMATO_BUTTON]: UnitType.TOMATO,
  [EButtonKey.GRAPE_BUTTON]: UnitType.GRAPE,
  [EButtonKey.CHICKEN_BUTTON]: UnitType.CHICKEN,
  [EButtonKey.SHEEP_BUTTON]: UnitType.SHEEP,
  [EButtonKey.COW_BUTTON]: UnitType.COW,
  [EButtonKey.BARN_BUTTON]: UnitType.BARN,
  [EButtonKey.FENCE_BUTTON]: UnitType.FENCE,
  [EButtonKey.LINK_BUTTON]: null,
  [EButtonKey.START_BUTTON]: null,
  [EButtonKey.NEXT_DAY]: null,
  [EButtonKey.PLANTS_BUTTON]: null,
  [EButtonKey.ANIMALS_BUTTON]: null,
  [EButtonKey.CONSTRUCTION_BUTTON]: null, 
};
