import * as THREE from "three";
import { Scene } from "phaser";
import { MODEL_LIST, SOUNDS_LIST, TEXTURES_LIST } from "../data/loadData";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Utils } from "../utils/Utils";

export class Preloader extends Scene {
  private modelLoader: GLTFLoader;
  private textureLoader: THREE.TextureLoader;

  constructor() {
    super("Preloader");

    this.modelLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
    THREE.Cache.enabled = true;
  }

  public async preload(): Promise<void> {
    await this.loadPhaserAssets();
    await this.loadThreeAssets();
    this.loadComplete();
  }

  private async loadPhaserAssets(): Promise<void> {
    this.loadAssets();
    this.loadSounds();
    this.loadFonts();

    return new Promise<void>((resolve) => {
      this.load.on("complete", () => {
        resolve();
      });
    });
  }

  private loadAssets(): void {
    this.load.setPath("atlas/");
    this.load.multiatlas("assets", "assets.json");
  }

  private loadSounds(): void {
    this.load.setPath("sounds/");
    Object.entries(SOUNDS_LIST).forEach(([key, value]) => {
      this.load.audio(key, `${value}.mp3`);
    });
  }

  private loadFonts(): void {
    this.load.setPath("fonts/");
    this.load.font("Ballo2", "Baloo2-Regular.ttf");
  }

  private async loadThreeAssets(): Promise<void> {
    const modelLoader = this.modelLoader;
    modelLoader.setPath("gltf/");

    const modelPromises = Object.values(MODEL_LIST).map((name) => {
      return new Promise<void>((resolve, reject) => {
        modelLoader.load(name,
          (gltf) => {
            THREE.Cache.add(name, gltf);
            Utils.updateModelsMaterials([name]);
            resolve();
          },
          undefined,
          (error) => {
            console.error(`Error loading model ${name}:`, error);
            reject(error);
          }
        );
      });
    });

    const texturePromises = Object.values(TEXTURES_LIST).map((name) => {
      return new Promise<void>((resolve, reject) => {
        this.textureLoader.load(`textures/${name}`,
          (texture) => {
            THREE.Cache.add(name, texture);
            resolve();
          },
          undefined,
          (error) => {
            console.error(`Error loading texture ${name}:`, error);
            reject(error);
          }
        );
      });
    });

    await Promise.all([...modelPromises, ...texturePromises]);
  }

  private loadComplete(): void {
    this.scene.start("Game");
  }
}
