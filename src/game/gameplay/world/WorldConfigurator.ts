import * as THREE from "three";
import { WORLD_CONFIG } from "../../data/worldData";
import WorldDebugger from "../../utils/WorldDebugger";

export default class WorldConfigurator {
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;
  public dayLight: THREE.DirectionalLight;
  public nightLight: THREE.DirectionalLight;
  public ambientLight: THREE.AmbientLight;
  public hemisphereLight: THREE.HemisphereLight;

  constructor() {
    this.init();
  }

  public update(time: number, delta: number): void {
    this.renderer.render(this.scene, this.camera);
    const color = this?.scene?.fog?.color ?? null;
    if (color) {
      this.scene.background = color;
    }
  }

  public resize(width: number, height: number): void {
    const aspect = width / height;

    const baseFOV = WORLD_CONFIG.camera.fov;
    const baseAspect = 1;

    if (aspect < baseAspect) {
      const cameraHeight = Math.tan(THREE.MathUtils.degToRad(baseFOV / 2));
      const cameraWidth = cameraHeight * baseAspect;
      const newCameraHeight = cameraWidth / aspect;
      this.camera.fov = THREE.MathUtils.radToDeg(Math.atan(newCameraHeight) * 2);
    } else {
      this.camera.fov = baseFOV;
    }

    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private init(): void {
    this.initScene();
    this.initRenderer();
    this.insertRendererIntoDOM();
    this.initCamera();
    this.initLights();
    this.initFog();
    this.initDebugger();
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(WORLD_CONFIG.fog.color.day);
  }

  private initRenderer(): void {
    const { antialias, alpha } = WORLD_CONFIG.renderer;
    const renderer = (this.renderer = new THREE.WebGLRenderer({ antialias, alpha }));

    const container = document.getElementById("game-container");
    const width = container?.clientWidth ?? window.innerWidth;
    const height = container?.clientHeight ?? window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1.0;

    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.userSelect = "none";
    renderer.domElement.style.overflow = "hidden";
    renderer.domElement.style.zIndex = "-1";

    this.renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  private insertRendererIntoDOM(): void {
    const container = document.getElementById("game-container");

    if (container) {
      container.insertBefore(this.renderer.domElement, container.firstChild);
    }
  }

  private initCamera(): void {
    const {
      fov, near, far,
      position, lookAt
    } = WORLD_CONFIG.camera;

    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = (this.camera = new THREE.PerspectiveCamera(
      fov, aspectRatio,
      near, far
    ));

    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
  }

  private initLights(): void {
    this.initAmbientLight();
    this.initHemisphereLight();
    this.dayLight = this.createDirectionalLight("day");
    this.nightLight = this.createDirectionalLight("night");
  }

  private initAmbientLight(): void {
    const { color, intensity } = WORLD_CONFIG.light.ambient;

    const ambientLight = (
      this.ambientLight = new THREE.AmbientLight(
        color,
        intensity
      )
    );
    this.scene.add(ambientLight);
  }

  private initHemisphereLight(): void {
    const {
      skyColor, groundColor, dayIntensity
    } = WORLD_CONFIG.light.hemisphere;

    const hemisphereLight = (
      this.hemisphereLight = new THREE.HemisphereLight(
        skyColor,
        groundColor,
        dayIntensity
      )
    );
    this.scene.add(hemisphereLight);
  }

  private createDirectionalLight(lightType: "day" | "night"): THREE.DirectionalLight {
    const {
      color, intensity, pos, target
    } = WORLD_CONFIG.light.directional[lightType];

    const directionalLight = new THREE.DirectionalLight(
      color,
      intensity
    );
    directionalLight.position.set(pos.x, pos.y, pos.z);
    directionalLight.target.position.set(target.x, target.y, target.z);

    this.scene.add(directionalLight);
    this.scene.add(directionalLight.target);

    return directionalLight;
  }

  private initFog(): void {
    const { color, near, far } = WORLD_CONFIG.fog;
    this.scene.fog = new THREE.Fog(
      new THREE.Color(color.day),
      near,
      far
    );
  }

  private initDebugger(): void {
    const { camera, dayLight, nightLight, ambientLight, hemisphereLight } = this;

    const worldDebugger = new WorldDebugger();
    worldDebugger.initCameraDebug(camera);

    const dayDirectionalLightColors = {
      color: dayLight.color.getHex(),
    };
    const nightDirectionalLightColors = {
      color: nightLight.color.getHex(),
    };
    const ambientLightColors = {
      color: ambientLight.color.getHex(),
    };
    const hemisphereLightColors = {
      color: hemisphereLight.color.getHex(),
      groundColor: hemisphereLight.groundColor.getHex(),
    };

    worldDebugger.initLightDebug(dayLight, "Day Light", dayDirectionalLightColors);
    worldDebugger.initLightDebug(nightLight, "Night Light", nightDirectionalLightColors);
    worldDebugger.initLightDebug(ambientLight, "Ambient Light", ambientLightColors);
    worldDebugger.initLightDebug(hemisphereLight, "Hemisphere Light", hemisphereLightColors);

    worldDebugger.initFogDebug(this.scene.fog as THREE.Fog);
  }
}