import Player from '../objects/Player';
import BaseScene from "./BaseScene";
import PlayerFactory from '../factory/PlayerFactory';
import Assets from '../assets/Assets';
import PlayerScene from './PlayerScene';
import TilemapScene from './TilemapScene';

class PlatformerScene extends PlayerScene
{

  public static readonly KEY = 'PlatformerScene';


  private emitter1: Phaser.GameObjects.Particles.ParticleEmitter;
  private emitter2: Phaser.GameObjects.Particles.ParticleEmitter;
  private emitter3: Phaser.GameObjects.Particles.ParticleEmitter;

  /**
   * This is called only once when you start the game. Every time a scene is 
   * created using methods like `scene.start()`, `constructor()` will not be 
   * called (`init()` will still be called though).
   * @param {string} key - the unique id of the scene
   */
	constructor(key: string)
	{
    super(PlatformerScene.KEY);
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
  }

  /**
   * Scenes can have a preload method, which is always called before the Scenes 
   * create method, allowing you to preload assets that the Scene may need.
   */
  public preload()
  {
    super.preload();
    this.load.image('assets/lights/circle');
    this.load.image('assets/lights/black');
    this.load.image('assets/particles/square');
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

    // enable lights
    // this.bottomLayer!.setPipeline('Light2D');
    // this.middleLayer!.setPipeline('Light2D');
    // this.topLayer!.setPipeline('Light2D');
    // this.sceneLight = this.lights.addLight().setIntensity(1).setRadius(300);
    // this.lights.enable().setAmbientColor(0x606060);
    // this.backgroundLayers?.forEach(layer => layer.setPipeline('Light2D'));
    
    // this.player?.setDepth(1);

    this.emitter1 = this.add.particles('assets/particles/square').createEmitter({
      tint: 0x3d734f,
      alpha: { min: 0, max: 1 },
      speedX: { min: -64, max: 64 },
      speedY: { min: 16, max: 32 },
      blendMode: 'ADD',
      lifespan: 24000,
      frequency: 3600,
      x: this.tilemap?.widthInPixels / 4,
      y: -60
    });

    this.emitter2 = this.add.particles('assets/particles/square').createEmitter({
      tint: 0x3d734f,
      alpha: { min: 0, max: 1 },
      speedY: { min: 16, max: 64 },
      speedX: { min: -64, max: 64 },
      blendMode: 'ADD',
      lifespan: 24000,
      frequency: 4000,
      x: this.tilemap?.widthInPixels / 2,
      y: -60
    });

    this.emitter3 = this.add.particles('assets/particles/square').createEmitter({
      tint: 0x3d734f,
      alpha: { min: 0, max: 1 },
      speedY: { min: 16, max: 64 },
      speedX: { min: -64, max: 64 },
      blendMode: 'ADD',
      lifespan: 24000,
      frequency: 4400,
      x: 3 * this.tilemap?.widthInPixels / 4,
      y: -60
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

    // configure the scene light to follow the player
    // this.sceneLight?.setPosition(this.player!.x, this.player!.y);
    // this.fakeLight?.setPosition(this.player?.x, this.player.y);
  }


}

export default PlatformerScene;