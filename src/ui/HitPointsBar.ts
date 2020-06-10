import { PlayerHpChangeEventData } from './../events/Event';
import EventDispatcher from '../events/EventDispatcher';
import { FontAsset } from './../assets/FontAsset';
import Phaser from 'phaser';
import { Event } from '../events/Event';

/**
 * @classdesc
 * UI for displaying the player's current hit points
 * 
 * @class
 */
class HitPointsBar extends Phaser.GameObjects.Container
{

  // color of the bar background
  private static readonly BAR_RECTANGLE_BACK_COLOR  = 0x000000;

  // color of the bar foreground
  private static readonly BAR_RECTANGLE_FRONT_COLOR = 0x2ff7d6;

  // font size of the text "HP"
  private static readonly TEXT_FONT_SIZE = 16;

  // font size of the hit points digits
  private static readonly DIGIT_FONT_SIZE = 12;

  // spacing between components
  private static readonly SPACING = 2;

  // width of the bar background
  private static readonly BAR_RECTANGLE_WIDTH = 100;

  // the "HP" text object
  private hpText: Phaser.GameObjects.BitmapText;

  // the bar background
  private barRectangleBack: Phaser.GameObjects.Rectangle;

  // the bar foreground
  private barRectangleFront: Phaser.GameObjects.Rectangle;
  
  // the hit points digits object
  private hitPointsText: Phaser.GameObjects.BitmapText; 

  /**
   * @param {Phaser.Scene} scene - the scene this object belongs to
   * @param {number} x - the x world coordinate in pixels
   * @param {number} y - the y world coordinate in pixels
   */
  constructor(scene: Phaser.Scene, x: number, y: number)
  {
    super(scene, x, y);
    this.scene.add.existing(this);

    this.hpText = new Phaser.GameObjects.BitmapText(this.scene, this.x, this.y, 
      FontAsset.PressStart2P, "HP", HitPointsBar.TEXT_FONT_SIZE);
    this.barRectangleBack = new Phaser.GameObjects.Rectangle(this.scene, 
      this.hpText.x + this.hpText.width + HitPointsBar.SPACING, this.y, 
      HitPointsBar.BAR_RECTANGLE_WIDTH, this.hpText.height, HitPointsBar.BAR_RECTANGLE_BACK_COLOR).setOrigin(0, 0);
    this.barRectangleFront = new Phaser.GameObjects.Rectangle(this.scene, 
      this.barRectangleBack.x + HitPointsBar.SPACING, this.y + HitPointsBar.SPACING, 
      HitPointsBar.BAR_RECTANGLE_WIDTH - 2 * HitPointsBar.SPACING, 
      this.hpText.height - 2 * HitPointsBar.SPACING, HitPointsBar.BAR_RECTANGLE_FRONT_COLOR).setOrigin(0, 0);
    this.hitPointsText = new Phaser.GameObjects.BitmapText(this.scene, 
      this.barRectangleBack.x + this.barRectangleBack.width, 
      this.barRectangleBack.y + this.barRectangleBack.height + HitPointsBar.SPACING, 
      FontAsset.PressStart2P, "100/100", HitPointsBar.DIGIT_FONT_SIZE).setOrigin(1, 0)

    this.add(this.hpText);
    this.add(this.barRectangleBack);
    this.add(this.barRectangleFront);
    this.add(this.hitPointsText);

    // event handling
    EventDispatcher.getInstance().on(Event.PlayerHpChange, this.handlePlayerHpChangeEvent, this);

    // clean up listeners when removed
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      EventDispatcher.getInstance().off(Event.PlayerHpChange, this.handlePlayerHpChangeEvent, this);
    });
  }

  /**
   * Callback for receiving {@link Event#PlayerHpChange} event.
   * @param {DamageEventData} data - the data associated with the event
   */
  private handlePlayerHpChangeEvent(data: PlayerHpChangeEventData): void
  {
    const hp = data.hitPoints;
    const maxHp = data.maxHitPoints;

    const hpLeftRatio = hp / maxHp;
    
    this.barRectangleFront?.setDisplaySize(Math.max(0, Math.floor((HitPointsBar.BAR_RECTANGLE_WIDTH - 2 * HitPointsBar.SPACING) * hpLeftRatio)), 
      this.barRectangleFront.height);
    this.hitPointsText?.setText(hp.toString() + '/' + maxHp.toString());
  }

}

export default HitPointsBar;