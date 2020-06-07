import Phaser from 'phaser';
import EventDispatcher from '../events/EventDispatcher';
import { Event, PlayerHpChangeEventData, DamageEventData } from '../events/Event';

class UIScene extends Phaser.Scene
{

  // A visual indicator of the player's hit points
  private hitPointsBar?: Phaser.GameObjects.Rectangle;

  // Digit representation of the player's hit points
  private hitPointsText?: Phaser.GameObjects.BitmapText;

  constructor()
  {
    // UIScene should always be active. Overlay UIScene on top of current scene.
    super({ key: "UIScene", active: true });
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
    const statusBarOffsetX = 4;
    const statusBarOffsetY = 4;
    const fontSize = 8;
    const spacing = 1;

    const barBackgroundWidth = 50;

    const hpText = this.add.bitmapText(statusBarOffsetX, statusBarOffsetY, fontFamily, "HP", fontSize);
    
    const hitPointsBarBackground = this.add.rectangle(hpText.x + hpText.width + spacing, statusBarOffsetY, barBackgroundWidth, hpText.height, blackColor).setOrigin(0, 0);
    this.hitPointsBar = this.add.rectangle(hitPointsBarBackground.x + spacing, statusBarOffsetY + spacing, barBackgroundWidth - 2 * spacing, hpText.height - 2 * spacing, lightBlueColor).setOrigin(0, 0);
    this.hitPointsText = this.add.bitmapText(hitPointsBarBackground.x + hitPointsBarBackground.width, hitPointsBarBackground.y + hitPointsBarBackground.height + spacing, fontFamily, "100/100", fontSize).setOrigin(1, 0);

    const spText = this.add.bitmapText(hitPointsBarBackground.x + hitPointsBarBackground.width + spacing * 8, statusBarOffsetY, fontFamily, "SP", fontSize);
    const spPointsBarBackground = this.add.rectangle(spText.x + spText.width + spacing, statusBarOffsetY, barBackgroundWidth, spText.height, blackColor).setOrigin(0, 0);
    this.add.rectangle(spPointsBarBackground.x + spacing, statusBarOffsetY + spacing, barBackgroundWidth - 2 * spacing, spText.height - 2 * spacing, orangeColor).setOrigin(0, 0);
    this.add.bitmapText(spPointsBarBackground.x + spPointsBarBackground.width, spPointsBarBackground.y + spPointsBarBackground.height + spacing, fontFamily, "100/100", fontSize).setOrigin(1, 0);

    // event handling
    EventDispatcher.getInstance().on(Event.PlayerHpChange, this.handlePlayerHpChangeEvent, this);
    EventDispatcher.getInstance().on(Event.Damage, this.handleDamageEvent, this);
  }

  private handlePlayerHpChangeEvent(data: PlayerHpChangeEventData)
  {
    const hp = data.hitPoints;
    const maxHp = data.maxHitPoints;

    const spacing = 1;
    const barBackgroundWidth = 50;
    
    this.hitPointsBar?.setDisplaySize(Math.max(0, Math.floor((barBackgroundWidth - 2 * spacing) * hp / maxHp)), 
      this.hitPointsBar.height);
    this.hitPointsText?.setText(hp.toString() + '/' + maxHp.toString());
  }

  private handleDamageEvent(data: DamageEventData)
  {
    const damageText = this.add.bitmapText(data.x, data.y, 'PressStart2P', data.damage.toString(), 8);
    if (data.color)
    {
      damageText.setTint(data.color);
    }
    
    this.tweens.add({
      targets: damageText,
      ease: 'Linear',
      x: (Math.random() - 1 > 0 ? '+=' : '-=' ) + (7 * Math.random() + 1).toString(),
      y: '-=' + (7 * Math.random() + 1).toString(),
      alpha: 0,
      duration: 500,
      onComplete: () => {
        damageText.destroy();
      }
    });
  }

  public update()
  {
  }

}

export default UIScene;