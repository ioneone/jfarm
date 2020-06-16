import { AudioAsset } from './../assets/AudioAsset';
import Weapon from '../objects/Weapon';
import { WeaponAsset } from '../assets/WeaponAsset';
import { EnemyAsset } from '../assets/EnemyAsset';
import { PlayerAsset } from '../assets/PlayerAsset';
import Phaser from 'phaser';
import TilemapScene, { TileLayer } from './TilemapScene';
import Enemy, { EnemyUpdateState } from '../objects/Enemy';
import EnemyFactory from '../factory/EnemyFactory';
import PlayerScene from './PlayerScene';
import { LevelSceneTransitionData } from '~/objects/LevelSceneTransitionObject';
import CombatScene from './CombatScene';

/**
 * The scene for the dugeon.
 * @class
 * @classdesc
 * A dungeon is a collection of level scenes. Make sure your transition object 
 * exported from Tiled program has all the properties specified in {@link SceneTransitionData}.
 * Then it automatically takes care of loading the next level scene.
 */
class LevelScene extends CombatScene
{

  // the unique id of this scene
  public static readonly KEY = "LevelScene";

  constructor()
  {
    super(LevelScene.KEY);
  }

  /**
   * Scenes can have a init method, which is always called before the Scenes
   * preload method, allowing you to initialize data that the Scene may need.
   * 
   * The data is passed when the scene is started/launched by the scene manager.
   * 
   * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
   * @param {LevelSceneTransitionData} data - the data being passed when the scene manager starts this scene
   */
  public init(data: LevelSceneTransitionData)
  {
    super.init(data);  
  }
 
  /**
   * Scenes can have a preload method, which is always called before the Scenes 
   * create method, allowing you to preload assets that the Scene may need.
   */
  public preload()
  {
    super.preload();
    this.load.atlas(PlayerAsset.ElfFemale);
    this.load.atlas(PlayerAsset.ElfMale);
    this.load.atlas(this.createDefaultAtlasJSONFileConfig(EnemyAsset.OrcWarrior));
    this.load.atlas(this.createDefaultAtlasJSONFileConfig(EnemyAsset.IceZombie));
    this.load.atlas(this.createDefaultAtlasJSONFileConfig(EnemyAsset.Chort));
    this.load.image(WeaponAsset.RegularSword);
    this.load.image(WeaponAsset.Axe);
    this.load.image(WeaponAsset.Hammer);
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.DamagePlayer));
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.Swing));
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.ThreeFootSteps));
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.EnemyHit));
  }

  /**
   * Scenes can have a create method, which is always called after the Scenes 
   * init and preload methods, allowing you to create assets that the Scene may need.
   * 
   * The data is passed when the scene is started/launched by the scene manager.
   * 
   * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
   * @param {LevelSceneTransitionData} data - the data being passed when the scene manager starts this scene
   */
  public create(data: LevelSceneTransitionData)
  {
    super.create(data);
  }

  /**
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time
   * @param {number} delta - the delta time in ms since the last frame
   */
  public update(time: number, delta: number)
  {
    super.update(time, delta);
  }

  /**
   * Get the unique key of the tile map. The `key` of a tile map is just its 
   * file path excluding the extension. If your tile map is located at 
   * `path/to/tile/map/foo.json`, then the key should be `path/to/tile/map/foo`.
   * @override
   * @param {LevelSceneTransitionData} data - the data the scene received for initialization
   * @return {string} - the tile map key
   */
  public getTilemapKey(data: LevelSceneTransitionData): string
  {
    return "assets/map/" + data.tilemapFileNamePrefix + data.destinationLevel!.toString();
  }

  /**
   * Get the unique key of the tile set. The `key` of a tile set is just its 
   * file path excluding the extension. If your tile set is located at 
   * `path/to/tile/set/foo.png`, then the key should be `path/to/tile/set/foo`.
   * @override
   * @param {LevelSceneTransitionData} data - the data the scene received for initialization
   * @return {string} - the tile set key
   */
  public getTilesetKey(data: LevelSceneTransitionData): string
  {
    return "assets/map/" + data.tilesetFileName;
  }
  
}

export default LevelScene;