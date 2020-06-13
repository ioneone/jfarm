import { WeaponAsset } from './../assets/WeaponAsset';
import Phaser from 'phaser';
import GrayscalePipeline from '../pipelines/GrayscalePipeline';
import ItemSlot from './ItemSlot';
import Weapon from '~/objects/Weapon';
import EventDispatcher from '~/events/EventDispatcher';

class Inventory extends Phaser.GameObjects.Container
{

  private itemSlots: ItemSlot[];

  private activeSlotIndex: number;

  private keySpace: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene, x: number, y: number)
  {
    super(scene, x, y);
    this.scene.add.existing(this);

    if (this.scene.game.renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer)
    {
      this.scene.game.renderer.addPipeline('Grayscale', new GrayscalePipeline(this.scene.game));
    }
    
    this.itemSlots = [];
    this.itemSlots.push(new ItemSlot(this.scene, 0, 0, WeaponAsset.RegularSword).setScale(2).setAlpha(0.5));
    this.itemSlots.push(new ItemSlot(this.scene, 34, 0, WeaponAsset.Hammer).setScale(2).setAlpha(0.5));
    this.itemSlots.push(new ItemSlot(this.scene, 68, 0, WeaponAsset.Axe).setScale(2).setAlpha(0.5));
    this.itemSlots.push(new ItemSlot(this.scene, 102, 0).setScale(2).setAlpha(0.5));
    this.itemSlots.push(new ItemSlot(this.scene, 136, 0).setScale(2).setAlpha(0.5));
    this.itemSlots.push(new ItemSlot(this.scene, 170, 0).setScale(2).setAlpha(0.5));
    this.itemSlots.push(new ItemSlot(this.scene, 204, 0).setScale(2).setAlpha(0.5));
    this.itemSlots.push(new ItemSlot(this.scene, 238, 0).setScale(2).setAlpha(0.5));

    this.add(this.itemSlots);

    this.activeSlotIndex = 0;

    // this.itemSlots[this.activeSlotIndex].resetPipeline();
    this.itemSlots[this.activeSlotIndex].setAlpha(1);

    this.keySpace = this.scene.input.keyboard.addKey('SPACE');

  }

  public update()
  {
    if (Phaser.Input.Keyboard.JustDown(this.keySpace))
    {
      // this.itemSlots[this.activeSlotIndex].setPipeline('Grayscale');
      this.itemSlots[this.activeSlotIndex].setAlpha(0.5);

      this.activeSlotIndex += 1;
      this.activeSlotIndex %= 8;

      // this.itemSlots[this.activeSlotIndex].resetPipeline();
      this.itemSlots[this.activeSlotIndex].setAlpha(1);

      EventDispatcher.getInstance().emit("ItemSlotChange", { currentItem: this.itemSlots[this.activeSlotIndex].getItem() });
    }
  }

}

export default Inventory;