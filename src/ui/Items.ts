import Phaser from 'phaser';
import Item from './Item';

// 10 Item UIs packed into one
class Items extends Phaser.GameObjects.Container
{

  constructor(scene: Phaser.Scene, centerX: number, centerY: number)
  {
    // Item is 32 x 32
    // so the size of this component is 320 x 32
    super(scene, centerX - 160, centerY - 16);

    for (let i = 0; i < 10; i++)
    {
      new Item(scene, centerX - 160 + 16 + 32 * i, centerY, (i + 1).toString(), i < 7 ? i : undefined);
    }
    
  }



}

export default Items;