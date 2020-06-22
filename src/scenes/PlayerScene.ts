import Assets from '../assets/Assets';
import { SceneTransitionData } from '../objects/SceneTransitionObject';
import Player from '../objects/Player';
import PlayerFactory from '../factory/PlayerFactory';
import SceneTransitionObject from '../objects/SceneTransitionObject';
import PlatformScene from './PlatformScene';

/**
 * The scene with player in it.
 * @class
 * @classdesc
 * Most of the scenes contain the player. {@link PlayerScene} abstracts away 
 * the player logics and how it interacts with the world, so you don't have to 
 * duplicate the player code in every scene.
 * 
 * Specifically, {@link PlayerScene} takes care of player rendering, movement, 
 * collision with the world. It also hanldes scene transition logics when the 
 * player overlaps with {@link SceneTransitionObject}.
 */
abstract class PlayerScene extends PlatformScene
{
  
  // the player to control
  protected player?: Player;

  /**
   * This is called only once when you start the game. Every time a scene is 
   * created using methods like `scene.start()`, `constructor()` will not be 
   * called (`init()` will still be called though).
   * @param {string} key - the unique id of the scene
   */
  constructor(key: string)
  {
    super(key);
  }

  /**
   * Scenes can have a init method, which is always called before the Scenes
   * preload method, allowing you to initialize data that the Scene may need.
   * 
   * The data is passed when the scene is started/launched by the scene manager.
   * 
   * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
   * @param {SceneTransitionData} data - the data being passed when the scene manager starts this scene
   * @override
   */
  public init(data: SceneTransitionData): void
  {
    super.init(data);
  }
  
  /**
   * Scenes can have a preload method, which is always called before the Scenes 
   * create method, allowing you to preload assets that the Scene may need.
   * @override
   */
	public preload(): void
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
   * @override
   */
	public create(data: SceneTransitionData): void
	{
    super.create(data);

    this.player = PlayerFactory.create(this, data.destinationX!, data.destinationY!, Assets.Asset.Player.ElfMale);

    // add collision detection between player and collidable layer
    this.physics.add.collider(this.player!, this.middleLayer!);
    this.physics.add.collider(this.player!, this.bottomLayer!);

    // add overlap detection between player and transition objects
    this.physics.add.overlap(this.player!, this.transitionObjectGroup!, (object1, object2) => {
      const player = object1 as Player;
      player.getBody().setEnable(false);
      const sceneTranstionData = (object2 as SceneTransitionObject).getSceneTransitionData();
      this.sound.play(Assets.Asset.Audio.ThreeFootSteps);
      this.cameras.main.fadeOut(200, 0, 0, 0, (_, progress) => {
        if (progress === 1)
        {
          this.scene.start(sceneTranstionData.destinationScene, sceneTranstionData);
        }
      });
    });

    // configure the camera to follow the player
    this.cameras.main.startFollow(this.player!, true, 0.1, 0.1);

  }
  
  /**
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time
   * @param {number} delta - the delta time in ms since the last frame
   * @override
   */
  public update(time: number, delta: number): void
	{
    super.update(time, delta);
    this.player?.update(delta);
  }

}

export default PlayerScene;