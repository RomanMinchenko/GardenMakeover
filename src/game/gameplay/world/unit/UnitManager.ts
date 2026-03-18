import * as THREE from "three";
import Unit from "./Unit";
import { IUnit, UNITS_GROUP_CONFIG, UnitType } from "./UnitTypes";
import UnitGroup from "./UnitGroup";

export default class UnitManager {
  public static exists: boolean;
  public static instance: UnitManager;

  private units: Record<UnitType, Array<IUnit>>;
  private unitGroups: Record<UnitType, Array<IUnit>>;
  private activeUnits: Record<string, IUnit>;
  private activeUnitGroups: Record<string, IUnit>;
  private mixer: THREE.AnimationMixer;
  private unitCounter: number = 0;
  private groupUnitCounter: number = 0;

  constructor() {
    if (UnitManager.exists) {
      return UnitManager.instance;
    }

    UnitManager.exists = true;
    UnitManager.instance = this;

    this.units = {} as Record<UnitType, Array<IUnit>>;
    this.unitGroups = {} as Record<UnitType, Array<IUnit>>;
    this.activeUnits = {} as Record<string, IUnit>;
    this.activeUnitGroups = {} as Record<string, IUnit>;
  }


  public static getInstance(): UnitManager {
    if (UnitManager.exists) {
      return UnitManager.instance;
    }

    return new UnitManager();
  }

  public update(time: number, delta: number): void {
    Object.values(this.activeUnits).forEach((unit) => {
      unit.update(time, delta);
    });

    Object.values(this.activeUnitGroups).forEach((group) => {
      group.update(time, delta);
    });
  }

  public applyAnimationMixer(mixer: THREE.AnimationMixer): void {
    this.mixer = mixer;
  }

  public playUnitAnimation(unitId: string): void {
    const unit = this.activeUnits[unitId];
    if (unit && this.mixer) {
      unit.playAnimation(this.mixer);
    }
  }

  public createUnitsGroup(unitType: UnitType, position: THREE.Vector3): IUnit {
    if (!this.unitGroups[unitType]) {
      this.unitGroups[unitType] = [];
    }

    let unitGroup = this.unitGroups[unitType]?.pop();
    let groupId = unitGroup?.unitId;

    if (!unitGroup) {
      groupId = `group_${this.groupUnitCounter++}`;
      const units = UNITS_GROUP_CONFIG[unitType];
      unitGroup = new UnitGroup(groupId, units, unitType);
    }

    unitGroup.setPosition(position);
    unitGroup.playAnimation(this.mixer!);
    this.activeUnitGroups[groupId!] = unitGroup;

    return unitGroup;
  }

  public createUnit(unitType: UnitType, position: THREE.Vector3): IUnit {
    if (!this.units[unitType]) {
      this.units[unitType] = [];
    }

    let unit = this.units[unitType]?.pop();
    let unitId = unit?.unitId;

    if (!unit) {
      unitId = `unit_${this.unitCounter++}`;
      unit = new Unit(unitId, unitType);
    }

    unit.setPosition(position);
    unit.playAnimation(this.mixer!);
    this.activeUnits[unitId!] = unit;

    return unit;
  }

  public removeUnit(unitId: string): boolean {
    const unit = this.activeUnits[unitId] || this.activeUnitGroups[unitId];
    if (unit) {
      if (unit.isUnitGroup) {
        return this.removeUnitGroup(unit);
      } else {
        return this.removeSingleUnit(unit);
      }
    }
    return false;
  }

  public getUnit(unitId: string): IUnit | undefined {
    return this.activeUnits[unitId] || this.activeUnitGroups[unitId];
  }

  public getAllUnits(): IUnit[] {
    return Object.values(this.activeUnits);
  }

  public getAllUnitGroups(): IUnit[] {
    return Object.values(this.activeUnitGroups);
  }

  private removeSingleUnit(unit: IUnit): boolean {
    delete this.activeUnits[unit.unitId];

    const unitType = unit.unitType;
    this.units[unitType].push(unit);

    unit.reset();
    return true;
  }

  private removeUnitGroup(unit: IUnit): boolean {
    delete this.activeUnitGroups[unit.unitId];

    const groupType = unit.unitType;
    this.unitGroups[groupType].push(unit);

    unit.reset();
    return true;
  }
}