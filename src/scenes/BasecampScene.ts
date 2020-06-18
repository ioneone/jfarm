import { Events } from '../events/Events';
import EventDispatcher from '../events/EventDispatcher';
import { SceneTransitionData } from '../objects/SceneTransitionObject';
import PlayerScene from './PlayerScene';
import NonPlayerCharacter, { NonPlayerCharacterState } from '../objects/NonPlayerCharacter';
import { PlayerState } from '~/objects/Player';
import { TileLayer } from './TilemapScene';
import NonPlayerCharacterFactory from '~/factory/NonPlayerCharacterFactory';

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

    // add npcs to the scene
    this.npcGroup = this.add.group();
    this.tilemap?.getObjectLayer(TileLayer.Object).objects.forEach(tiledObject => {
      this.npcs.push(NonPlayerCharacterFactory.create(this, tiledObject));
    });
    this.npcGroup.addMultiple(this.npcs);

    // add collision detection between player and collidable layer
    this.physics.add.collider(this.npcGroup!, this.middleLayer!);
    this.physics.add.collider(this.npcGroup!, this.bottomLayer!);
    
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
          EventDispatcher.getInstance().emit(Events.Event.PlayerTalksToNPC, { scene: this, player: this.player!, npc: closestNPC });
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

    EventDispatcher.getInstance().on(Events.Event.PlayerTalksToNPC, () => {
      this.cameras.main.zoomTo(2.2, 600, 'Sine.easeInOut');
    });

    EventDispatcher.getInstance().on(Events.Event.DialogEnds, () => {
      this.cameras.main.zoomTo(2, 600, 'Sine.easeInOut');
    });

  }

}

export default BasecampScene;
