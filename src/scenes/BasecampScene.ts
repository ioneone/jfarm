import NonPlayerCharacterAsset from '../assets/NonPlayerCharacterAsset';
import { SceneTransitionData } from '../objects/SceneTransitionObject';
import PlayerScene from './PlayerScene';
import NonPlayerCharacter from '../objects/NonPlayerCharacter';

class BasecampScene extends PlayerScene
{

  public static readonly KEY = "BasecampScene";

  // group npcs together for collision detection
  protected npcs?: Phaser.GameObjects.Group;

  constructor()
  {
    super(BasecampScene.KEY);
  }

  /**
   * Scenes can have a preload method, which is always called before the Scenes 
   * create method, allowing you to preload assets that the Scene may need.
   */
  public preload()
  {
    super.preload();
  }

  /**
   * Scenes can have a create method, which is always called after the Scenes 
   * init and preload methods, allowing you to create assets that the Scene may need.
   * 
   * The data is passed when the scene is started/launched by the scene manager.
   * 
   * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
   * @param {SceneTransitionData} data - the data being passed when the scene manager starts this scene
   */
  public create(data: SceneTransitionData)
  {
    super.create(data);

    this.npcs = this.add.group();
    const npc = new NonPlayerCharacter(this, 100, 100, NonPlayerCharacterAsset.Male).setPipeline('Outline')
    this.npcs.add(npc);

    npc.pipeline.setFloat2('uTextureSize', npc.texture.getSourceImage().width, npc.texture.getSourceImage().height);
    // this.npcs.add(new NonPlayerCharacter(this, 100, 200, NonPlayerCharacterAsset.Female).setPipeline('Outline'));
    // this.npcs.add(new NonPlayerCharacter(this, 100, 400, NonPlayerCharacterAsset.King).setPipeline('Outline'));
    // this.npcs.add(new NonPlayerCharacter(this, 200, 300, NonPlayerCharacterAsset.Queen).setPipeline('Outline'));

    // add collision detection between player and collidable layer
    this.physics.add.collider(this.player!, this.npcs);
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

export default BasecampScene;
