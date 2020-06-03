import Phaser from 'phaser';

// UI is non-physics object
class Inventory extends Phaser.GameObjects.Sprite
{
  constructor(scene: Phaser.Scene, x: number, y: number)
  {
    super(scene, x, y, "assets/ui/inventory.png");
    this.scene.add.existing(this);    
  }
  
}

export default Inventory;