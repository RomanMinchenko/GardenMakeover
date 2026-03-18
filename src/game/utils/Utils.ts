import * as THREE from "three";

const defaultStyle: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: "Ballo2",
  fontSize: "16px",
  color: "#ffffff",
};

export class Utils {
  public static spriteMake(
    scene: Phaser.Scene,
    x: number,
    y: number,
    atlas: string,
    frame?: string
  ): Phaser.GameObjects.Sprite {
    const sprite: Phaser.GameObjects.Sprite = new Phaser.GameObjects.Sprite(
      scene,
      x,
      y,
      (frame && atlas) || this.getAtlasName(scene, atlas) || atlas,
      frame || atlas
    );

    return sprite;
  }

  public static textMake(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    style?: Phaser.Types.GameObjects.Text.TextStyle
  ): Phaser.GameObjects.Text {
    const textObject: Phaser.GameObjects.Text = new Phaser.GameObjects.Text(
      scene,
      x,
      y,
      text,
      { ...defaultStyle, ...style }
    );

    return textObject;
  }

  public static updateModelsMaterials(modelNames: string[]): void {
    const materials = new Map<number, THREE.MeshStandardMaterial>();
    modelNames.forEach((name: string) => {
      const model = THREE.Cache.get(name);
      model.scene.traverse((child: any) => {
        if (child.isMesh === true) {
          const materialColor = child.material.color.getHex();
          let newMaterial = materials.get(materialColor);

          if (!newMaterial) {
            newMaterial = this.createMaterial(materialColor);
            materials.set(materialColor, newMaterial);
          }

          child.material = newMaterial;
        }
      });
    });
  }

  private static getAtlasName(scene: Phaser.Scene, frameName: string): string | undefined {
    const data: any = (<any>scene.textures).list;

    for (const key in data) {
      for (const keyFrame in data[key].frames) {
        if (data[key].frames.hasOwnProperty(keyFrame) && (keyFrame === frameName || key === frameName)) {
          return data[key].key;
        }
      }
    }

    console.warn(`FrameName "${frameName}" wasn"t found in any of the atlases!`);
  }

  private static createMaterial(color: number): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: color,
      side: THREE.DoubleSide,
      roughness: 0.7,
      metalness: 0.5,
    });
  }
}