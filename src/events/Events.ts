import NonPlayerCharacter from '../objects/NonPlayerCharacter';
import Phaser from 'phaser';
import Player from '../objects/Player';

namespace Events
{
  
  /**
   * Collection of custom events of the game. Events are useful when you want to 
   * pass data from one scene to another. See {@link EventDispatcher} to learn 
   * more about how to fire and listen for events.
   * @readonly
   * @enum {string}
   */
  export enum Event
  {
    // the hit points of the player has changed
    PlayerHpChange = "playerhpchange",
    // someone has lost hit points
    Damage = "damage",
    // enemy sees player in its vision range
    EnemyFoundPlayer = "EnemyFoundPlayer",
    // the selected item solot has changed
    ItemSlotChange = "itemslotchange",
    // when the player wants to start the game
    StartGame = "startgame",
    // when preload scene preloaded all the assets
    PreloadComplete = "preloadcomplete",
    // when the player's hp is 0
    PlayerDies = "playerdies",
    // when the player initiates the conversation with a npc
    PlayerTalksToNPC = 'playertalkstonpc',
    // when the player finishes conversation with a npc
    DialogEnds = 'dialogends',
    // when the npc talks and thus the text is animating
    NPCTalking = 'npctalking',
    // when the npc stops talking and thus the text is not animating
    NPCStopsTalking = 'npcstopstalking'
  }

  /**
   * For every {@link Events.Event}, there exists a corresponding {@link Event.Data}.
   * For example, the event data for {@link Events.Event#PlayerHpChange} is 
   * {@link Events.Data#PlayerHpChange}.
   */
  export namespace Data
  {
    /**
     * Data type to be sent when {@link Event#PlayerHpChange} is fired.
     * @interface
     */
    export interface PlayerHpChange
    {
      // the player's current hit points
      currentHitPoints: number
    }

    /**
     * Data type to be sent when {@link Event#Damage} is fired.
     * @interface
     */
    export interface Damage
    {
      // damage the object receives
      damage: number,
      // x world coordinate of the object relative to the canvas position the event occured
      x: number,
      // y world coordinate of the object relative to the canvas position the event occured
      y: number,
      // color of the damage text (default white)
      color?: number
    }

    /**
     * Data type to be sent when {@link Event#EnemyFoundPlayer} is fired.
     * @interface
     */
    export interface EnemyFoundPlayer
    {
      // x world coordinate of the object relative to the canvas position the event occured
      x: number,
      // y world coordinate of the object relative to the canvas position the event occured
      y: number,
      // height of the object in pixels
      height: number
    }

    /**
     * Data type to be sent when {@link Event#ItemSlotChange} is fired.
     * @interface
     */
    export interface ItemSlotChange
    {
      currentWeaponAsset?: WeaponAsset
    }

    /**
     * Data type to be sent when {@link Event#StartGame} is fired.
     * @interface
     */
    export interface StartGame
    {
      scene: Phaser.Scene
    }

    /**
     * Data type to be sent when {@link Event#PreloadComplete} is fired.
     * @interface
     */
    export interface PreloadComplete
    {
      scene: Phaser.Scene
    }

    /**
     * Data type to be sent when {@link Event#PlayerDies} is fired.
     * @interface
     */
    export interface PlayerDies
    {
      scene: Phaser.Scene
    }

    /**
     * Data type to be sent when {@link Events.Event#PlayerTalksToNPC} is fired.
     * @interface
     */
    export interface PlayerTalksToNPC
    {
      scene: Phaser.Scene,
      player: Player,
      npc: NonPlayerCharacter
    }

    /**
     * Data type to be sent when {@link Events.Event#DialogEnds} is fired.
     * @interface
     */
    export interface DialogEnds
    {
      scene: Phaser.Scene
    }

  }

}

export default Events;