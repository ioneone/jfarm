import Phaser from 'phaser';
import EventDispatcher from '../events/EventDispatcher';
import { Event, PlayerHpChangeEventData, DamageEventData } from '../events/Event';

class UIScene extends Phaser.Scene
{

  // A visual indicator of the player's hit points
  private hitPointsBar?: Phaser.GameObjects.Rectangle;

  // A visual indicator of the player's magic points
  private magicPointsBar?: Phaser.GameObjects.Rectangle;

  constructor()
  {
    // UIScene should always be active. Overlay UIScene on top of current scene.
    super({ key: "UIScene", active: true });
  }

  public preload()
  {
  }

  public create()
  {

    const hpText = this.add.text(0, 0, "HP", { fontSize: '12px' });
    hpText.setStroke('#000000', 4);

    this.add.rectangle(42, 8, 50, 10, 0x000000);
    this.hitPointsBar = this.add.rectangle(19, 8, 46, 8, 0x2ff7d6);
    this.hitPointsBar.setOrigin(0, 0.5);

    const spText = this.add.text(78, 0, "SP", { fontSize: '12px' });
    spText.setStroke('#000000', 4);
    this.add.rectangle(120, 8, 50, 10, 0x000000);
    this.magicPointsBar = this.add.rectangle(120, 8, 46, 8, 0xf66f21);

    // event handling
    EventDispatcher.getInstance().on(Event.PlayerHpChange, this.handlePlayerHpChangeEvent, this);
    EventDispatcher.getInstance().on(Event.Damage, this.handleDamageEvent, this);
  }

  private handlePlayerHpChangeEvent(data: PlayerHpChangeEventData)
  {
    const hp = data.hitPoints;
    const maxHp = data.maxHitPoints;
    this.hitPointsBar?.setDisplaySize(Math.max(0, Math.floor(46 * hp / maxHp)), 8);
  }

  private handleDamageEvent(data: DamageEventData)
  {
    const damageText = this.add.text(data.x, data.y, data.damage.toString(), { fontSize: '8px' });
    damageText.setStroke('#000000', 2);
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