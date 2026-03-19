import TaskProgressBar from "./components/TaskProgressBar";
import ResourceCounter from "./components/ResourceCounter";
import UiButtonsGroup from "./components/UiButtonsGroup";
import { EButtonGroupKey } from "./enums/enums";
import UiButtonsController from "./components/UiButtonsController";
import { BUTTONS_GROUP_CONFIG } from "./data/uiData";
import EventManager from "../../utils/EventManager";
import { GameEventType } from "../events/GameEvents";
import { ResourceUnitManager } from "./components/ResourceUnitManeger";
import { ResourceType } from "../enum/enums";
import ResourceManager from "./components/ResourceManager";
import ResourceUnit from "./components/ResourceUnit";
import NextDayButtonContainer from "./components/NextDayButtonComtainer";

const PADDING = 10;

export default class UI extends Phaser.GameObjects.Container {
  private resourceCounter: ResourceCounter;
  private nextDayButtonContainer: NextDayButtonContainer;
  private progressBar: TaskProgressBar;
  private itemTypeBtnGroup: UiButtonsGroup;
  private plantBtnGroup: UiButtonsGroup;
  private animalsBtnGroup: UiButtonsGroup;
  private constructionBtnGroup: UiButtonsGroup;
  private resourceUnitManager: ResourceUnitManager;
  private resourceUnitContainer: Phaser.GameObjects.Container;
  private resourceUnitsDisabled: boolean;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.resourceUnitsDisabled = false;
    this.setVisible(false);
    this.init();
  }

  public update(time: number, delta: number): void {
    this.resourceCounter.update(time, delta);
    this.progressBar.update(time, delta);
  }

  public resize(width: number, height: number): void {
    this.resourceCounter.resize(width, height);
    this.progressBar.resize(width, height);
    this.itemTypeBtnGroup.resize(width, height);
    this.plantBtnGroup.resize(width, height);
    this.animalsBtnGroup.resize(width, height);
    this.constructionBtnGroup.resize(width, height);
    this.resourceUnitManager.resize(width, height);
    this.nextDayButtonContainer.resize(width, height);

    this.updateResourceUnitContainerSize(width, height);
    this.updateResourceCounterPosition(width, height);
    this.updateNextDayButtonContainerPosition(width, height);
    this.updateProgressBarPosition(width, height);
    this.updateItemTypeBtnGroupPosition(width, height);
    this.updateItemsBtnGroupPosition(this.plantBtnGroup, width, height);
    this.updateItemsBtnGroupPosition(this.animalsBtnGroup, width, height);
    this.updateItemsBtnGroupPosition(this.constructionBtnGroup, width, height);
  }

  public show(): void {
    this.setVisible(true);
    this.itemTypeBtnGroup.show();
  }

  public hide(): void {
    this.itemTypeBtnGroup.hide();
    this.setVisible(false);
  }

  public enableInput(): void {
    this.nextDayButtonContainer.enableInput();
    this.itemTypeBtnGroup.enableInput();
  }

  public disableInput(): void {
    this.nextDayButtonContainer.disableInput();
    this.itemTypeBtnGroup.disableInput();
  }

  private updateResourceUnitContainerSize(width: number, height: number): void {
    const aspectRatio = width / height;
    const scale = Math.min(aspectRatio, 1);
    this.resourceUnitContainer.setScale(scale);
  }

  private updateResourceCounterPosition(width: number, height: number): void {
    const resourcesBounds = this.resourceCounter.getBounds();
    const resourceCounterX = -width / 2 + PADDING + resourcesBounds.width / 2;
    const resourceCounterY = -height / 2 + PADDING + resourcesBounds.height / 2;
    this.resourceCounter.setPosition(resourceCounterX, resourceCounterY);
  }

  private updateNextDayButtonContainerPosition(width: number, height: number): void {
    const buttonBounds = this.nextDayButtonContainer.getBounds();
    const nextDayButtonX = width / 2 - PADDING - buttonBounds.width / 2;
    const nextDayButtonY = -height / 2 + PADDING + buttonBounds.height / 2;
    this.nextDayButtonContainer.setPosition(nextDayButtonX, nextDayButtonY);
  }

  private updateProgressBarPosition(width: number, height: number): void {
    const progressBarBounds = this.progressBar.getBounds();
    const progressBarX = 0;
    const progressBarY = -height / 2 + PADDING + progressBarBounds.height / 2;
    this.progressBar.setPosition(progressBarX, progressBarY);
  }

  private updateItemTypeBtnGroupPosition(width: number, height: number): void {
    const itemTypeBtnGroupBounds = this.itemTypeBtnGroup.getBounds();

    const portraitX = 0;
    const landscapeX = -width / 2 + PADDING + itemTypeBtnGroupBounds.width / 2;

    const isLandscape = width > height;
    const itemTypeBtnGroupX = isLandscape ? landscapeX : portraitX;
    const itemTypeBtnGroupY = height / 2 - PADDING - itemTypeBtnGroupBounds.height / 2;

    this.itemTypeBtnGroup.setPosition(itemTypeBtnGroupX, itemTypeBtnGroupY);
  }

  private updateItemsBtnGroupPosition(btnGroup: UiButtonsGroup, width: number, height: number): void {
    const btnGroupBounds = btnGroup.getBounds();
    const portraitY = height * 0.5 - (PADDING + btnGroupBounds.height) * 1.5;
    const landscapeY = height * 0.5 - PADDING - btnGroupBounds.height * 0.5;
    const portraitX = 0;
    const landscapeX = (width - btnGroupBounds.width) * 0.5 - PADDING;

    const isLandscape = width > height;
    const btnGroupY = isLandscape ? landscapeY : portraitY;
    const btnGroupX = isLandscape ? landscapeX : portraitX;

    btnGroup.setPosition(btnGroupX, btnGroupY);
  }

  private init(): void {
    this.initCounter();
    this.intiNextDayButton();
    this.initTaskProgressBar();

    this.itemTypeBtnGroup = this.initButtonGroups(EButtonGroupKey.ITEM_TYPE);
    this.plantBtnGroup = this.initButtonGroups(EButtonGroupKey.PLANTS);
    this.animalsBtnGroup = this.initButtonGroups(EButtonGroupKey.ANIMALS);
    this.constructionBtnGroup = this.initButtonGroups(EButtonGroupKey.CONSTRUCTION);

    this.initButtonsController();
    this.initResourceUnitManager();
    this.initResourceUnitContainer();

    this.listenSignals();
  }

  private initCounter(): void {
    const resourceCounter = this.resourceCounter = new ResourceCounter(this.scene);
    this.add(resourceCounter);
  }

  private intiNextDayButton(): void {
    const button = this.nextDayButtonContainer = new NextDayButtonContainer(this.scene);
    this.add(button);
  }

  private initTaskProgressBar(): void {
    const progressBar = this.progressBar = new TaskProgressBar(this.scene);
    this.add(progressBar);
  }

  private initButtonGroups(groupKey: EButtonGroupKey): UiButtonsGroup {
    const groupConfig = BUTTONS_GROUP_CONFIG[groupKey];

    const group = new UiButtonsGroup(this.scene, groupConfig);
    this.add(group);

    return group;
  }

  private initButtonsController(): void {
    new UiButtonsController(
      this.itemTypeBtnGroup,
      this.plantBtnGroup,
      this.animalsBtnGroup,
      this.constructionBtnGroup
    );
  }

  private initResourceUnitManager(): void {
    this.resourceUnitManager = new ResourceUnitManager(this.scene);
  }

  private initResourceUnitContainer(): void {
    this.resourceUnitContainer = new Phaser.GameObjects.Container(this.scene);
    this.add(this.resourceUnitContainer);
  }

  private listenSignals(): void {
    const eventManager = EventManager.getInstance();
    eventManager.on(GameEventType.RESOURCE_PRODUCED, (data) => {
      this.onResourceProduced(data);
    });

    eventManager.on(GameEventType.ON_RESOURCE_UNIT_CLICKED, (data) => {
      if (this.resourceUnitsDisabled) return;
      const { type } = data;
      const resources = this.resourceUnitManager.getResourcesByType(type);
      const delay = 800 / resources.length;
      this.resourceUnitsDisabled = true;
      resources.forEach((resource: ResourceUnit, index: number) => {
        resource.collect(this.resourceCounter, index * delay)
          .then(() => {
            this.resourceUnitManager.removeResourceUnit(resource.unitId);
            ResourceManager.getInstance().addResource(type, 1);
            this.resourceUnitsDisabled = false;
          });
      });
    });
  }

  private async onResourceProduced(data: { type: ResourceType; position: { x: number; y: number } }): Promise<void> {
    const { type, position } = data;
    const scale = this.resourceUnitContainer.scale;
    position.x /= scale;
    position.y /= scale;

    const unit = this.resourceUnitManager.createResourceUnit(type, position);
    this.resourceUnitContainer.add(unit);
    await unit.show();
  }
}