import * as THREE from "three";
import { MODEL_LIST } from "../../data/loadData";
import { IUnit, UnitType } from "./unit/UnitTypes";
import UnitManager from "./unit/UnitManager";
import EventManager from "../../utils/EventManager";
import { GameEventType } from "../events/GameEvents";
import { GAME_OBJECTS_DATA } from "../data/gameData";
import Particles from "./vfx/particles";

export default class Environment extends THREE.Group {
  private places: Map<string, IUnit>;
  private glows: Map<string, THREE.Mesh>;
  private selectedItemType: UnitType | null;

  constructor() {
    super();

    this.places = new Map<string, IUnit>();
    this.glows = new Map<string, THREE.Mesh>();
    this.selectedItemType = null;
    this.init();
  }

  public getFreePlaces(): Array<IUnit> {
    return Array.from(this.places.values()).filter((place: IUnit) => !place.isPlaced) as Array<IUnit>;
  }

  public placeUnit(glow: THREE.Mesh): void {
    const unitManager = UnitManager.getInstance();
    const eventManager = EventManager.getInstance();
    const place = glow.parent as IUnit;

    if (place) {
      const position = place.position.clone();
      const rotation = place.rotation.clone();
      const unitGroup = unitManager.createUnitsGroup(this.selectedItemType!, position);
      unitGroup.rotation.copy(rotation);
      unitGroup.isPlaced = true;
      this.add(unitGroup);

      unitGroup.show();
      this.places.delete(place.unitId);
      this.places.set(unitGroup.unitId, unitGroup);

      unitManager.removeUnit(place.unitId);
      eventManager.emit(GameEventType.UNIT_PLACED, { unitGroup });
      this.clearGlow();
      this.selectedItemType = null;
    }
  }

  public removeUnit(unitId: string): void {
    const unitManager = UnitManager.getInstance();
    const eventManager = EventManager.getInstance();
    const unit = this.places.get(unitId);

    if (unit) {
      this.places.delete(unitId);
      this.emitDust(unit.position);
      unit.hide().then(() => {
        unitManager.removeUnit(unitId);
        eventManager.emit(GameEventType.UNIT_REMOVED, { unitId });
      });

      const place = unitManager.createUnit(UnitType.PLACEHOLDER, unit.position.clone());
      place.rotation.copy(unit.rotation);
      this.add(place);
      this.places.set(place.unitId, place);
    }
  }

  private init(): void {
    this.initFarm();
    this.initSpawnFrame();
    this.initGlow();
    this.listenSignals();
  }

  private initFarm(): void {
    const model = THREE.Cache.get(MODEL_LIST.farm);
    model.scene.position.set(0, -4.5, 0);
    this.add(model.scene);
  }

  private initSpawnFrame(): void {
    const { placeholder: spawnPlaces } = GAME_OBJECTS_DATA;
    for (let i = 0; i < spawnPlaces.length; i++) {
      const { position, rotation } = spawnPlaces[i];
      const { x: pX, y: pY, z: pZ } = position;
      const { x: rX, y: rY, z: rZ } = rotation;
      const vec3 = new THREE.Vector3(pX, pY, pZ);

      const unit = UnitManager.getInstance().createUnit(UnitType.PLACEHOLDER, vec3);
      unit.visible = true;
      unit.rotation.set(rX, rY, rZ);
      this.add(unit);
      this.places.set(unit.unitId, unit);
    }
  }

  private initGlow(): void {
    const texture = this.createGradientTexture();
    const hiddenMaterial = new THREE.MeshBasicMaterial({ visible: false });
    const material = new THREE.MeshBasicMaterial({
      color: 0xaaff00,
      transparent: true,
      depthWrite: false,
      alphaMap: texture,
      side: THREE.DoubleSide,
    });

    this.places.forEach((place: IUnit) => {
      const { x, z } = new THREE.Box3().setFromObject(place).getSize(new THREE.Vector3());
      const rotationY = place.rotation.y;
      const geometry = new THREE.BoxGeometry(x, 5, z);

      const glowMesh = new THREE.Mesh(geometry, [material, material, hiddenMaterial, hiddenMaterial, material, material]);
      glowMesh.rotation.y = rotationY;
      glowMesh.position.set(0, 0, 0);
      glowMesh.visible = false;
      place.add(glowMesh);
      this.glows.set(place.unitId, glowMesh);
    });
  }

  private listenSignals(): void {
    const eventManager = EventManager.getInstance();
    eventManager.on(GameEventType.ITEM_SELECTED, (data) => {
      const { itemType } = data;

      this.selectedItemType = itemType;

      if (itemType) {
        this.glowPlaces();
      } else {
        this.clearGlow();
      }
    });
  }

  private glowPlaces(): void {
    this.places.forEach((place: IUnit) => {
      if (place.isPlaced) return;
      const glowMesh = this.glows.get(place.unitId);
      if (glowMesh) {
        glowMesh.visible = true;
      }
    });
  }

  private clearGlow(): void {
    this.glows.forEach((glowMesh) => {
      glowMesh.visible = false;
    });
  }

  private createGradientTexture(): THREE.Texture {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 10;

    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private emitDust(position: THREE.Vector3): void {
    const particles = Particles.getInstance();
    particles.triggerDust(position);
  }
}
