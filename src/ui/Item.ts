import Phaser from 'phaser';

// UI is non-physics object
class Item extends Phaser.GameObjects.Sprite
{
  constructor(scene: Phaser.Scene, x: number, y: number, key: string)
  {
    super(scene, x, y, "assets/ui/item.png");
    this.scene.add.existing(this);
    this.scene.add.text(x - 16 + 4, y - 16 + 4, key).setFontSize(8);
    const content = this.scene.add.sprite(x, y, "assets/tileset/farming/plants.png", 5);
    content.setOrigin(0.5, 0.75);
  }
  
}

export default Item;