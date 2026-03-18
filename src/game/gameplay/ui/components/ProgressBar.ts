export default class TaskProgressBar extends Phaser.GameObjects.Container {
  private fillBar: Phaser.GameObjects.TileSprite;
  private maskShape: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.init();
    this.setProgress(0);
  }

  public update(time: number, delta: number): void {
    this.fillBar.tilePositionX -= delta * 50;
  }

  public resize(width: number, height: number): void {
    const { tx, ty } = this.getWorldTransformMatrix();
    this.maskShape.setPosition(tx, ty);
  }

  public setProgress(progress: number): void {
    const clampedProgress = Phaser.Math.Clamp(progress, 0, 1);
    this.fillBar.setCrop(0, 0, this.fillBar.width * clampedProgress, this.fillBar.height);
  }

  private init(): void {
    this.initBarBg();
    this.initFillBar();
    this.initMask();
  }

  private initBarBg(): void {
    const barBg = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 140, 14, 0x000000, 0.5);
    barBg.setRounded(7.5);
    barBg.setStrokeStyle(2, 0xffffff, 0.5);
    this.add(barBg);
  }

  private initFillBar(): void {
    const fillBar = this.fillBar = new Phaser.GameObjects.TileSprite(this.scene, 0, 0, 140, 14, "assets", "progress");
    this.add(fillBar);
  }

  private initMask(): void {
    const maskShape = this.maskShape = new Phaser.GameObjects.Graphics(this.scene);
    maskShape.fillStyle(0xffffff);
    maskShape.fillRoundedRect(-69, -6, 138, 12, 6);

    const mask = new Phaser.Display.Masks.GeometryMask(this.scene, maskShape);
    this.fillBar.setMask(mask);
  }
}