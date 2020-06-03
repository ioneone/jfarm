import Phaser from 'phaser';

// UI is non-physics object
class Item extends Phaser.GameObjects.Sprite
{
  constructor(scene: Phaser.Scene, x: number, y: number, key: string)
  {
    super(scene, x, y, "assets/ui/item.png");
    this.scene.add.existing(this);
    this.scene.add.text(x - 16 + 4, y - 16 + 4, key).setFontSize(8);
  }
  
}

export default Item;