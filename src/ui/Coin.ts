import { FontAsset } from './../assets/FontAsset';
import { UIAsset } from './../assets/UIAsset';
import Phaser from 'phaser';

class Coin extends Phaser.GameObjects.Sprite
{

  private bitmapText: Phaser.GameObjects.BitmapText;

  constructor(scene: Phaser.Scene, x: number, y: number)
  {
    super(scene, x, y, UIAsset.Coin);
    this.scene.add.existing(this);

    this.setOrigin(0, 0);
    this.setScale(2)

    // this.scene.anims.create({
    //   key: UIAsset.Coin, 
    //   frames: this.scene.anims.generateFrameNames(UIAsset.Coin, 
    //     {
    //       prefix: 'coin_anim_f',
    //       end: 3,
    //     }
    //   ),
    //   frameRate: 8,
    //   repeat: -1
    // });

    this.bitmapText = this.scene.add.bitmapText(x + 24, y + 2, FontAsset.PressStart2P, "0", 12);

  }

}

export default Coin;