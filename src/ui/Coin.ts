import Phaser from 'phaser';
import Assets from '../assets/Assets';

/**
 * The coin UI to display on top left corner of screen to show how much coins 
 * the player has.
 */
class Coin extends Phaser.GameObjects.Container
{

  // how much coins the player currently has
  private countText: Phaser.GameObjects.BitmapText;

  /**
   * @param {Phaesr.Scene} scene - the scene this object belongs to
   * @param {number} x - the x canvas coordinate origined at top left corner
   * @param {number} y - the y canvas coordinate origined at top left corner
   */
  constructor(scene: Phaser.Scene, x: number, y: number)
  {
    super(scene, x, y);
    this.scene.add.existing(this);

    this.countText = new Phaser.GameObjects.BitmapText(this.scene, 16, 0, Assets.Asset.Font.PressStart2P, "0", 8);

    this.add(new Phaser.GameObjects.Sprite(this.scene, 0, 0, Assets.Asset.UI.Coin).setOrigin(0, 0));
    this.add(this.countText);

    this.setScale(2);
  }

}

export default Coin;