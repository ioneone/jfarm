/**
 * Collection of constant data related to assets.
 */
namespace Assets
{

  /**
   * Collection of file paths to the textures for the game and data related to 
   * these textures.
   */
  export namespace Asset
  {

    /**
     * The unique keys for audio. If you name your asset `foo`, then you must 
     * have audio file located at `foo.wav`.
     * @readonly
     * @enum {string}
     */
    export enum Audio
    {
      DamagePlayer     = "assets/audio/damage_player",
      Swing            = "assets/audio/swing",
      EnemyFoundPlayer = "assets/audio/enemy_found_player",
      ThreeFootSteps   = "assets/audio/three_foot_steps",
      EnemyHit         = "assets/audio/enemy_hit",
      FieldsOfIce      = "assets/audio/fields_of_ice",
      Text             = "assets/audio/text",
      FootSteps        = "assets/audio/foot_steps",
      Jump             = "assets/audio/jump",
      LandingJump      = "assets/audio/landing_jump",
      Grass            = "assets/audio/grass"
    }

    /** 
     * The unique keys for audio. If you name your asset `foo`, then you must 
     * have the texture located at `foo.png`, the atlas data at `foo.json`, 
     * and the normal map at `foo_n.png`. See {@link Assets.Data.Enemy} for 
     * data it expects for enemy assets.
     * @readonly
     * @enum {string}
     */
    export enum Enemy
    {
      OrcWarrior = "assets/enemies/orc_warrior/orc_warrior",
      IceZombie  = "assets/enemies/ice_zombie/ice_zombie",
      Chort      = "assets/enemies/chort/chort"
    }

    /**
     * The unique keys for fonts. If you name your asset `foo`, then you must 
     * have the font texture at `foo.png` and the font data at `foo.xml`.
     * @readonly
     * @enum {string}
     */
    export enum Font
    {
      PressStart2P = "assets/fonts/PressStart2P/PressStart2P"
    }

    /**
     * The unique keys for NPCs. If you name your asset `foo`, then you must 
     * have the NPC texture located at `foo.png` and atlas at `foo.json`.
     * @readonly
     * @enum {string}
     */
    export enum NonPlayerCharacter
    {
      TownsfolkMale = "assets/npcs/townsfolk_m/townsfolk_m",
      Alchemist     = "assets/npcs/alchemist/alchemist",
      Blacksmith    = "assets/npcs/blacksmith/blacksmith"
    }

    /**
     * The unique keys for players. If you name your asset `foo`, then you 
     * must have the player texture located at `foo.png` and atlas at `foo.json`.
     * @readonly
     * @enum {string}
     */
    export enum Player
    {
      ElfFemale = "assets/players/elf_f/elf_f",
      ElfMale   = "assets/players/elf_m/elf_m",
    }

    /**
     * The unique keys for UIs. If you name your asset `foo`, then you must 
     * have the ui image located at `foo.png`.
     * @readonly
     * @enum {string}
     */
    export enum UI
    {
      ItemSlotBordered = "assets/ui/item_slot_bordered",
      HeartEmpty       = "assets/ui/heart_empty",
      HeartHalf        = "assets/ui/heart_half",
      HeartFull        = "assets/ui/heart_full",
      Coin             = "assets/ui/coin"
    }

    /**
     * The unique keys for weapons. If you name your asset `foo`, then you 
     * must have the weapon image located at `foo.png`.
     * @readonly
     * @enum {string}
     */
    export enum Weapon
    {
      RegularSword = "assets/weapons/weapon_regular_sword",
      Axe          = "assets/weapons/weapon_axe",
      Hammer       = "assets/weapons/weapon_hammer"
    }

  }

  /**
   * Collection of data about the restrictions the assets need to meet.
   */
  export namespace Data
  {

    /**
     * Common attributes for {@link Assets.Asset.Enemy}. Expect the `filename` 
     * of the idle animation frames to have prefix `IdleAnimationPrefix` followed
     * by a number starting from 0. Similarly, for running animation frames'
     * `filename` prefixed with `RunAnimationPrefix`.
     * @readonly
     * @enum {string | number}
     */
    export enum Enemy
    {
      IdleAnimationPrefix   = "idle_anim_f",
      RunAnimationPrefix    = "run_anim_f",
      IdleAnimationFrameEnd = 3,
      RunAnimationFrameEnd  = 3
    }

    /**
     * Common attributes for {@link Assets.Asset.NonPlayerCharacter}.
     * @readonly
     * @enum {string | number}
     */
    export enum NonPlayerCharacter
    {
      IdleAnimationPrefix   = "idle_",
      RunAnimationPrefix    = "walk_",
      IdleAnimationFrameEnd = 3,
      RunAnimationFrameEnd  = 3
    }

    /**
     * Common attributes for {@link Assets.Asset.Player}
     * @readonly
     * @enum {string | number}
     */
    export enum Player
    {
      IdleAnimationPrefix   = "idle_anim_f",
      RunAnimationPrefix    = "run_anim_f",
      IdleAnimationFrameEnd = 3,
      RunAnimationFrameEnd  = 3,
      HitFrameKey           = "hit_anim_f0"
    }

  }

}

export default Assets;
