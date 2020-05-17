import Phaser from 'phaser';

class Crop extends Phaser.GameObjects.Sprite
{

  constructor(scene: Phaser.Scene, x: number, y: number, frameNumber: number)
  {
    super(scene, x, y, "assets/tileset/farming/plants.png", frameNumber);
    this.scene.add.existing(this);
    this.setOrigin(0.5, 0.9);
  }

}

export default Crop;