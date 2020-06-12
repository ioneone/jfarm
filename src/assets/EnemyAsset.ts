/** 
 * Collection of the absolute or relative URLs to load the enemy spritesheets from.
 * Every enemy spritesheet must follow a specific requirement. See {@link EnemyAssetData}
 * for more details.
 * @readonly
 * @see EnemyAssetData
 * @enum {string}
 */
export enum EnemyAsset
{
  OrcWarrior = "assets/enemies/orc_warrior.png",
  IceZombie  = "assets/enemies/ice_zombie.png",
  Chort      = "assets/enemies/chort.png"
}

/**
 * Collection of the data common to all {@link EnemyAsset}
 * Frames 0 ... 3 are for idle animation.
 * Frames 4 ... 7 are for run animation.
 * @readonly
 * @enum {number}
 */
export enum EnemyAssetData
{
  IdleAnimationFrameStart = 0,
  IdleAnimationFrameEnd   = 3,
  RunAnimationFrameStart  = 4,
  RunAnimationFrameEnd    = 7
}