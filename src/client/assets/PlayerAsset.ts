/**
 * Collection of the absolute or relative URLs to load the player spritesheets from.
 * Every player spritesheet must follow a specific requirement. See {@link PlayerAssetData}
 * for more details.
 * @readonly
 * @enum {string}
 */
export enum PlayerAsset
{
  ElfFemale = "assets/players/elf_f/elf_f",
  ElfMale   = "assets/players/elf_m/elf_m",
}

/**
 * Common attributes for {@link PlayerAsset}
 * @readonly
 * @enum {string | number}
 */
export enum PlayerAssetData
{
  IdleAnimationPrefix   = "idle_anim_f",
  RunAnimationPrefix    = "run_anim_f",
  IdleAnimationFrameEnd = 3,
  RunAnimationFrameEnd  = 3,
  HitFrameKey           = "hit_anim_f0"
}