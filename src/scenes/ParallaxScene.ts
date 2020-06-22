import BaseScene from "./BaseScene";

/**
 * Responsible for rendering parallax background.
 * @class
 * @classdesc
 * Parent class for {@link PlatformScene} to take care of parallax
 * background rendering. Parallax background gives the player the illusion of 
 * depths by moving foreground faster than background.
 * @see {@link https://www.youtube.com/watch?v=pknZUn82x2U}
 */
class ParallaxScene extends BaseScene
{

  // index i has background layer with depth i
  protected backgroundLayers: Phaser.GameObjects.TileSprite[];

  /**
   * This is called only once when you start the game. Every time a scene is 
   * created using methods like `scene.start()`, `constructor()` will not be 
   * called (`init()` will still be called though).
   * @param {string} key - the unique id of the scene
   */
	constructor(key: string)
	{
    super(key);
    this.backgroundLayers = [];
  }

  /**
   * Scenes can have a init method, which is always called before the Scenes
   * preload method, allowing you to initialize data that the Scene may need.
   * 
   * The data is passed when the scene is started/launched by the scene manager.
   * 
   * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
   * @param {any} data - the data being passed when the scene manager starts this scene
   * @override
   */
  public init(data: any): void
  {
    super.init(data);
    this.backgroundLayers = [];
  }

  /**
   * Scenes can have a preload method, which is always called before the Scenes 
   * create method, allowing you to preload assets that the Scene may need.
   */
  public preload()
  {
    super.preload();

    // TODO: 10 should come from `data`.
    for (let i = 0; i <= 10; i++)
    {
      if (i === 9)
      {
        this.load.image(this.createDefaultImageFileConfig('assets/backgrounds/forest/depth_' + i));
        continue;
      }
      
      this.load.image('assets/backgrounds/forest/depth_' + i);
    }
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

    for (let i = 0; i <= 10; i++)
    {
      const asset = 'assets/backgrounds/forest/depth_' + i;
      this.backgroundLayers.push(
        this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, asset)
          .setOrigin(0, 0)
          .setScrollFactor(0)
      );
    }
  }

  /**
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time
   * @param {number} delta - the delta time in ms since the last frame
   */
  public update(time: number, delta: number)
  {
    super.update(time, delta);

    // background with higher depth scrolls faster
    for (let i = 0; i < this.backgroundLayers.length; i++)
    {
      this.backgroundLayers[i].tilePositionX = i * this.cameras.main.scrollX / Math.max(1, (this.backgroundLayers.length - 1));
    }
  }
}

export default ParallaxScene;