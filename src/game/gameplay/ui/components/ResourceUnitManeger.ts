import { ResourceType } from "../../enum/enums";
import ResourceUnit from "./ResourceUnit";

export class ResourceUnitManager {
  private scene: Phaser.Scene;
  private resourceUnits: Record<string, ResourceUnit[]>;
  private activeResourceUnits: Record<string, ResourceUnit>;
  private unitCounter: number = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.resourceUnits = {} as Record<string, ResourceUnit[]>;
    this.activeResourceUnits = {} as Record<string, ResourceUnit>;
  }

  public update(time: number, delta: number): void {
    Object.values(this.resourceUnits).forEach((units) => units.forEach((unit) => unit.update(time, delta)));
  }

  public resize(width: number, height: number): void {
    Object.values(this.resourceUnits).forEach((units) => units.forEach((unit) => unit.resize(width, height)));
  }

  public getResourcesByType(type: ResourceType): ResourceUnit[] {
    return Object.values(this.activeResourceUnits).filter((unit) => unit.unitType === type);
  }

  public createResourceUnit(resourceType: ResourceType, position: { x: number; y: number }): ResourceUnit {
    if (!this.resourceUnits[resourceType]) {
      this.resourceUnits[resourceType] = [];
    }

    let unit = this.resourceUnits[resourceType]?.pop();
    let unitId = unit?.unitId;

    
    if (!unit) {
      unitId = `unit_${this.unitCounter++}`;
      unit = new ResourceUnit(this.scene, unitId, resourceType);
    }

    unit.setPosition(position.x, position.y);
    this.activeResourceUnits[unitId!] = unit;
    return unit;
  }

  public removeResourceUnit(unitId: string): void {
    const unit = this.activeResourceUnits[unitId];
    if (unit) {
      delete this.activeResourceUnits[unitId];

      const resourceType = unit.unitType;
      this.resourceUnits[resourceType].push(unit);
      unit.reset();
    }
  }
}
