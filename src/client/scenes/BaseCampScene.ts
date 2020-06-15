import { FontAsset } from '../assets/FontAsset';
import { AudioAsset } from '../assets/AudioAsset';
import { WeaponAsset } from '../assets/WeaponAsset';
import { PlayerAsset } from '../assets/PlayerAsset';
import { SceneTransitionData } from '../objects/SceneTransitionObject';
import TilemapScene from './TilemapScene';
import PlayerFactory from '../factory/PlayerFactory';
import Player from '../objects/Player';

/**
 * TODO: Work In Progress.
 */
class BaseCampScene extends TilemapScene
{

  public static readonly KEY = "BaseCampScene";

  // the player to control
  protected player?: Player;

  constructor()
  {
    super(BaseCampScene.KEY);
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
    this.load.image(WeaponAsset.RegularSword);
    this.load.image(WeaponAsset.Axe);
    this.load.image(WeaponAsset.Hammer);
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.Swing));
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.ThreeFootSteps));
    this.load.bitmapFont(FontAsset.PressStart2P);
  }

  /**
   * Scenes can have a create method, which is always called after the Scenes 
   * init and preload methods, allowing you to create assets that the Scene may need.
   * 
   * The data is passed when the scene is started/launched by the scene manager.
   * 
   * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
   * @param {any} data - the data being passed when the scene manager starts this scene
   */
  public create(data: any)
  {
    super.create(data);

    // add player to the scene
    this.player = PlayerFactory.create(this, 100, 100, PlayerAsset.ElfMale);
    // this.player.setAttackEnabled(false);

    // add collision detection between player and collidable layer
    this.physics.add.collider(this.player!, this.middleLayer!);
    this.physics.add.collider(this.player!, this.bottomLayer!);

    // configure the camera to follow the player
    this.cameras.main.startFollow(this.player!, true, 0.1, 0.1);
    
    // Bring top layer to the front.
    // Depth is 0 (unsorted) by default, which perform the rendering 
    // in the order it was added to the scene.
    this.topLayer?.setDepth(1);

    // need at least one light source
    // this.light = this.lights.addLight(0, 0, 0);

    this.lights.enable().setAmbientColor(0xffffff);

  }

  /**
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time
   * @param {number} delta - the delta time in ms since the last frame
   */
  public update(time: number, delta: number)
  {
    super.update(time, delta);
    this.player?.update();
  }

  /**
   * Get the unique key of the tile map. The `key` of a tile map is just its 
   * file path excluding the extension. If your tile map is located at 
   * `path/to/tile/map/foo.json`, then the key should be `path/to/tile/map/foo`.
   * @param {SceneTransitionData} data - the data the scene received for initialization
   * @return {string} - the tile map key
   */
  public getTilemapKey(data: SceneTransitionData): string
  {
    return "assets/map/basecamp";
  }

  /**
   * Get the unique key of the tile set. The `key` of a tile set is just its 
   * file path excluding the extension. If your tile set is located at 
   * `path/to/tile/set/foo.png`, then the key should be `path/to/tile/set/foo`.
   * The tile set normal map must be located at `path/to/tile/set/foo_n.png`.
   * @param {SceneTransitionData} data - the data the scene received for initialization
   * @return {string} - the tile set key
   */
  public getTilesetKey(data: SceneTransitionData): string
  {
    return "assets/map/tiles";
  }
}

export default BaseCampScene;