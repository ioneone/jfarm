/**
 * EnemyAsset represents the filepaths to the spritesheets of 
 * enemies.
 * 
 * Every spritesheet must have 2 rows and 4 colmuns of 16x20 frames.
 * Frames[0...3] is for idle animation.
 * Frames[4...7] is for run animation.
 */
export enum EnemyAsset
{
  OrcWarrior = "assets/enemies/orc_warrior.png",
}

export enum EnemyAssetData
{
  FrameWidth = 16,
  FrameHeight = 20,
  IdleAnimationFrameStart = 0,
  IdleAnimationFrameEnd = 3,
  RunAnimationFrameStart = 4,
  RunAnimationFrameEnd = 7
}