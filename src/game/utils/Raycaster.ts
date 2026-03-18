import * as THREE from "three";

export default class Raycaster {
  private raycaster: THREE.Raycaster;
  private camera: THREE.PerspectiveCamera;
  private mouse: THREE.Vector2;
  private groundPlane: THREE.Plane;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  }

  public raycastToGround(pointer: Phaser.Input.Pointer): THREE.Vector3 | null {
    const event = pointer.event as MouseEvent;
    const rect = (event.target as HTMLElement).getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const target = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.groundPlane, target);

    return target;
  }

  public raycastToObjects(
    event: MouseEvent | TouchEvent,
    objects: THREE.Object3D[]
  ): THREE.Intersection[] {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const clientX = (event as MouseEvent).clientX || (event as TouchEvent).touches[0].clientX;
    const clientY = (event as MouseEvent).clientY || (event as TouchEvent).touches[0].clientY;

    this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    return this.raycaster.intersectObjects(objects);
  }
}