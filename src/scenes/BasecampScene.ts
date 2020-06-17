import EventDispatcher from '../events/EventDispatcher';
import { NonPlayerCharacterAsset } from '../assets/NonPlayerCharacterAsset';
import { SceneTransitionData } from '../objects/SceneTransitionObject';
import PlayerScene from './PlayerScene';
import NonPlayerCharacter, { NonPlayerCharacterState } from '../objects/NonPlayerCharacter';
import { PlayerState } from '~/objects/Player';

class BasecampScene extends PlayerScene
{

  public static readonly KEY = "BasecampScene";

  // group npcs together for collision detection
  protected npcGroup?: Phaser.GameObjects.Group;

  protected npcs: NonPlayerCharacter[];

  private prevClosestNPC: NonPlayerCharacter | null;

  constructor()
  {
    super(BasecampScene.KEY);
    this.npcs = [];
    this.prevClosestNPC = null;
  }

  /**
   * Scenes can have a init method, which is always called before the Scenes
   * preload method, allowing you to initialize data that the Scene may need.
   * 
   * The data is passed when the scene is started/launched by the scene manager.
   * 
   * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
   * @param {any} data - the data being passed when the scene manager starts this scene
   */
  public init(data: any): void
  {
    super.init(data);
    this.npcs = [];
    this.prevClosestNPC = null;
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

    this.player?.setAttackEnabled(false);

    this.npcGroup = this.add.group();
    this.npcs.push(new NonPlayerCharacter(this, 100, 100, NonPlayerCharacterAsset.TownsfolkMale));
    this.npcs.push(new NonPlayerCharacter(this, 140, 100, NonPlayerCharacterAsset.TownsfolkMale));
    this.npcs.push(new NonPlayerCharacter(this, 100, 140, NonPlayerCharacterAsset.TownsfolkMale));
    this.npcs.push(new NonPlayerCharacter(this, 180, 180, NonPlayerCharacterAsset.TownsfolkMale));
    this.npcGroup.addMultiple(this.npcs);

    // add collision detection between player and collidable layer
    this.physics.add.collider(this.npcGroup!, this.middleLayer!);
    this.physics.add.collider(this.npcGroup!, this.bottomLayer!);

    EventDispatcher.getInstance().on('dialogends', (data) => {
      this.time.delayedCall(160, () => {
        this.player?.setCurrentState(PlayerState.Default);
        (data.npc as NonPlayerCharacter).setCurrentState(NonPlayerCharacterState.Default);
      });
    });
    
  }

  /**
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time
   * @param {number} delta - the delta time in ms since the last frame
   */
  public update(time: number, delta: number)
  {
    super.update(time, delta);

    if (this.player?.getCurrentState() === PlayerState.Default)
    {
      this.prevClosestNPC?.resetPipeline();

      const closestNPC = this.physics.closest(this.player, this.npcs) as NonPlayerCharacter;

      if (this.player!.getCenter().distance(closestNPC.getCenter()) < 64)
      {
        closestNPC.setOutlinePipeline();

        if (this.player?.isActionKeyDown())
        {
          this.player.setCurrentState(PlayerState.Talking);
          closestNPC.setCurrentState(NonPlayerCharacterState.Talking);
          EventDispatcher.getInstance().emit('playertalkstonpc', { scene: this, player: this.player!, npc: closestNPC });
        }

      }

      this.prevClosestNPC = closestNPC;
    }

    this.player!.depth = this.player!.y + this.player!.height / 2;
    this.player?.getWeapon().setDepth(this.player?.depth);

    this.npcs.forEach(npc => {
      npc.depth = npc.y + npc.height / 2;
      npc.update();
    });

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
