import Phaser from 'phaser';
import GrayscalePipeline from '../pipelines/GrayscalePipeline';

class Inventory extends Phaser.GameObjects.Container
{

  private itemSlots: Phaser.GameObjects.Sprite[];

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
    this.itemSlots.push(new Phaser.GameObjects.Sprite(this.scene, 0, 0, "assets/ui/item_slot.png").setOrigin(0, 0).setScale(2).setAlpha(0.92).setPipeline('Grayscale'));
    this.itemSlots.push(new Phaser.GameObjects.Sprite(this.scene, 30, 0, "assets/ui/item_slot.png").setOrigin(0, 0).setScale(2).setAlpha(0.92).setPipeline('Grayscale'));
    this.itemSlots.push(new Phaser.GameObjects.Sprite(this.scene, 60, 0, "assets/ui/item_slot.png").setOrigin(0, 0).setScale(2).setAlpha(0.92).setPipeline('Grayscale'));
    this.itemSlots.push(new Phaser.GameObjects.Sprite(this.scene, 90, 0, "assets/ui/item_slot.png").setOrigin(0, 0).setScale(2).setAlpha(0.92).setPipeline('Grayscale'));
    this.itemSlots.push(new Phaser.GameObjects.Sprite(this.scene, 120, 0, "assets/ui/item_slot.png").setOrigin(0, 0).setScale(2).setAlpha(0.92).setPipeline('Grayscale'));
    this.itemSlots.push(new Phaser.GameObjects.Sprite(this.scene, 150, 0, "assets/ui/item_slot.png").setOrigin(0, 0).setScale(2).setAlpha(0.92).setPipeline('Grayscale'));
    this.itemSlots.push(new Phaser.GameObjects.Sprite(this.scene, 180, 0, "assets/ui/item_slot.png").setOrigin(0, 0).setScale(2).setAlpha(0.92).setPipeline('Grayscale'));
    this.itemSlots.push(new Phaser.GameObjects.Sprite(this.scene, 210, 0, "assets/ui/item_slot.png").setOrigin(0, 0).setScale(2).setAlpha(0.92).setPipeline('Grayscale'));

    this.add(this.itemSlots);

    this.activeSlotIndex = 0;

    this.itemSlots[this.activeSlotIndex].resetPipeline();

    this.keySpace = this.scene.input.keyboard.addKey('SPACE');

  }

  public update()
  {
    if (Phaser.Input.Keyboard.JustDown(this.keySpace))
    {
      this.itemSlots[this.activeSlotIndex].setPipeline('Grayscale');

      this.activeSlotIndex += 1;
      this.activeSlotIndex %= 8;

      this.itemSlots[this.activeSlotIndex].resetPipeline();
    }
  }

}

export default Inventory;