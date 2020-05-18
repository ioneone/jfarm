import Phaser from 'phaser';
import Crop, { CropId } from '~/objects/Crop';

// UI is non-physics object
class Item extends Phaser.GameObjects.Sprite
{
  constructor(scene: Phaser.Scene, x: number, y: number, key: string, cropId?: CropId)
  {
    super(scene, x, y, "assets/ui/item.png");
    this.scene.add.existing(this);
    

    if (cropId != null)
    {
      const crop = new Crop(this.scene, x, y, cropId);
      crop.setGrowthStage(6);
      crop.setOrigin(0.5, 0.8);
    }

    this.scene.add.text(x - 16 + 4, y - 16 + 4, key).setFontSize(8);
    
  }
  
}

export default Item;