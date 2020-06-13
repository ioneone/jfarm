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
  
  private heartSprites: Phaser.GameObjects.Sprite[];

  /**
   * @param {Phaser.Scene} scene - the scene this object belongs to
   * @param {number} x - the x world coordinate in pixels
   * @param {number} y - the y world coordinate in pixels
   */
  constructor(scene: Phaser.Scene, x: number, y: number)
  {
    super(scene, x, y);
    this.scene.add.existing(this);

    this.heartSprites = [];
    this.heartSprites.push(this.scene.add.sprite(x, y, "assets/ui/ui_heart.png", 2).setOrigin(0, 0).setScale(2));
    this.heartSprites.push(this.scene.add.sprite(x + 32, y, "assets/ui/ui_heart.png", 2).setOrigin(0, 0).setScale(2));
    this.heartSprites.push(this.scene.add.sprite(x + 64, y, "assets/ui/ui_heart.png", 2).setOrigin(0, 0).setScale(2));
    this.heartSprites.push(this.scene.add.sprite(x + 96, y, "assets/ui/ui_heart.png", 2).setOrigin(0, 0).setScale(2));
    this.heartSprites.push(this.scene.add.sprite(x + 128, y, "assets/ui/ui_heart.png", 2).setOrigin(0, 0).setScale(2));

    this.add(this.heartSprites);

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

    const currentHitPoints = data.currentHitPoints;

    const numFullHearts = Math.floor(currentHitPoints / 2);
    const hasHalfHeart = currentHitPoints % 2 !== 0;

    for (let i = 0; i < this.heartSprites.length; i++)
    {
      if (i < numFullHearts)
      {
        this.heartSprites[i].setFrame(2);
      }
      else
      {
        if (i === numFullHearts && hasHalfHeart)
        {
          this.heartSprites[i].setFrame(1);
        }
        else
        {
          this.heartSprites[i].setFrame(0); 
        }
      }
      
    }
    
  }

}

export default HitPointsBar;