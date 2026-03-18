import * as THREE from "three";
import gsap from "gsap";
import { EGrowthStage, IResourceUse, IUnit, UNIT_CONFIGS, UnitType } from "./UnitTypes";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

export default class Unit extends THREE.Group implements IUnit {
  public unitId: string;
  public unitType: UnitType;
  public isPlaced: boolean;
  public isUnitGroup: boolean = false;
  public resourceUse: Record<string, IResourceUse> | null;
  public resourceProduce: Record<string, IResourceUse> | null;

  private glft: THREE.Group;
  private clip: THREE.AnimationClip | null;
  private mesh: THREE.Object3D;
  private meshByStage: Record<EGrowthStage, THREE.Object3D>;
  private config: typeof UNIT_CONFIGS[UnitType];

  constructor(unitId: string, unitType: UnitType) {
    super();

    this.unitId = unitId;
    this.unitType = unitType;
    this.isPlaced = false;
    this.visible = false;
    this.clip = null;
    this.glft = THREE.Cache.get("objects2.glb");

    this.config = JSON.parse(JSON.stringify(UNIT_CONFIGS[unitType]));
    this.resourceUse = this.config.resourceUse || null;
    this.resourceProduce = this.config.resourceProduce || null;
    this.meshByStage = {} as Record<EGrowthStage, THREE.Object3D>;

    this.updateResourcesDelay(this.resourceUse, this.config.resourceUse!);
    this.updateResourcesDelay(this.resourceProduce, this.config.resourceProduce!);

    this.init();
  }

  public update(time: number, delta: number): void {
    this.manageResources(delta, "resourceUse");
    if (this.config.growthStage === EGrowthStage.MATURE) {
      this.manageResources(delta, "resourceProduce");
    };
    this.manageGrowth(delta);
  }

  public playAnimation(mixer: THREE.AnimationMixer): void {
    if (this.clip) {
      const action = mixer.clipAction(this.clip, this.mesh);
      action.time = Math.random() * this.clip.duration;
      action.play();
    }
  }

  public setPosition(position: THREE.Vector3): void {
    this.position.copy(position);
  }

  public show(): Promise<void> {
    return new Promise((resolve) => {
      gsap.fromTo(this.scale,
        { x: 0, y: 0, z: 0 },
        {
          x: 1, y: 1, z: 1,
          duration: 0.5,
          ease: "Back.easeOut",
          onStart: () => {
            this.visible = true;
          },
          onComplete: resolve,
        });
    });
  }

  public hide(): Promise<void> {
    return new Promise((resolve) => {
      gsap.to(this.scale, {
        x: 0, y: 0, z: 0,
        duration: 0.5,
        ease: "Back.easeIn",
        onComplete: () => {
          this.visible = false;
          resolve();
        }
      });
    });
  }

  public reset(removeFromParent: boolean = true): void {
    this.isPlaced = false;
    this.config = JSON.parse(JSON.stringify(UNIT_CONFIGS[this.unitType]));
    this.resourceUse = this.config.resourceUse || null;
    this.resourceProduce = this.config.resourceProduce || null;
    this.updateResourcesDelay(this.resourceUse, this.config.resourceUse!);
    this.updateResourcesDelay(this.resourceProduce, this.config.resourceProduce!);
    this.updateMesh();
    if (removeFromParent) {
      this.removeFromParent();
    }
  }

  private manageResources(delta: number, resourceKey: string): void {
    if ((this as any)[resourceKey]) {
      for (const key in (this as any)[resourceKey]) {
        const resource = (this as any)[resourceKey][key];
        if (resource.delay < 0 && resource.repeat !== 0) {
          this.updateResourcesDelay((this as any)[resourceKey], JSON.parse(JSON.stringify(UNIT_CONFIGS[this.unitType]))[resourceKey]!);
          resource.repeat -= 1;
        }

        resource.delay -= delta;
      }
    }
  }

  private updateResourcesDelay(resources: Record<string, IResourceUse> | null, source: Record<string, IResourceUse>): void {
    if (!resources) return;

    for (const key in resources) {
      const resource = resources[key];
      if (resource.delayRange) {
        const { min, max } = resource.delayRange;
        resource.delay = Phaser.Math.Between(min, max);
      } else {
        resource.delay = source[key].delay;
      }
    }
  }

  private manageGrowth(delta: number): void {
    const growthTime = UNIT_CONFIGS[this.unitType].growthTime;
    if (this.config.growthStage !== EGrowthStage.MATURE) {
      this.config.growthTime -= delta;
      if (this.config.growthTime <= 0) {
        this.config.growthStage = EGrowthStage.MATURE;
        this.updateMesh();
        this.show();
      } else if (this.config.growthTime <= growthTime / 2 && this.config.growthStage !== EGrowthStage.MEDIUM) {
        this.config.growthStage = EGrowthStage.MEDIUM;
        this.updateMesh();
        this.show();
      }
    }
  }

  private init(): void {
    const { modelName, growthStage } = this.config;

    Object.entries(modelName).forEach(([stage, name]) => {
      const mesh = this.createMesh(name);
      this.add(mesh);

      this.meshByStage[stage as EGrowthStage] = mesh;
    });

    this.mesh = this.meshByStage[growthStage];
    this.mesh.visible = true;
    this.config.animation && this.createAnimation();
  }

  private createMesh(modelName: string): THREE.Object3D {
    const cachedModel = (this.glft as any).scene.children.find(
      (child: THREE.Object3D) => child.name === modelName
    );

    const mesh = clone(cachedModel);
    const originalPosition = cachedModel.position.clone();
    mesh.visible = false;
    mesh.position.sub(originalPosition);
    this.meshSetRotation(mesh);
    this.add(mesh);

    return mesh;
  }

  private updateMesh(): void {
    const { config, meshByStage } = this;
    const { growthStage } = config;

    for (const stage in meshByStage) {
      meshByStage[stage as EGrowthStage].visible = stage === growthStage;
    }

    this.mesh = meshByStage[growthStage];
  }

  private meshSetRotation(mesh: THREE.Object3D): void {
    if ([UnitType.CHICKEN].includes(this.unitType)) {
      mesh.rotation.y = Math.random() * Math.PI * 2;
    }
  }

  private createAnimation(): void {
    this.clip = THREE.AnimationClip.findByName(this.glft.animations, this.config.animation!);
  }
}