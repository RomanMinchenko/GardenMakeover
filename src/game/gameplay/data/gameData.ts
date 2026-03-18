import { ResourceType, TaskType } from "../enum/enums";

export const RESOURCE_CONFIG = [
  { type: ResourceType.MONEY, startingAmount: 55 },
  { type: ResourceType.CORN, startingAmount: 40 },
  { type: ResourceType.EGGS, startingAmount: 0 },
];

export const GAME_OBJECTS_DATA = {
  placeholder: [
    {
      position: { x: -10, y: 0, z: -8 },
      rotation: { x: 0, y: Math.PI * 0.5, z: 0 },
    },
    {
      position: { x: -10, y: 0, z: 0 },
      rotation: { x: 0, y: Math.PI * 0.5, z: 0 },
    },
    {
      position: { x: -10, y: 0, z: 8 },
      rotation: { x: 0, y: Math.PI * 0.5, z: 0 },
    },
    {
      position: { x: 8, y: 0, z: -8 },
      rotation: { x: 0, y: Math.PI * 0.5, z: 0 },
    },
    {
      position: { x: 8, y: 0, z: 0 },
      rotation: { x: 0, y: Math.PI * 0.5, z: 0 },
    },
    {
      position: { x: 8, y: 0, z: 8 },
      rotation: { x: 0, y: Math.PI * 0.5, z: 0 },
    },
  ]
};

export const GAME_TASKS: Record<TaskType, { [key in ResourceType]?: number }> = {
  [TaskType.COLLECT]: { [ResourceType.EGGS]: 50 },
};
