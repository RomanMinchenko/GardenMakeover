import * as THREE from "three";
import gsap from "gsap";
import Unit from "./Unit";
import { IUnit, IUnitGroupConfig, UnitType } from "./UnitTypes";

export default class UnitGroup extends THREE.Group implements IUnit {
  public isPlaced: boolean = false;
  public unitId: string;
  public unitType: UnitType;
  public isUnitGroup: boolean = true;

  private units: Unit[];
  private unitsConfig: Array<IUnitGroupConfig>;
  private unitCounter: number = 0;

  constructor(unitId: string, unitsConfig: Array<IUnitGroupConfig>, unitType: UnitType) {
    super();
    this.unitId = unitId;
    this.unitsConfig = unitsConfig;
    this.unitType = unitType;
    this.units = [];
    this.visible = false;
    this.createUnits();
  }

  public update(time: number, delta: number): void {
    this.units.forEach((unit) => {
      unit.update(time, delta);
    });
  }

  public playAnimation(mixer: THREE.AnimationMixer): void {
    this.units.forEach((unit: IUnit) => {
      unit.playAnimation(mixer);
    });
  }

  public setPosition(position: THREE.Vector3): void {
    this.position.copy(position);
  }

  public async show(): Promise<void> {
    return new Promise((resolve) => {
      gsap.fromTo(this.scale,
        { x: 0, y: 0, z: 0 },
        {
          x: 1, y: 1, z: 1,
          duration: 0.25,
          ease: "Back.easeOut",
          onStart: () => {
            this.units.forEach((unit) => unit.visible = true);
            this.visible = true;
          },
          onComplete: resolve,
        },
      );
    });
  }

  public async hide(): Promise<void> {
    return new Promise((resolve) => {
      gsap.fromTo(this.scale,
        { x: 1, y: 1, z: 1 },
        {
          x: 0, y: 0, z: 0,
          duration: 0.25,
          ease: "Back.easeIn",
          onComplete: () => {
            this.units.forEach((unit) => unit.visible = false);
            this.visible = false;
            resolve();
          },
        },
      );
    });
  }

  public reset(): void {
    this.isPlaced = false;
    this.units.forEach((unit) => unit.reset(false));
    this.removeFromParent();
  }

  public getUnits(): IUnit[] {
    return this.units;
  }

  private createUnits(): void {
    this.unitsConfig.map((config: IUnitGroupConfig) => {
      const unitId = `${this.unitId}_unit_${this.unitCounter++}`;

      const unit = new Unit(unitId, config.type);
      unit.setPosition(config.position);
      this.add(unit);
      this.units.push(unit);
      return unit;
    });
  }
}
