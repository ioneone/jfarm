import { TileLayer } from './PlatformScene';
import PlayerScene from "./PlayerScene";
import EventDispatcher from '~/events/EventDispatcher';

/**
 * The scene with forest background.
 * @class
 * @classdesc
 * This scene has lighting and enemies enabled.
 */
class ForestScene extends PlayerScene
{

  public static readonly KEY = 'ForestScene';

  private sceneLight?: Phaser.GameObjects.Light;

  private grassGroup?: Phaser.GameObjects.Group;

  /**
   * This is called only once when you start the game. Every time a scene is 
   * created using methods like `scene.start()`, `constructor()` will not be 
   * called (`init()` will still be called though).
   */
  constructor()
  {
    super(ForestScene.KEY);
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
    this.load.image('assets/particles/square');
    this.load.image(this.createDefaultImageFileConfig('assets/grass/grass'));
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

    // enable lights
    this.backgroundLayers[9].setPipeline('Light2D');
    this.bottomLayer!.setPipeline('Light2D');
    this.middleLayer!.setPipeline('Light2D');
    this.topLayer!.setPipeline('Light2D');

    this.lights.enable().setAmbientColor(0x404040);
    this.sceneLight = this.lights.addLight().setIntensity(1).setRadius(300);

    // create grass from ObjectLayer
    this.grassGroup = this.physics.add.staticGroup();
    this.tilemap?.getObjectLayer(TileLayer.Object).objects.forEach(object => {
      if (object.name === 'Grass')
      {
        this.grassGroup?.add(
          this.add.sprite(object.x, object.y, 'assets/grass/grass')
            .setOrigin(0.5, 1)
            .setPipeline('Light2D')
          );
      }
    });

    // add overlap detection between the player and grass
    this.physics.add.overlap(this.player, this.grassGroup, (object1, object2) => {
      const player = object1 as Player;
      const grass = object2 as Phaser.GameObjects.Sprite;

      if (player.body.velocity.x === 0 && player.body.velocity.y === 0) return;

      const originalGrassX = grass.x;
      
      if (!grass.isTweening)
      {
        grass.isTweening = true;
        this.tweens.add({
          targets: grass,
          duration: 60,
          x: '+=2',
          onComplete: () => {
            grass.isTweening = false;
            grass.x = originalGrassX;
          },
          yoyo: true
        });
        EventDispatcher.getInstance().emit("grass"); 
      }
      
    });

    // create particles
    const emitterConfig = {
      tint: [0x3d734f, 0x4ba747, 0x97da3f], // greens
      alpha: { min: 0, max: 1 },
      speedX: { min: -64, max: 64 },
      speedY: { min: 16, max: 32 },
      blendMode: 'ADD',
      lifespan: 100000,
      frequency: 3600,
      deathZone: {
        type: 'onLeave',
        source: this.cameras.main
      }
    };

    this.add.particles('assets/particles/square')
      .createEmitter(emitterConfig)
      .setPosition(this.tilemap?.widthInPixels / 4, 0);

    this.add.particles('assets/particles/square')
      .createEmitter(emitterConfig)
      .setPosition(this.tilemap?.widthInPixels / 2, 0);
    
    this.add.particles('assets/particles/square')
      .createEmitter(emitterConfig)
      .setPosition(3 * this.tilemap?.widthInPixels / 4, 0);

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

    this.sceneLight?.setPosition(this.player!.x, this.player!.y);
  }

  /**
   * The graphics shows useful information for debugging when the debug mode 
   * is turned on. In `update()`, it checks whether a debug key (assigned in 
   * {@link BaseScene}) is pressed, and if it is, call this function.
   * @override
   */
  protected toggleDebugMode(): void
  {
    super.toggleDebugMode();

    if (this.physics.world.debugGraphic.visible)
    {
      this.backgroundLayers[9].resetPipeline();
      this.bottomLayer!.resetPipeline();
      this.middleLayer!.resetPipeline();
      this.topLayer!.resetPipeline();
    }
    else
    {
      this.backgroundLayers[9].setPipeline('Light2D');
      this.bottomLayer!.setPipeline('Light2D');
      this.middleLayer!.setPipeline('Light2D');
      this.topLayer!.setPipeline('Light2D');
    }

  }
}

export default ForestScene;