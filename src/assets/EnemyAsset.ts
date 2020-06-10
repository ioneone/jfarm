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
}

/**
 * Every enemy spritesheet must have 2 rows and 4 colmuns of 16x20 frames.
 * Frames 0 ... 3 are for idle animation.
 * Frames 4 ... 7 are for run animation.
 * @readonly
 * @enum {number}
 */
export enum EnemyAssetData
{
  FrameWidth              = 16,
  FrameHeight             = 20,
  IdleAnimationFrameStart = 0,
  IdleAnimationFrameEnd   = 3,
  RunAnimationFrameStart  = 4,
  RunAnimationFrameEnd    = 7
}