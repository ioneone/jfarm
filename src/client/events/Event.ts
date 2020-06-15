import { WeaponAsset } from '../assets/WeaponAsset';

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
  EnemyFoundPlayer = "enemyfoundplayer",
  // the selected item solot has changed
  ItemSlotChange = "itemslotchange",
  // the client just visited the game (only happends once per client)
  VisitGame = "visitgame",
  // a new player just joined the game
  NewPlayer = "newplayer",
  // when a player moved (animation also counts as moving)
  PlayerMoved = "playermoved"
}

export namespace EventData
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
    // current selected weapon asset in the inventory
    currentWeaponAsset?: WeaponAsset
  }


  /**
   * Data type to be sent when {@link Event#VisitGame} is fired.
   * The players currently online.
   * @interface
   */
  export type VisitGame = {[key: string]: any};

  /**
   * Data type to be sent when {@link Event#NewPlayer} is fired.
   * The new player who just joined the game.
   * @interface
   */
  export type NewPlayer = {[key: string]: any};

  /**
   * Data type to be sent when {@link Event#PlayerMoved} is fired.
   * @interface
   */
  export interface PlayerMoved
  {
    // x world coordinate of the player after it moved
    x: number;
    // y world cooridnate of the player after it moved
    y: number;
    // flipX of the player after it moved
    flipX: boolean;
    // the animation frame name of the player after it moved
    frameName: string;
    // the angle of the weapon the player is holding
    weaponAngle: number;
  }

}