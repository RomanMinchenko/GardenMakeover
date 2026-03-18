import EventManager from "../../../utils/EventManager";
import { ResourceType } from "../../enum/enums";
import { GameEventType } from "../../events/GameEvents";

export default class ResourceManager {
  public static exists: boolean;
  public static instance: ResourceManager;

  private resources: Record<string, number>;

  constructor() {
    if (ResourceManager.exists) {
      return ResourceManager.instance;
    }

    ResourceManager.exists = true;
    ResourceManager.instance = this;

    this.resources = {};
  }

  public static getInstance(): ResourceManager {
    if (ResourceManager.exists) {
      return ResourceManager.instance;
    }

    return new ResourceManager();
  }

  public getResource(resourceName: string): number {
    return this.resources[resourceName] || 0;
  }

  public setResource(resourceName: string, amount: number): void {
    this.resources[resourceName] = amount;
  }

  public addResource(resourceName: ResourceType, amount: number): void {
    const currentAmount = this.getResource(resourceName);
    this.resources[resourceName] = currentAmount + amount;

    EventManager.getInstance().emit(
      GameEventType.RESOURCE_COLLECTED,
      {
        resourceType: resourceName,
        amount: this.resources[resourceName]
      }
    );
  }

  public subtractResource(resourceName: ResourceType, amount: number): void {
    const currentAmount = this.getResource(resourceName);
    this.resources[resourceName] = Math.max(currentAmount - amount, 0);

    EventManager.getInstance().emit(
      GameEventType.RESOURCE_USED,
      {
        resourceType: resourceName,
        amount: this.resources[resourceName]
      }
    );
  }
}
