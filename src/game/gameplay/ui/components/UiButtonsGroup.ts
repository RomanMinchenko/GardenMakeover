import { ResourceType } from "../../enum/enums";
import { UNIT_CONFIGS, UNITS_GROUP_CONFIG, UnitType } from "../../world/unit/UnitTypes";
import { UNIT_TYPE_BY_BUTTON_KEY } from "../data/uiData";
import { EButtonKey } from "../enums/enums";
import { IButtonConfig, IButtonsGroupConfig } from "../interface/interfaces";
import Button from "./Button";
import ResourceManager from "./ResourceManager";

const GAP = 20;

export default class UiButtonsGroup extends Phaser.GameObjects.Container {
  public buttons: Map<EButtonKey, Button> = new Map();

  constructor(scene: Phaser.Scene, groupConfig: IButtonsGroupConfig[]) {
    super(scene);
    this.init(groupConfig);
    this.setVisible(false);
  }

  public update(time: number, delta: number): void {
    // Update buttons here
  }

  public resize(width: number, height: number): void {
    const buttonsArray = Array.from(this.buttons.values());
    const startX = -((buttonsArray.length - 1) * (buttonsArray[0].getBounds().width + GAP)) / 2;

    buttonsArray.forEach((button, index) => {
      const buttonX = startX + index * (button.getBounds().width + GAP);
      button.setPosition(buttonX, 0);
    });
  }

  public async show(): Promise<void> {
    if (this.visible === true) return Promise.resolve();
    const buttonsArray = Array.from(this.buttons.values());
    this.setVisible(true);
    const promises = buttonsArray.map((button, index) => {
      button.setVisible(false);
      return new Promise<void>((resolve) => {
        this.scene.tweens.add({
          targets: button,
          y: "-=200",
          duration: 250,
          ease: "Power2",
          delay: index * 50,
          onStart: () => {
            button.y += 200;
            button.setVisible(true);
          },
          onComplete: () => resolve(),
        });
      });
    });
    await Promise.all(promises);
  }

  public async hide(): Promise<void> {
    if (this.visible === false) return Promise.resolve();
    const buttonsArray = Array.from(this.buttons.values());
    const promises = buttonsArray.map((button, index) => {
      return new Promise<void>((resolve) => {
        this.scene.tweens.add({
          targets: button,
          y: "+=200",
          duration: 250,
          ease: "Power2",
          delay: index * 50,
          onComplete: () => {
            button.setVisible(false);
            button.y -= 200;
            resolve();
          },
        });
      });
    });
    await Promise.all(promises);
    this.setVisible(false);
  }

  public enableInput(): this {
    this.buttons.forEach(button => {
      const buttonKey = button.buttonKey;
      const buttonTextValue = button.getTextValue() || "0";
      const money = ResourceManager.getInstance().getResource(ResourceType.MONEY);

      if (!UNIT_TYPE_BY_BUTTON_KEY[buttonKey] || Number(buttonTextValue) <= money) {
        button.enableInput();
      }
    });

    return this;
  }

  public disableInput(): this {
    this.buttons.forEach(button => button.disableInput());
    return this;
  }

  public getButtons(): Map<EButtonKey, Button> {
    return this.buttons;
  }

  private init(groupConfig: IButtonsGroupConfig[]): void {
    groupConfig.forEach(({ key, config }) => {
      const priceText = config.text ? this.getUnitPriceByButtonKey(key) : undefined;
      if (priceText && config.text) {
        config.text.value = priceText.toString();
      }

      const button = this.initButton(key, config);
      this.buttons.set(key, button);
    });
  }

  private initButton(buttonName: EButtonKey, config: IButtonConfig): Button {
    const button = new Button(this.scene, buttonName, config);
    button.permanentDisable = config.permanentDisable ?? false;
    button.alpha = 0.5;
    this.add(button);
    
    return button;
  }

  private getUnitPriceByButtonKey(key: EButtonKey): number {
    const unitType = UNIT_TYPE_BY_BUTTON_KEY[key] as UnitType;
    const unitNumber = UNITS_GROUP_CONFIG[unitType]?.filter(config => config.type === unitType).length ?? 0;
    const unitCost = UNIT_CONFIGS[unitType]?.resourceUse?.[ResourceType.MONEY]?.amount ?? 0;
    const totalCost = unitCost * unitNumber;

    return totalCost;
  }
}