import * as THREE from "three";
import { ResourceType } from "../../enum/enums";

export enum UnitType {
  STRAWBERRY = "strawberry",
  CORN = "corn",
  TOMATO = "tomato",
  GRAPE = "grape",
  CHICKEN = "chicken",
  COW = "cow",
  SHEEP = "sheep",
  BARN = "barn",
  FENCE = "fence",
  GROUND = "ground",
  PLACEHOLDER = "placeholder",
};

export interface IUnit extends THREE.Group {
  unitId: string;
  unitType: UnitType;
  isPlaced: boolean;
  isUnitGroup: boolean;
  resourceUse?: Record<string, IResourceUse> | null;
  resourceProduce?: Record<string, IResourceUse> | null;
  update(time: number, delta: number): void;
  playAnimation(mixer: THREE.AnimationMixer): void;
  setPosition(position: THREE.Vector3): void;
  show(): Promise<void>;
  hide(): Promise<void>;
  reset(): void;
};

export interface IUnitGroupConfig {
  type: UnitType;
  position: THREE.Vector3;
};

export const UNITS_GROUP_CONFIG: Record<UnitType, Array<IUnitGroupConfig>> = {
  [UnitType.STRAWBERRY]: [
    { type: UnitType.STRAWBERRY, position: new THREE.Vector3(-1.5, 0, 3.5) },
    { type: UnitType.STRAWBERRY, position: new THREE.Vector3(-1.5, 0, 0) },
    { type: UnitType.STRAWBERRY, position: new THREE.Vector3(-1.5, 0, -3.5) },
    { type: UnitType.STRAWBERRY, position: new THREE.Vector3(1.5, 0, 3.5) },
    { type: UnitType.STRAWBERRY, position: new THREE.Vector3(1.5, 0, 0) },
    { type: UnitType.STRAWBERRY, position: new THREE.Vector3(1.5, 0, -3.5) },
    { type: UnitType.GROUND, position: new THREE.Vector3(0, 0, 0) },
  ],
  [UnitType.CORN]: [
    { type: UnitType.CORN, position: new THREE.Vector3(-1.5, 0, 3.5) },
    { type: UnitType.CORN, position: new THREE.Vector3(-1.5, 0, 0) },
    { type: UnitType.CORN, position: new THREE.Vector3(-1.5, 0, -3.5) },
    { type: UnitType.CORN, position: new THREE.Vector3(1.5, 0, 3.5) },
    { type: UnitType.CORN, position: new THREE.Vector3(1.5, 0, 0) },
    { type: UnitType.CORN, position: new THREE.Vector3(1.5, 0, -3.5) },
    { type: UnitType.GROUND, position: new THREE.Vector3(0, 0, 0) },
  ],
  [UnitType.TOMATO]: [
    { type: UnitType.TOMATO, position: new THREE.Vector3(-1.5, 0, 3.5) },
    { type: UnitType.TOMATO, position: new THREE.Vector3(-1.5, 0, 0) },
    { type: UnitType.TOMATO, position: new THREE.Vector3(-1.5, 0, -3.5) },
    { type: UnitType.TOMATO, position: new THREE.Vector3(1.5, 0, 3.5) },
    { type: UnitType.TOMATO, position: new THREE.Vector3(1.5, 0, 0) },
    { type: UnitType.TOMATO, position: new THREE.Vector3(1.5, 0, -3.5) },
    { type: UnitType.GROUND, position: new THREE.Vector3(0, 0, 0) },
  ],
  [UnitType.GRAPE]: [
    { type: UnitType.GRAPE, position: new THREE.Vector3(-1.5, 0, 3.5) },
    { type: UnitType.GRAPE, position: new THREE.Vector3(-1.5, 0, 0) },
    { type: UnitType.GRAPE, position: new THREE.Vector3(-1.5, 0, -3.5) },
    { type: UnitType.GRAPE, position: new THREE.Vector3(1.5, 0, 3.5) },
    { type: UnitType.GRAPE, position: new THREE.Vector3(1.5, 0, 0) },
    { type: UnitType.GRAPE, position: new THREE.Vector3(1.5, 0, -3.5) },
    { type: UnitType.GROUND, position: new THREE.Vector3(0, 0, 0) },
  ],
  [UnitType.CHICKEN]: [
    { type: UnitType.CHICKEN, position: new THREE.Vector3(-1.9, 0, 3.2) },
    { type: UnitType.CHICKEN, position: new THREE.Vector3(-0.7, 0, 1.4) },
    { type: UnitType.CHICKEN, position: new THREE.Vector3(-1.7, 0, 0) },
    { type: UnitType.CHICKEN, position: new THREE.Vector3(-1, 0, -1.2) },
    { type: UnitType.CHICKEN, position: new THREE.Vector3(-1.35, 0, -4.2) },
    { type: UnitType.CHICKEN, position: new THREE.Vector3(1.1, 0, 2.8) },
    { type: UnitType.CHICKEN, position: new THREE.Vector3(1.4, 0, 1.8) },
    { type: UnitType.CHICKEN, position: new THREE.Vector3(1, 0, 0.5) },
    { type: UnitType.CHICKEN, position: new THREE.Vector3(2, 0, -1.5) },
    { type: UnitType.CHICKEN, position: new THREE.Vector3(1.2, 0, -4.2) },
    { type: UnitType.FENCE, position: new THREE.Vector3(0, 0, 0) },
  ],
  [UnitType.COW]: [
    { type: UnitType.COW, position: new THREE.Vector3(0, 0, 0) },
    { type: UnitType.COW, position: new THREE.Vector3(0, 0, 0) },
    { type: UnitType.COW, position: new THREE.Vector3(0, 0, 0) },
    { type: UnitType.FENCE, position: new THREE.Vector3(0, 0, 0) },
  ],
  [UnitType.SHEEP]: [
    { type: UnitType.SHEEP, position: new THREE.Vector3(0, 0, 0) },
    { type: UnitType.SHEEP, position: new THREE.Vector3(0, 0, 0) },
    { type: UnitType.SHEEP, position: new THREE.Vector3(0, 0, 0) },
    { type: UnitType.FENCE, position: new THREE.Vector3(0, 0, 0) },
  ],
  [UnitType.BARN]: [
    { type: UnitType.BARN, position: new THREE.Vector3(0, 0, 0) },
  ],
  [UnitType.FENCE]: [
    { type: UnitType.FENCE, position: new THREE.Vector3(0, 0, 0) },
  ],
  [UnitType.PLACEHOLDER]: [
    { type: UnitType.PLACEHOLDER, position: new THREE.Vector3(0, 0, 0) },
  ],
  [UnitType.GROUND]: [
    { type: UnitType.GROUND, position: new THREE.Vector3(0, 0, 0) },
  ],
};

export enum EGrowthStage {
  SMALL = "small",
  MEDIUM = "Medium",
  MATURE = "Mature",
};

export interface IResourceUse {
  amount: number;
  delay: number;
  repeat: number;
  delayRange?: { min: number; max: number };
};

export interface IUnitConfig {
  type: UnitType;
  modelName: {
    [key: string]: string;
  };
  soundName: string;
  growthStage: EGrowthStage;
  growthTime: number;
  animation?: string;
  resourceUse?: Record<string, IResourceUse> | null;
  resourceProduce?: Record<string, IResourceUse> | null;
};

export const UNIT_CONFIGS: Record<UnitType, IUnitConfig> = {
  [UnitType.STRAWBERRY]: {
    type: UnitType.STRAWBERRY,
    modelName: {
      [EGrowthStage.SMALL]: "strawberry_1",
      [EGrowthStage.MEDIUM]: "strawberry_2",
      [EGrowthStage.MATURE]: "strawberry_3",
    },
    soundName: "strawberry",
    growthStage: EGrowthStage.SMALL,
    growthTime: 10,
    resourceUse: {
      [ResourceType.MONEY]: {
        amount: 0.5,
        delay: 0,
        repeat: 1
      },
    },
    resourceProduce: {
      [ResourceType.MONEY]: {
        amount: 2,
        delay: 1,
        repeat: 1
      },
    }
  },
  [UnitType.CORN]: {
    type: UnitType.CORN,
    modelName: {
      [EGrowthStage.SMALL]: "corn_1",
      [EGrowthStage.MEDIUM]: "corn_2",
      [EGrowthStage.MATURE]: "corn_3",
    },
    soundName: "corn",
    growthStage: EGrowthStage.SMALL,
    growthTime: 15,
    resourceUse: {
      [ResourceType.MONEY]: {
        amount: 1,
        delay: 0,
        repeat: 1
      },
    },
    resourceProduce: {
      [ResourceType.CORN]: {
        amount: 3,
        delay: 5,
        repeat: 1
      },
    }
  },
  [UnitType.TOMATO]: {
    type: UnitType.TOMATO,
    modelName: {
      [EGrowthStage.SMALL]: "tomato_1",
      [EGrowthStage.MEDIUM]: "tomato_2",
      [EGrowthStage.MATURE]: "tomato_3",
    },
    soundName: "tomato",
    growthStage: EGrowthStage.SMALL,
    growthTime: 20,
    resourceUse: {
      [ResourceType.MONEY]: {
        amount: 2,
        delay: 0,
        repeat: 1
      },
    },
    resourceProduce: {
      [ResourceType.MONEY]: {
        amount: 4,
        delay: 5,
        repeat: 1
      },
    }
  },
  [UnitType.GRAPE]: {
    type: UnitType.GRAPE,
    modelName: {
      [EGrowthStage.SMALL]: "grape_1",
      [EGrowthStage.MEDIUM]: "grape_2",
      [EGrowthStage.MATURE]: "grape_3",
    },
    soundName: "grape",
    growthStage: EGrowthStage.SMALL,
    growthTime: 25,
    resourceUse: {
      [ResourceType.MONEY]: {
        amount: 3,
        delay: 0,
        repeat: 1
      },
    },
    resourceProduce: {
      [ResourceType.MONEY]: {
        amount: 6,
        delay: 5,
        repeat: 1
      },
    }
  },
  [UnitType.CHICKEN]: {
    type: UnitType.CHICKEN,
    modelName: {
      [EGrowthStage.MATURE]: "chicken_1",
    },
    soundName: "chicken",
    animation: "action_chicken",
    growthStage: EGrowthStage.MATURE,
    growthTime: 0,
    resourceUse: {
      [ResourceType.CORN]: {
        amount: 1,
        delay: 5,
        delayRange: { min: 2, max: 15 },
        repeat: -1
      },
      [ResourceType.MONEY]: {
        amount: 4,
        delay: 0,
        repeat: 1
      },
    },
    resourceProduce: {
      [ResourceType.EGGS]: {
        amount: 1,
        delay: 0,
        delayRange: { min: 5, max: 30 },
        repeat: -1
      },
    }
  },
  [UnitType.COW]: {
    type: UnitType.COW,
    modelName: {
      [EGrowthStage.MATURE]: "cow_1",
    },
    soundName: "cow",
    animation: "action_cow",
    growthTime: 0,
    growthStage: EGrowthStage.MATURE,
    resourceUse: {
      [ResourceType.MONEY]: {
        amount: 30,
        delay: 0,
        repeat: 1
      },
    },
  },
  [UnitType.SHEEP]: {
    type: UnitType.SHEEP,
    modelName: {
      [EGrowthStage.MATURE]: "sheep_1",
    },
    soundName: "sheep",
    animation: "action_sheep",
    growthTime: 0,
    growthStage: EGrowthStage.MATURE,
    resourceUse: {
      [ResourceType.MONEY]: {
        amount: 20,
        delay: 0,
        repeat: 1
      },
    },
  },
  [UnitType.BARN]: {
    type: UnitType.BARN,
    modelName: {
      [EGrowthStage.MATURE]: "barn",
    },
    soundName: "barn",
    growthTime: 0,
    growthStage: EGrowthStage.MATURE,
    resourceUse: {
      [ResourceType.MONEY]: {
        amount: 250,
        delay: 0,
        repeat: 1
      },
    },
  },
  [UnitType.FENCE]: {
    type: UnitType.FENCE,
    modelName: {
      [EGrowthStage.MATURE]: "fence",
    },
    soundName: "fence",
    growthTime: 0,
    growthStage: EGrowthStage.MATURE,
  },
  [UnitType.PLACEHOLDER]: {
    type: UnitType.PLACEHOLDER,
    modelName: {
      [EGrowthStage.MATURE]: "placeholder",
    },
    soundName: "placeholder",
    growthTime: 0,
    growthStage: EGrowthStage.MATURE,
  },
  [UnitType.GROUND]: {
    type: UnitType.GROUND,
    modelName: {
      [EGrowthStage.MATURE]: "ground",
    },
    soundName: "ground",
    growthTime: 0,
    growthStage: EGrowthStage.MATURE,
  },
};
