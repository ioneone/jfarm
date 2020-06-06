import Phaser from 'phaser';

class UIScene extends Phaser.Scene
{
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
    this.add.rectangle(42, 8, 46, 8, 0x2ff7d6);

    const spText = this.add.text(78, 0, "SP", { fontSize: '12px' });
    spText.setStroke('#000000', 4);
    this.add.rectangle(120, 8, 50, 10, 0x000000);
    this.add.rectangle(120, 8, 46, 8, 0xf66f21);
  }

  public update()
  {

  }

}

export default UIScene;