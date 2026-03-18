export const WORLD_CONFIG = {
  debugger: false,
  cycleDuration: 20000,
  renderer: {
    antialias: true,
    alpha: true,
  },
  camera: {
    position: { x: 19, y: 38, z: 28 },
    lookAt: { x: 3, y: 5, z: 6 },
    fov: 42,
    near: 0.1,
    far: 500,
  },
  light: {
    ambient: {
      color: "#7474fa",
      intensity: 2,
    },
    hemisphere: {
      skyColor: "#5d5dcc",
      groundColor: "#0a6d1a",
      dayIntensity: 4,
      nightIntensity: 5,
    },
    directional: {
      day: {
        color: "#f0e68b",
        intensity: 6,
        pos: { x: 23.5, y: 30.2, z: 7.8 },
        target: { x: 0, y: 0, z: 0 },
      },
      night: {
        color: "#5e61dd",
        intensity: 3,
        pos: { x: 0, y: 0, z: 0 },
        target: { x: 0, y: 0, z: 0 },
      },
    },
  },
  fog: {
    color: {
      morning: "#538cb3",
      day: "#feffab",
      evening: "#ddb957",
      night: "#00397a",
    },
    near: 43,
    far: 85,
  },
};
