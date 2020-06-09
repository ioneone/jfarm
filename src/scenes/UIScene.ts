import Phaser from 'phaser';
import EventDispatcher from '../events/EventDispatcher';
import { Event, PlayerHpChangeEventData, DamageEventData } from '../events/Event';

// UIScene should always be active. Overlay UIScene on top of current scene.
class UIScene extends Phaser.Scene
{

  // A visual indicator of the player's hit points
  private hitPointsBar?: Phaser.GameObjects.Rectangle;

  // Digit representation of the player's hit points
  private hitPointsText?: Phaser.GameObjects.BitmapText;

  constructor()
  {
    super("UIScene");
  }

  public preload()
  {
    this.load.bitmapFont('PressStart2P', 'assets/font/font.png', 'assets/font/font.fnt');
  }

  public create()
  {
    const blackColor = 0x000000;
    const lightBlueColor = 0x2ff7d6;
    const orangeColor = 0xf66f21;

    const fontFamily = 'PressStart2P';
    const statusBarOffsetX = 8;
    const statusBarOffsetY = 8;
    const textFontSize = 16;
    const digitFontSize = 12;
    const spacing = 2;

    const barBackgroundWidth = 100;

    const hpText = this.add.bitmapText(statusBarOffsetX, statusBarOffsetY, fontFamily, "HP", textFontSize);
    
    const hitPointsBarBackground = this.add.rectangle(hpText.x + hpText.width + spacing, statusBarOffsetY, barBackgroundWidth, hpText.height, blackColor).setOrigin(0, 0);
    this.hitPointsBar = this.add.rectangle(hitPointsBarBackground.x + spacing, statusBarOffsetY + spacing, barBackgroundWidth - 2 * spacing, hpText.height - 2 * spacing, lightBlueColor).setOrigin(0, 0);
    this.hitPointsText = this.add.bitmapText(hitPointsBarBackground.x + hitPointsBarBackground.width, hitPointsBarBackground.y + hitPointsBarBackground.height + spacing, fontFamily, "100/100", digitFontSize).setOrigin(1, 0);

    const spText = this.add.bitmapText(hitPointsBarBackground.x + hitPointsBarBackground.width + spacing * 8, statusBarOffsetY, fontFamily, "SP", textFontSize);
    const spPointsBarBackground = this.add.rectangle(spText.x + spText.width + spacing, statusBarOffsetY, barBackgroundWidth, spText.height, blackColor).setOrigin(0, 0);
    this.add.rectangle(spPointsBarBackground.x + spacing, statusBarOffsetY + spacing, barBackgroundWidth - 2 * spacing, spText.height - 2 * spacing, orangeColor).setOrigin(0, 0);
    this.add.bitmapText(spPointsBarBackground.x + spPointsBarBackground.width, spPointsBarBackground.y + spPointsBarBackground.height + spacing, fontFamily, "100/100", digitFontSize).setOrigin(1, 0);

    // event handling
    EventDispatcher.getInstance().on(Event.PlayerHpChange, this.handlePlayerHpChangeEvent, this);

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      EventDispatcher.getInstance().off(Event.PlayerHpChange, this.handlePlayerHpChangeEvent, this);
    });
  }

  private handlePlayerHpChangeEvent(data: PlayerHpChangeEventData)
  {
    const hp = data.hitPoints;
    const maxHp = data.maxHitPoints;

    const spacing = 2;
    const barBackgroundWidth = 100;
    
    this.hitPointsBar?.setDisplaySize(Math.max(0, Math.floor((barBackgroundWidth - 2 * spacing) * hp / maxHp)), 
      this.hitPointsBar.height);
    this.hitPointsText?.setText(hp.toString() + '/' + maxHp.toString());
  }

  public update()
  {
  }

}

export default UIScene;