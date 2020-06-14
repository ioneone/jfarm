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
  EnemyFoundPlayer = "EnemyFoundPlayer",
  // the selected item solot has changed
  ItemSlotChange = "itemslotchange"
}

/**
 * Data type to be sent when {@link Event#PlayerHpChange} is fired.
 * @interface
 */
export interface PlayerHpChangeEventData
{
  // the player's current hit points
  currentHitPoints: number
}

/**
 * Data type to be sent when {@link Event#Damage} is fired.
 * @interface
 */
export interface DamageEventData
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
export interface EnemyFoundPlayerEventData
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
export interface ItemSlotChangeEventData
{
  currentWeaponAsset?: WeaponAsset
}