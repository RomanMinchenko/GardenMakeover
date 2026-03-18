import EventManager from "../../../utils/EventManager";
import { Utils } from "../../../utils/Utils";
import { GameEventType } from "../../events/GameEvents";
import Button from "../components/Button";
import { EButtonKey } from "../enums/enums";

export default class EndScreen extends Phaser.GameObjects.Container {
  private overlay: Phaser.GameObjects.Rectangle;
  private linkButton: Button;
  private logo: Phaser.GameObjects.Sprite;
  private buttonHover: boolean = false;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.setVisible(false);
    this.init();
  }

  public update(time: number, delta: number): void {
    this.animateButtonPulses(time, delta);
  }

  public resize(width: number, height: number): void {
    this.overlay.setSize(width, height);
    this.linkButton.setPosition(0, 80);
    this.logo.setPosition(0, -120);
  }

  public show(): void {
    this.setVisible(true);
    this.enableInput();
  }

  public hide(): void {
    this.setVisible(false);
    this.disableInput();
  }

  public enableInput(): void {
    this.linkButton.enableInput();
  }

  public disableInput(): void {
    this.linkButton.disableInput();
  }

  private init(): void {
    this.initOverlay();
    this.initLinkButton();
    this.initText();
    this.initLogo();

    this.listenSignals();
  }

  private initOverlay(): void {
    const overlay = this.overlay = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 100, 100, 0x000000, 0.7);
    this.add(overlay);

    overlay.setInteractive();
  }

  private initLinkButton(): void {
    const buttonConfig = {
      bgTexture: {
        value: "link_btn_bg",
        position: { x: 0, y: 0 },
        scale: 1
      },
      text: {
        value: "DOWNLOAD",
        position: { x: 30, y: 0 },
        scale: 1
      },
      mainIconTexture: {
        value: "icon",
        position: { x: -60, y: 0 },
        scale: 0.6
      }
    };

    const linkButton = this.linkButton = new Button(this.scene, EButtonKey.LINK_BUTTON, buttonConfig);
    linkButton.setPosition(0, 80);
    this.add(linkButton);
  }

  private initText(): void {
    const titleText = Utils.textMake(this.scene, 0, 0, "Download now and build your dream farm!", {
      fontSize: "24px",
      align: "center",
      color: "#feae0d"
    });
    titleText.setOrigin(0.5);
    titleText.setWordWrapWidth(300);
    titleText.setStroke("#ae2f01", 2);
    this.add(titleText);
  }

  private initLogo(): void {
    const logo = this.logo = Utils.spriteMake(this.scene, 0, -120, "logo");
    logo.setScale(0.5);
    logo.setOrigin(0.5);
    this.add(logo);
  }

  private animateButtonPulses(time: number, delta: number): void {
    if (this.buttonHover) {
      this.linkButton.setScale(1.1);
      return;
    }

    const pulse = 0.05 * Math.sin(time / 200) + 1;
    this.linkButton.setScale(pulse);
  }

  private listenSignals(): void {
    const eventManager = EventManager.getInstance();
    eventManager.on(GameEventType.BUTTON_CLICK, (data) => {
      if (data.buttonKey !== EButtonKey.LINK_BUTTON) return;
    });

    this.linkButton.on("pointerover", () => {
      this.buttonHover = true;
    });

    this.linkButton.on("pointerout", () => {
      this.buttonHover = false;
    });
  }
}
