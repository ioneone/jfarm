import { AudioAsset } from '../assets/AudioAsset';
import { SceneTransitionData } from '../objects/SceneTransitionObject';
import PlayerScene from "./PlayerScene";
import { TileLayer } from './TilemapScene';
import EnemyFactory from '../factory/EnemyFactory';
import Enemy, { EnemyState } from '../objects/Enemy';
import Weapon from '../objects/Weapon';

/**
 * A scene with enemies in it.
 * @class
 * @classdesc
 * This class is responsible for creating enemies and logics for player attacking 
 * them. Any scene with enemies should inherit from this class.
 */
abstract class CombatScene extends PlayerScene
{

  // the unique id of this scene
  public static readonly KEY = "CombatScene";

  // light enabled objects need at least one light source to exibit ambient color
  protected sceneLight?: Phaser.GameObjects.Light;

  // the group of enemies in the scene
  protected enemies?: Phaser.GameObjects.Group;

  /**
   * This is called only once when you start the game. Every time a scene is 
   * created using methods like `scene.start()`, `constructor()` will not be 
   * called (`init()` will still be called though).
   * @param {string} key - the unique id of the scene
   */
  constructor(key: string)
  {
    super(CombatScene.KEY);
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
  public init(data: SceneTransitionData)
  {
    super.init(data);  
  }
 
  /**
   * Scenes can have a preload method, which is always called before the Scenes 
   * create method, allowing you to preload assets that the Scene may need.
   * @override
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
   * @override
   */
  public create(data: SceneTransitionData)
  {
    super.create(data);

    // add enemies to the scene
    this.enemies = this.add.group();
    this.tilemap?.getObjectLayer(TileLayer.Object).objects.forEach(tiledObject => {
      this.enemies?.add(EnemyFactory.create(this, tiledObject));
    });
    
    // add collision detection between enemy and collidable layer
    this.physics.add.collider(this.enemies!, this.middleLayer!);
    this.physics.add.collider(this.enemies!, this.bottomLayer!);
 
    // add collision detection between player and enemy
    this.physics.add.collider(this.player!, this.enemies!, (_, object2) => {
      const enemy = object2 as Enemy;
      enemy.setCurrentState(EnemyState.AttackPlayer);
      // prevent enemy from pushing the player
      enemy.getBody().setVelocity(0, 0);
    });

    // add overlap detection between player attack and enemy
    this.physics.add.overlap(this.player!.getWeapon(), this.enemies, (object1, object2) => {
      const weapon = object1 as Weapon;
      const enemy = object2 as Enemy;
      const knockBackVelocity = enemy.getCenter().subtract(weapon.getCenter()).normalize().scale(200);
      enemy.knockBack(knockBackVelocity);
      enemy.receiveDamage(weapon.getModel().power);
      this.sound.play(AudioAsset.EnemyHit);
      this.cameras.main.shake(100, 0.002);
    }, (object1, object2) => {
      const weapon = object1 as Weapon;
      const enemy = object2 as Enemy;
      return weapon.getBody().angularVelocity !== 0 && enemy.getCurrentState() !== EnemyState.KnockBack;
    });

    // enable lights
    this.bottomLayer!.setPipeline('Light2D');
    this.middleLayer!.setPipeline('Light2D');
    this.topLayer!.setPipeline('Light2D');
    this.enemies.getChildren().forEach(child => (child as Enemy).setPipeline('Light2D'));
    this.sceneLight = this.lights.addLight();
    this.lights.enable().setAmbientColor(0x404040);

  }

  /**
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time
   * @param {number} delta - the delta time in ms since the last frame
   * @override
   */
  public update(time: number, delta: number)
  {
    super.update(time, delta);

    // configure the scene light to follow the player
    this.sceneLight?.setPosition(this.player!.x, this.player!.y);

    this.enemies?.getChildren().forEach(child => (child as Enemy).update(this.player!, delta));
  }
  
  /**
   * The graphics shows useful information for debugging when the debug mode 
   * is turned on.
   * @override
   */
  protected toggleDebugMode(): void
  {
    super.toggleDebugMode();

    if (this.physics.world.debugGraphic.visible)
    {
      this.bottomLayer?.resetPipeline();
      this.middleLayer?.resetPipeline();
      this.topLayer?.resetPipeline();

      this.enemies?.getChildren().forEach(child => {
        (child as Enemy).resetPipeline();
      });
    }
    else
    {
      this.bottomLayer?.setPipeline('Light2D');
      this.middleLayer?.setPipeline('Light2D');
      this.topLayer?.setPipeline('Light2D');

      this.enemies?.getChildren().forEach(child => {
        (child as Enemy).setPipeline('Light2D');
      });
    }    
  }

}

export default CombatScene;