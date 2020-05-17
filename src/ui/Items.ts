import Phaser from 'phaser';
import Item from './Item';

// 10 Item UIs packed into one
class Items extends Phaser.GameObjects.Container
{

  constructor(scene: Phaser.Scene, centerX: number, centerY: number)
  {
    // Item is 64 x 64
    // so the size of this component is 640 x 64
    super(scene, centerX - 320, centerY - 32);

    for (let i = 0; i < 10; i++)
    {
      new Item(scene, centerX - 320 + 32 + 64 * i, centerY, (i + 1).toString());
    }
  }



}

export default Items;