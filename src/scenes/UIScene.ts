import Phaser from 'phaser';
import EventDispatcher from '~/dispatchers/EventDispatcher';
import Player from '~/objects/Player';

class UIScene extends Phaser.Scene
{

  private lifeRectangle?: Phaser.GameObjects.Rectangle;

  constructor()
  {
    // overlay UIScene on top of current scene
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
    this.lifeRectangle = this.add.rectangle(19, 8, 46, 8, 0x2ff7d6);
    this.lifeRectangle.setOrigin(0, 0.5);

    const spText = this.add.text(78, 0, "SP", { fontSize: '12px' });
    spText.setStroke('#000000', 4);
    this.add.rectangle(120, 8, 50, 10, 0x000000);
    this.add.rectangle(120, 8, 46, 8, 0xf66f21);

    EventDispatcher.getInstance().on("PlayerHpChange", (data) => {
      const hp = data.hp;
      const maxHp = data.maxHp;
      this.lifeRectangle?.setDisplaySize(Math.max(0, Math.floor(46 * hp / maxHp)), 8);
    })
  }

  public update()
  {

  }

}

export default UIScene;