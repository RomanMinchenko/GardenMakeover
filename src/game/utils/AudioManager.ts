import { SOUNDS_LIST } from "../data/loadData";

export default class AudioManager {
  private scene: Phaser.Scene;
  private sounds: any;

  private static exists: boolean;
  private static instance: AudioManager;

  constructor(scene: Phaser.Scene) {
    if (AudioManager.exists) {
      return AudioManager.instance;
    }

    AudioManager.instance = this;
    AudioManager.exists = true;

    this.scene = scene;

    this.init();
  }

  public static getInstance(): AudioManager {
    return this.instance;
  }

  public play(name: string, volume: number = 1, loop: boolean = false): void {
    const sound: any = this.sounds[name];
    if (sound.isPlaying) return;
    if (volume !== null) {
      sound.volume = volume;
    }
    sound.loop = loop;
    sound.play();
  }

  public stopAll(): void {
    Object.keys(SOUNDS_LIST).forEach((key: string) => {
      this.stop(key);
    });
  }

  public stop(name: string): void {
    this.sounds[name].stop();
  }

  private init(): void {
    this.sounds = {};

    Object.entries(SOUNDS_LIST).forEach(([key, value]) => {
      this.sounds[key] = this.scene.sound.add(key);
    });
  }
}