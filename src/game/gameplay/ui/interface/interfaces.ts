import { EButtonKey } from "../enums/enums";

export interface IButtonContentConfig {
  value: string;
  position: { x: number; y: number };
  scale: number;
}

export interface IButtonConfig {
  bgTexture?: IButtonContentConfig;
  mainIconTexture?: IButtonContentConfig;
  additionalIconTexture?: IButtonContentConfig;
  text?: IButtonContentConfig;
  permanentDisable?: boolean;
}

export interface IButtonsGroupConfig {
  key: EButtonKey,
  config: IButtonConfig,
}
