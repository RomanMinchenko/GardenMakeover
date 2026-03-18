import * as THREE from "three";

export function worldToPhaserCoords(
  worldPos: THREE.Vector3,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  gameWidth: number,
  gameHeight: number
) {
  const normalizeCoords = worldPos.clone().project(camera);

  const screenX = (normalizeCoords.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
  const screenY = (-normalizeCoords.y * 0.5 + 0.5) * renderer.domElement.clientHeight;

  const phaserX = screenX - gameWidth / 2;
  const phaserY = screenY - gameHeight / 2;

  return { x: phaserX, y: phaserY };
}