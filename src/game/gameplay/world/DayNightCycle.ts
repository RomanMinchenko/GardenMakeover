import * as THREE from "three";
import { WORLD_CONFIG } from "../../data/worldData";
import { GameEventType } from "../events/GameEvents";
import EventManager from "../../utils/EventManager";

export default class DayNightCycle {
  private dayLight: THREE.DirectionalLight;
  private nightLight: THREE.DirectionalLight;
  private fog: THREE.Fog;
  private hemisphereLight: THREE.HemisphereLight;
  private dayNightDuration: number;
  private fogColorsByDayPhase: THREE.Color[][];

  constructor(
    dayLight: THREE.DirectionalLight,
    nightLight: THREE.DirectionalLight,
    fog: THREE.Fog,
    hemisphereLight: THREE.HemisphereLight,
  ) {
    this.dayLight = dayLight;
    this.nightLight = nightLight;
    this.fog = fog;
    this.hemisphereLight = hemisphereLight;

    this.dayNightDuration = WORLD_CONFIG.cycleDuration;

    this.initFogColorsByDayPhase();
  }

  public update(time: number, delta: number): void {
    const deltaInMilliseconds = delta * 1000;
    this.decreaseDayNightDuration(deltaInMilliseconds);
    this.spinSunAndMood();
    this.updateLighting();
  }

  public nextDay(): void {
    this.dayNightDuration = WORLD_CONFIG.cycleDuration;
  }

  private decreaseDayNightDuration(delta: number): void {
    this.dayNightDuration -= delta;

    if (this.dayNightDuration <= 0) {
      this.dayNightDuration = WORLD_CONFIG.cycleDuration;
      EventManager.getInstance().emit(GameEventType.NEW_DAY_STARTED, {});
    }
  }

  private spinSunAndMood(): void {
    const rotationAngle = (1 - this.dayNightDuration / WORLD_CONFIG.cycleDuration) * Math.PI * 2;
    this.dayLight.position.set(Math.cos(rotationAngle) * 100, Math.sin(rotationAngle) * 100, 0);
    this.nightLight.position.set(Math.cos(rotationAngle + Math.PI) * 100, Math.sin(rotationAngle + Math.PI) * 100, 0);
  }

  private updateLighting(): void {
    const { cycleDuration, light } = WORLD_CONFIG;
    const { directional, hemisphere } = light;

    const dayFactor = 1 - this.dayNightDuration / cycleDuration;
    const dayPhase = Math.floor(dayFactor * 4) % 4;
    const partDayFactor = (dayFactor * 4) % 1;

    const sin = Math.sin(dayFactor * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5;

    this.dayLight.intensity = directional.day.intensity * sin;
    this.nightLight.intensity = directional.night.intensity * (1 - sin);
    this.hemisphereLight.intensity = hemisphere.dayIntensity * sin + hemisphere.nightIntensity * (1 - sin);

    const firstColor = this.fogColorsByDayPhase[dayPhase][0];
    const secondColor = this.fogColorsByDayPhase[dayPhase][1];
    const fogColor = new THREE.Color().lerpColors(firstColor, secondColor, partDayFactor);
    this.fog.color.setHex(fogColor.getHex());
  }

  private initFogColorsByDayPhase(): void {
    const { color } = WORLD_CONFIG.fog;
    const morningColor = new THREE.Color(color.morning);
    const dayColor = new THREE.Color(color.day);
    const eveningColor = new THREE.Color(color.evening);
    const nightColor = new THREE.Color(color.night);

    this.fogColorsByDayPhase = [
      [morningColor, dayColor],
      [dayColor, eveningColor],
      [eveningColor, nightColor],
      [nightColor, morningColor],
    ];
  }
}
