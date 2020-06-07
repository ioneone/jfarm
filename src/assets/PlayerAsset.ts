/**
 * PlayerAsset represents the filepaths to the spritesheets of 
 * players.
 * 
 * Every spritesheet must have 3 rows and 4 colmuns of 16x28 frames.
 * Frames[0...3] is for idle animation.
 * Frames[4...7] is for run animation.
 * Frames[8] is for hit animation/frame.
 */
export enum PlayerAsset
{
  ElfFemale    = "assets/players/elf_f.png",
  ElfMale      = "assets/players/elf_m.png",
  KnightFemale = "assets/players/knight_f.png",
  KnightMale   = "assets/players/knight_m.png"
}

export enum PlayerAssetData
{
  FrameWidth = 16,
  FrameHeight = 28,
  IdleAnimationFrameStart = 0,
  IdleAnimationFrameEnd = 3,
  RunAnimationFrameStart = 4,
  RunAnimationFrameEnd = 7,
  HitFrame = 8
}