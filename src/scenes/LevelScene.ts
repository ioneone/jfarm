import { throttle } from 'throttle-debounce';
import { SceneTransitionData } from './../objects/SceneTransitionObject';
import Weapon from '../objects/Weapon';
import { AudioAsset } from './../assets/AudioAsset';
import { WeaponAsset } from './../assets/WeaponAsset';
import { EnemyAsset, EnemyAssetData } from './../assets/EnemyAsset';
import { PlayerAsset, PlayerAssetData } from './../assets/PlayerAsset';
import Phaser from 'phaser';
import TilemapScene from './TilemapScene';
import Player from '../objects/Player';
import SceneTransitionObject from '~/objects/SceneTransitionObject';
import Enemy from '~/objects/Enemy';

/**
 * ...
 * @class
 * @classdesc
 * ...
 */
class LevelScene extends TilemapScene
{

  public static readonly KEY = "LevelScene";

  // the player to control
  protected player?: Player;

  // the group of enemies in the scene
  protected enemies?: Phaser.GameObjects.Group;

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
   * @param {SceneTransitionData} data - the data being passed when the scene manager starts this scene
   */
  public init(data: any)
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
    this.load.spritesheet(PlayerAsset.ElfMale, PlayerAsset.ElfMale, 
      { frameWidth: PlayerAssetData.FrameWidth, frameHeight: PlayerAssetData.FrameHeight });
    this.load.spritesheet(EnemyAsset.OrcWarrior, EnemyAsset.OrcWarrior, 
      { frameWidth: EnemyAssetData.FrameWidth, frameHeight: EnemyAssetData.FrameHeight });
    this.load.image(WeaponAsset.RegularSword, WeaponAsset.RegularSword);
    this.load.audio(AudioAsset.DamagePlayer, AudioAsset.DamagePlayer);
    this.load.audio(AudioAsset.Swing, AudioAsset.Swing);
    this.load.audio(AudioAsset.DamageEnemy, AudioAsset.DamageEnemy);
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

    this.player = new Player(this, data.destinationXInTiles * 16, data.destinationYInTiles * 16, PlayerAsset.ElfMale, new Weapon(this, WeaponAsset.RegularSword));

    this.enemies = this.add.group();
    this.enemies.add(new Enemy(this, 250, 250, EnemyAsset.OrcWarrior));
    
    // add collision detection between player and collidable layer
    this.physics.add.collider(this.player!, this.middleLayer!);
    this.physics.add.collider(this.player!, this.bottomLayer!);
    
     // add collision detection between enemy and collidable layer
     this.physics.add.collider(this.enemies!, this.middleLayer!);
     this.physics.add.collider(this.enemies!, this.bottomLayer!);
 
     this.physics.add.collider(this.player!, this.enemies!, (object1, object2) => {
       (object2 as Enemy).getBody().setVelocity(0, 0);
     });
 
     this.physics.add.overlap(this.player.getWeapon(), this.enemies, throttle(200, (object1, object2) => {
       const weapon = object1 as Weapon;
       const enemy = object2 as Enemy;
       
       if (weapon.isRotating())
       {
         const knockBack = enemy.getCenter().subtract(weapon.getCenter()).normalize().scale(1000);
         enemy.getBody().setAcceleration(knockBack.x, knockBack.y);
         enemy.receiveDamage(10);
       }
     }));

    this.physics.add.overlap(this.player!, this.transitionObjectGroup!, (object1, object2) => {
      const nextSceneTransitionData = (object2 as SceneTransitionObject).toData();
      this.scene.start(nextSceneTransitionData.destinationScene, nextSceneTransitionData);
    });

    // configure the camera to follow the player
    this.cameras.main.startFollow(this.player!);
  
    // bring top layer to the front
    // Depth is 0 (unsorted) by default, which perform the rendering 
    // in the order it was added to the scene
    this.topLayer?.setDepth(1000);

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
    this.enemies?.getChildren().forEach(child => (child as Enemy).update(this.player!));
  }

  /**
   * File path to the tilemap of this scene. Assume the tilemap file is located 
   * at assets/map/ and the extension is json.
   * @param {SceneTransitionData} data - the data the scene received for initialization
   * @return {string} - tile map file path
   */
  public getTilemapFilePath(data: SceneTransitionData): string
  {
    return "assets/map/" + data.tilemapFileNamePrefix + data.destinationLevel!.toString() + ".json";
  }

  /**
   * File path to the tileset for the tilemap. Assume the tileset file is 
   * located at assets/map/
   * @param {SceneTransitionData} data - the data the scene received for initialization
   * @return {string} - tile set file path
   */
  public getTilesetFilePath(data: SceneTransitionData): string
  {
    return "assets/map/" + data.tilesetFileName;
  }

}

export default LevelScene;