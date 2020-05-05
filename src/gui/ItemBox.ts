import Phaser from 'phaser';

class ItemBox
{

  private box_: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, y: number, key: string)
  {
    this.box_ = scene.add.image(x, y, 'box');
    scene.add.image(x, y, 'axe').setScale(1.5);
    scene.add.text(this.box_.getBounds().x + 2, this.box_.getBounds().y + 2, key, { fontSize: 12, color: '#000000' });
  }

  get box()
  {
    return this.box_;
  }

}

export default ItemBox;