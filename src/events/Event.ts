/**
 * Custom events
 */
export enum Event
{
  // This event should be fired when the hit points of the player changes.
  // It is fired by Player and listened by UIScene
  PlayerHpChange = "playerhpchange",

  // someone loses hit points
  // It is fired by Player or Enemy and listened by UIScene
  Damage = "damage"
}

/**
 * Custom event data
 */

// Event data for Event.PlayerHpChange
export interface PlayerHpChangeEventData
{
  // hit points of the player
  hitPoints: number;
  // maximum hit points of the player
  maxHitPoints: number;
}

// Event data for Event.Damage
export interface DamageEventData
{
  // damage the object receives
  damage: number,
  // x world coordinate in pixels of the object relative to the main camera
  x: number,
  // y world coordinate in pixels of the object relative to the main camera
  y: number
}