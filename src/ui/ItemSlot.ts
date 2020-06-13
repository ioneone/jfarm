import Phaser from 'phaser';
import Weapon from '~/objects/Weapon';

class ItemSlot extends Phaser.GameObjects.Container
{

  private item?: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number, itemAsset?: string)
  {
    super(scene, x, y);
    // this.scene.add.existing(this);

    const slot = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "assets/ui/item_slot_bordered.png");
    this.add(slot);
    
    if (itemAsset)
    {
      this.item = new Phaser.GameObjects.Sprite(this.scene, 0, 0, itemAsset);
      console.log(slot, this.item);
      this.item.setScale((slot.height - 4) / this.item.height);
      this.add(this.item);
    }
  }

  public getItem(): Phaser.GameObjects.Sprite | undefined
  {
    return this.item;
  }
}

export default ItemSlot;