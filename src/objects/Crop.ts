import Phaser from 'phaser';

enum CropId {
  Tomato = 0,
  Potato = 1,
  Carrot = 2,
  Artichoke = 3,
  Chilli = 4,
  Gourd = 5,
  Corn = 6
};

class Crop extends Phaser.GameObjects.Sprite
{

  private cropId: number;

  constructor(scene: Phaser.Scene, x: number, y: number, cropId: number)
  {
    super(scene, x, y, "assets/plant/plants.png", cropId * 7);
    this.cropId = cropId;
    this.scene.add.existing(this);
    this.setOrigin(0.5, 0.85);
  }

  public setGrowthStage(stage: number)
  {
    this.setFrame(this.cropId * 7 + stage);
    return this;
  }

}

export default Crop;
export { CropId };