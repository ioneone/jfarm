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
  OrcWarrior = "assets/enemies/orc_warrior/orc_warrior",
  IceZombie  = "assets/enemies/ice_zombie/ice_zombie",
  Chort      = "assets/enemies/chort/chort"
}

/**
 * Common attributes for {@link EnemyAsset}
 * @readonly
 * @enum {string | number}
 */
export enum EnemyAssetData
{
  IdleAnimationPrefix   = "idle_anim_f",
  RunAnimationPrefix    = "run_anim_f",
  IdleAnimationFrameEnd = 3,
  RunAnimationFrameEnd  = 3
}