import { ItemSlotChangeEventData } from '../events/Event';
import { WeaponAsset } from '../assets/WeaponAsset';
import { UIAsset } from '../assets/UIAsset';
import Phaser from 'phaser';
import GrayscalePipeline from '../pipelines/GrayscalePipeline';
import EventDispatcher from '../events/EventDispatcher';
import { Event } from '../events/Event';

/**
 * UI for an item slot.
 * @class
 * @classdesc
 * UI components for {@link Inventory}. An item slot can hold an item.
 */
class ItemSlot extends Phaser.GameObjects.Container
{

  // the ui for the slot
  private slot: Phaser.GameObjects.Sprite;

  // the item the slot is holding
  private weaponAsset?: WeaponAsset;

  // whether this slot is currently selected or not
  private selected: boolean;

  /**
   * @param {Phaser.Scene} scene - the scene this object belongs to
   * @param {number} x - the x canvas coordinate in pixels
   * @param {number} y - the y canvas coordinate in pixels
   * @param {WeaponAsset} weaponAsset - the weapon asset this slot is holding
   */
  constructor(scene: Phaser.Scene, x: number, y: number, weaponAsset?: WeaponAsset)
  {
    super(scene, x, y);

    // add the container to the scene
    this.scene.add.existing(this);

    // register a custom pipeline if webGL is enabled
    if (this.scene.game.renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer)
    {
      this.scene.game.renderer.addPipeline('Grayscale', new GrayscalePipeline(this.scene.game));
    }

    // initilaize memeber variables
    this.weaponAsset = weaponAsset;
    this.selected = false;
    this.slot = new Phaser.GameObjects.Sprite(this.scene, 0, 0, UIAsset.ItemSlotBordered);

    this.add(this.slot);
    
    if (weaponAsset)
    {
      const item = new Phaser.GameObjects.Sprite(this.scene, 0, 0, weaponAsset);
      this.add(item);
    }

    this.setScale(2);
    this.setSelected(this.selected);
  }

  /**
   * Updates the ui of this slot. If `selected` is `true`, then it also emits
   * {@link Event#ItemSlotChange} event.
   * @param {boolean} selected - whether the slot is selected or not
   */
  public setSelected(selected: boolean): void
  {
    this.selected = selected;
    if (selected)
    {
      this.slot.resetPipeline();
      this.setAlpha(1);
      EventDispatcher.getInstance().emit(Event.ItemSlotChange, { currentWeaponAsset: this.weaponAsset } as ItemSlotChangeEventData);
    }
    else
    {
      this.slot.setPipeline('Grayscale');
      this.setAlpha(0.5);
    }
  }

}

export default ItemSlot;