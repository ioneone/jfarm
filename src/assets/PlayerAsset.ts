/**
 * Collection of the absolute or relative URLs to load the player spritesheets from.
 * Every player spritesheet must follow a specific requirement. See {@link PlayerAssetData}
 * for more details.
 * @readonly
 * @enum {string}
 */
export enum PlayerAsset
{
  ElfFemale    = "assets/players/elf_f.png",
  ElfMale      = "assets/players/elf_m.png",
  KnightFemale = "assets/players/knight_f.png",
  KnightMale   = "assets/players/knight_m.png"
}

/**
 * Every player spritesheet must have 3 rows and 4 colmuns of 16x28 frames.
 * Frames 0 ... 3 are for idle animation. Frames 4 ... 7 are for run animation.
 * Frames 8 is for hit animation.
 * @readonly
 * @enum {number}
 */
export enum PlayerAssetData
{
  FrameWidth              = 16,
  FrameHeight             = 28,
  IdleAnimationFrameStart = 0,
  IdleAnimationFrameEnd   = 3,
  RunAnimationFrameStart  = 4,
  RunAnimationFrameEnd    = 7,
  HitFrame                = 8
}