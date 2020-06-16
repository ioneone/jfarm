import { WeaponAsset } from '../assets/WeaponAsset';
import Phaser from 'phaser';
import ItemSlot from './ItemSlot';

/**
 * UI for the player's inventory displayed at the bottom of {@link UIScene}.
 * @class
 * @classdesc
 * This class emits {@link Events.Event#ItemSlotChange} event when the current item 
 * slot changes.
 */
class Inventory extends Phaser.GameObjects.Container
{

  // the item slots of the inventory
  private itemSlots: ItemSlot[];

  // current selected item slot index
  private activeSlotIndex: number;

  // the reference to the 'SPACE' key for changing item slot
  private keySpace: Phaser.Input.Keyboard.Key;

  /**
   * @param {Phaser.Scene} scene - the scene this object belongs to
   * @param {number} x - the x canvas coordinate in pixels
   * @param {number} y - the y canvas coordinate in pixels
   */
  constructor(scene: Phaser.Scene, x: number, y: number)
  {
    super(scene, x, y);

    // add this container to the scene
    this.scene.add.existing(this);

    // initialize member variables
    this.activeSlotIndex = 0;
    this.keySpace = this.scene.input.keyboard.addKey('SPACE');
    this.itemSlots = [];

    // create item slots
    this.itemSlots.push(new ItemSlot(this.scene, 
      0, 0, WeaponAsset.RegularSword));
    this.itemSlots.push(new ItemSlot(this.scene, 
      this.itemSlots[0].x + this.itemSlots[0].getBounds().width, 0, WeaponAsset.Hammer));
    this.itemSlots.push(new ItemSlot(this.scene, this.itemSlots[1].x + this.itemSlots[1].getBounds().width, 0, WeaponAsset.Axe));
    this.itemSlots.push(new ItemSlot(this.scene, this.itemSlots[2].x + this.itemSlots[2].getBounds().width, 0));
    this.itemSlots.push(new ItemSlot(this.scene, this.itemSlots[3].x + this.itemSlots[3].getBounds().width, 0));
    this.itemSlots.push(new ItemSlot(this.scene, this.itemSlots[4].x + this.itemSlots[4].getBounds().width, 0));
    this.itemSlots.push(new ItemSlot(this.scene, this.itemSlots[5].x + this.itemSlots[5].getBounds().width, 0));
    this.itemSlots.push(new ItemSlot(this.scene, this.itemSlots[6].x + this.itemSlots[6].getBounds().width, 0));
    this.add(this.itemSlots);

    this.itemSlots[this.activeSlotIndex].setSelected(true);
  }

  /**
   * Update the selected item slot if necessary. This method should be called 
   * every frame.
   */
  public update(): void
  {
    if (Phaser.Input.Keyboard.JustDown(this.keySpace))
    {
      this.itemSlots[this.activeSlotIndex].setSelected(false);
      this.activeSlotIndex += 1;
      this.activeSlotIndex %= 8;
      this.itemSlots[this.activeSlotIndex].setSelected(true);
    }
  }

}

export default Inventory;