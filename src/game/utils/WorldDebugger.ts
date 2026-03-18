import * as THREE from "three";
import { GUI } from "dat.gui"
import { WORLD_CONFIG } from "../data/worldData";

export default class WorldDebugger {
  private dat: GUI;

  constructor() {
    this.dat = new GUI();
    if (!WORLD_CONFIG.debugger) {
      this.dat.hide();
    }
  }

  public initCameraDebug(camera: THREE.PerspectiveCamera): void {
    const folder = this.dat.addFolder("Camera")
    const cameraLookAt = new THREE.Vector3(
      WORLD_CONFIG.camera.lookAt.x,
      WORLD_CONFIG.camera.lookAt.y,
      WORLD_CONFIG.camera.lookAt.z
    );

    this.initObjectDebugPosition(camera.position, folder, "position");
    this.initObjectDebugPosition(cameraLookAt, folder, "lookAt", () => {
      camera.lookAt(cameraLookAt);
    });

    folder
      .add(camera, "fov")
      .name("Camera fov")
      .min(.01)
      .max(200)
      .step(.01)
      .onChange(() => {
        camera.updateProjectionMatrix()
      })
  }

  public initLightDebug(
    light: THREE.Light,
    folderName: string,
    colors: Record<string, number> = {}
  ): void {
    const folder = this.dat.addFolder(folderName);

    folder
      .add(light, "visible")
      .name("Visible")
      .onChange((visible) => {
        light.visible = visible;
      });

    folder
      .add(light, "intensity")
      .name("Light intensity")
      .min(0)
      .max(10)
      .step(0.1);

    Object.entries(colors).forEach(([key, value]) => {
      folder
        .addColor({ [key]: value }, key)
        .name(`${key} color`)
        .onChange((color) => {
          (light as any)[key].set(color);
        });
    });

    if (light instanceof THREE.DirectionalLight) {
      this.initObjectDebugPosition(light.position, folder, "position");
    }
  }

  public initFogDebug(fog: THREE.Fog): void {
    const folder = this.dat.addFolder("Fog");

    folder
      .add(fog, "near")
      .name("Fog near")
      .min(0)
      .max(100)
      .step(0.1);

    folder
      .add(fog, "far")
      .name("Fog far")
      .min(0)
      .max(100)
      .step(0.1);

    const fogColor = new THREE.Color(fog.color.r, fog.color.g, fog.color.b);
    folder
      .addColor({ color: fogColor.getHex() }, "color")
      .name("Fog color")
      .onChange((color) => {
        fog.color.set(color);
      });
  }

  private initObjectDebugPosition(
    vec: THREE.Vector3,
    folder: GUI,
    label: string,
    onChange = () => { }
  ): void {
    const vecFolder = folder.addFolder(label);
    const vec3Key = ["x", "y", "z"] as const;

    for (const axis of vec3Key) {
      vecFolder
        .add(vec, axis)
        .name(`pos ${axis}`)
        .min(-100)
        .max(100)
        .step(0.1)
        .onChange(onChange);
    }
  }
}
