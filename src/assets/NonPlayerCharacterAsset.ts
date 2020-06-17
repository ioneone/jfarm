/**
 * The unique keys for NPCs. 
 * 
 * If you name your asset `foo`, then you must have the NPC texture 
 * located at `foo.png` and atlas at `foo.json`.
 * 
 * @readonly
 * @enum {string}
 */
export enum NonPlayerCharacterAsset
{
  TownsfolkMale = "assets/npcs/townsfolk_m/townsfolk_m"
}

/**
 * Common attributes for {@link NonPlayerCharacterAsset}
 * @readonly
 * @enum {string | number}
 */
export enum NonPlayerCharacterAssetData
{
  IdleAnimationPrefix   = "idle_",
  RunAnimationPrefix    = "walk_",
  IdleAnimationFrameEnd = 3,
  RunAnimationFrameEnd  = 3
}