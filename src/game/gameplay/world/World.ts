import * as THREE from "three";
import DayNightCycle from "./DayNightCycle";
import Environment from "./Environment";
import WorldConfigurator from "./WorldConfigurator";
import UnitManager from "./unit/UnitManager";
import Raycaster from "../../utils/Raycaster";
import EventManager from "../../utils/EventManager";
import { GameEventType } from "../events/GameEvents";
import ResourceManager from "../ui/components/ResourceManager";
import { RESOURCE_CONFIG } from "../data/gameData";
import { ResourceType } from "../enum/enums";
import { worldToPhaserCoords } from "../../utils/Math";
import UnitGroup from "./unit/UnitGroup";
import { IUnit } from "./unit/UnitTypes";
import Particles from "./vfx/particles";

export default class World {
  private environment: Environment;
  private unitManager: UnitManager;
  private configurator: WorldConfigurator;
  private dayNightCycle: DayNightCycle;
  private mixer: THREE.AnimationMixer;
  private resourcesManager: ResourceManager;
  private particles: Particles;
  private gameWidth: number;
  private gameHeight: number;

  constructor() {
    this.init();
  }

  public update(time: number, delta: number): void {
    this.configurator.update(time, delta);
    this.dayNightCycle.update(time, delta);
    this.mixer?.update(delta);
    this.unitManager.update(time, delta);
    this.particles.draw();
    this.updateResources();
  }

  public resize(width: number, height: number): void {
    this.gameWidth = width;
    this.gameHeight = height;
    this.configurator.resize(width, height);
  }

  public getConfigurator(): WorldConfigurator {
    return this.configurator;
  }

  private init(): void {
    this.initWorldConfigurator();
    this.initDayNightCycle();
    this.initEnvironment();
    this.initRaycaster();
    this.initAnimationMixer();
    this.initUnitManager();
    this.initResourceManager();
    this.initParticles();
  }

  private initWorldConfigurator(): void {
    this.configurator = new WorldConfigurator();
  }

  private initDayNightCycle(): void {
    this.dayNightCycle = new DayNightCycle(
      this.configurator.dayLight,
      this.configurator.nightLight,
      this.configurator.scene.fog as THREE.Fog,
      this.configurator.hemisphereLight,
    );
  }

  private initEnvironment(): void {
    const environment = (this.environment = new Environment());
    this.configurator.scene.add(environment);
  }

  private initRaycaster(): void {
    const raycaster = new Raycaster(this.configurator.camera);

    EventManager.getInstance().on(GameEventType.INPUT_POINTER_DOWN, (data) => {
      const { pointer } = data;
      const event = pointer.event as PointerEvent;

      const freePlaces = this.environment.getFreePlaces();
      const intersects = raycaster.raycastToObjects(event, freePlaces);
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object as THREE.Mesh;
        if (intersectedObject) {
          this.environment.placeUnit(intersectedObject);
        }
      }
    });
  }

  private initAnimationMixer(): void {
    const object = THREE.Cache.get("objects2.glb");
    this.mixer = new THREE.AnimationMixer(object.scene);
    UnitManager.getInstance().applyAnimationMixer(this.mixer);
  }

  private initUnitManager(): void {
    this.unitManager = new UnitManager();
  }

  private initResourceManager(): void {
    this.resourcesManager = new ResourceManager();

    RESOURCE_CONFIG.forEach((resource) => {
      this.resourcesManager.setResource(resource.type, resource.startingAmount);
    });
  }

  private initParticles(): void {
    this.particles = new Particles(this.configurator.scene, this.configurator.camera);
  }

  private updateResources(): void {
    const eventManager = EventManager.getInstance();
    const unitManager = UnitManager.getInstance();
    const groups = unitManager.getAllUnitGroups();
    const units = unitManager.getAllUnits();
    const allActiveUnits = [...units, ...groups.flatMap(group => (group as UnitGroup).getUnits())];

    allActiveUnits.forEach(async (unit) => {
      if (unit.resourceUse) {
        for (const key in unit.resourceUse) {
          const { amount, delay, repeat } = unit.resourceUse[key];
          if (delay <= 0 && repeat !== 0) {
            const currentAmount = this.resourcesManager.getResource(key);
            if (currentAmount <= 0) {
              this.environment.removeUnit((unit.parent as IUnit).unitId);
            }

            this.resourcesManager.subtractResource(key as ResourceType, amount);
          }
        }
      }

      if (unit.resourceProduce) {
        for (const key in unit.resourceProduce) {
          const { amount, delay, repeat } = unit.resourceProduce[key];
          if (delay <= 0 && repeat !== 0) {
            for (let i = 0; i < amount; i++) {
              const phaserPosition = worldToPhaserCoords(
                unit.getWorldPosition(new THREE.Vector3()),
                this.configurator.camera,
                this.configurator.renderer,
                this.gameWidth,
                this.gameHeight
              );
              eventManager.emit(GameEventType.RESOURCE_PRODUCED, { type: key as ResourceType, position: phaserPosition });

              if (repeat === 1) {
                this.environment.removeUnit((unit.parent as IUnit).unitId);
              }
            }
          }
        }
      }
    });
  }
}