import { SceneTransitionData } from './../objects/SceneTransitionObject';
import Weapon from '../objects/Weapon';
import { AudioAsset } from './../assets/AudioAsset';
import { WeaponAsset } from './../assets/WeaponAsset';
import { EnemyAsset, EnemyAssetData } from './../assets/EnemyAsset';
import { PlayerAsset, PlayerAssetData } from './../assets/PlayerAsset';
import Phaser from 'phaser';
import TilemapScene, { TileLayer } from './TilemapScene';
import Player from '../objects/Player';
import SceneTransitionObject from '~/objects/SceneTransitionObject';
import Enemy, { EnemyUpdateState } from '../objects/Enemy';
import OrcWarrior from '~/objects/OrcWarrior';
import IceZombie from '~/objects/IceZombie';
import Chort from '~/objects/Chort';

/**
 * The scene for the dugeon.
 * @class
 * @classdesc
 * A dungeon is a collection of level scenes. Make sure your transition object 
 * exported from Tiled program has all the properties specified in {@link SceneTransitionData}.
 * Then it automatically takes care of loading the next level scene.
 */
class LevelScene extends TilemapScene
{

  // the unique id of this scene
  public static readonly KEY = "LevelScene";

  // the player to control
  protected player?: Player;

  // the group of enemies in the scene
  protected enemies?: Phaser.GameObjects.Group;

  protected bright: boolean;

  constructor()
  {
    super(LevelScene.KEY);
    this.bright = false;
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
    this.load.atlas({
      key: EnemyAsset.OrcWarrior,
      textureURL: 'assets/enemies/' + EnemyAsset.OrcWarrior + '/' + EnemyAsset.OrcWarrior + '.png',
      normalMap: 'assets/enemies/' + EnemyAsset.OrcWarrior + '/' + EnemyAsset.OrcWarrior + '_n.png',
      atlasURL: 'assets/enemies/' + EnemyAsset.OrcWarrior + '/' + EnemyAsset.OrcWarrior + '.json'
    });
    this.load.atlas({
      key: EnemyAsset.IceZombie,
      textureURL: 'assets/enemies/' + EnemyAsset.IceZombie + '/' + EnemyAsset.IceZombie + '.png',
      normalMap: 'assets/enemies/' + EnemyAsset.IceZombie + '/' + EnemyAsset.IceZombie + '_n.png',
      atlasURL: 'assets/enemies/' + EnemyAsset.IceZombie + '/' + EnemyAsset.IceZombie + '.json'
    });
    this.load.atlas({
      key: EnemyAsset.Chort,
      textureURL: 'assets/enemies/' + EnemyAsset.Chort + '/' + EnemyAsset.Chort + '.png',
      normalMap: 'assets/enemies/' + EnemyAsset.Chort + '/' + EnemyAsset.Chort + '_n.png',
      atlasURL: 'assets/enemies/' + EnemyAsset.Chort + '/' + EnemyAsset.Chort + '.json'
    });
    this.load.image(WeaponAsset.RegularSword, WeaponAsset.RegularSword);
    this.load.audio(AudioAsset.DamagePlayer, AudioAsset.DamagePlayer);
    this.load.audio(AudioAsset.Swing, AudioAsset.Swing);
    this.load.audio(AudioAsset.ThreeFootSteps, AudioAsset.ThreeFootSteps);
    this.load.audio("assets/audio/hit_enemy.wav", "assets/audio/hit_enemy.wav");
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

    // add player to the scene
    this.player = new Player(this, data.destinationXInTiles * 16, data.destinationYInTiles * 16, PlayerAsset.ElfMale);

    // add enemies to the scene
    this.enemies = this.add.group();
    this.tilemap?.getObjectLayer(TileLayer.Object).objects.forEach(object => {
      if (object.name === "OrcWarrior")
      {
        this.enemies?.add(new OrcWarrior(this, object.x!, object.y!));
      }
      else if (object.name === "IceZombie")
      {
        this.enemies?.add(new IceZombie(this, object.x!, object.y!));
      }
      else if (object.name === "Chort")
      {
        this.enemies?.add(new Chort(this, object.x!, object.y!));
      }
    });

    // add collision detection between player and collidable layer
    this.physics.add.collider(this.player!, this.middleLayer!);
    this.physics.add.collider(this.player!, this.bottomLayer!);
    
    // add collision detection between enemy and collidable layer
    this.physics.add.collider(this.enemies!, this.middleLayer!);
    this.physics.add.collider(this.enemies!, this.bottomLayer!);
 
    // add collision detection between player and enemy
    this.physics.add.collider(this.player!, this.enemies!, (_, object2) => {
      const enemy = object2 as Enemy;
      enemy.setUpdateState(EnemyUpdateState.AttackPlayer);
      // prevent enemy from pushing the player
      enemy.getBody().setVelocity(0, 0);
    });

    // add overlap detection between player attack and enemy
    this.physics.add.overlap(this.player.getWeapon(), this.enemies, (object1, object2) => {
      const weapon = object1 as Weapon;
      const enemy = object2 as Enemy;
      const knockBackVelocity = enemy.getCenter().subtract(weapon.getCenter()).normalize().scale(200);
      enemy.knockBack(knockBackVelocity);
      enemy.receiveDamage(10);
      this.sound.play("assets/audio/hit_enemy.wav");
      this.cameras.main.shake(100, 0.001);
    }, (object1, object2) => {
      const weapon = object1 as Weapon;
      const enemy = object2 as Enemy;
      return weapon.getBody().angularVelocity !== 0 && enemy.getUpdateState() !== EnemyUpdateState.KnockBack;
    });

    // add overlap detection between player and transition objects
    this.physics.add.overlap(this.player!, this.transitionObjectGroup!, (object1, object2) => {
      const player = object1 as Player;
      player.getBody().setEnable(false);
      const nextSceneTransitionData = (object2 as SceneTransitionObject).toData();
      this.sound.play(AudioAsset.ThreeFootSteps);
      this.cameras.main.fadeOut(200, 0, 0, 0, (_, progress) => {
        if (progress === 1)
        {
          this.scene.start(nextSceneTransitionData.destinationScene, nextSceneTransitionData);
        }
      });
    });

    // configure the camera to follow the player
    this.cameras.main.startFollow(this.player!, true, 0.1, 0.1);
    
    // Bring top layer to the front.
    // Depth is 0 (unsorted) by default, which perform the rendering 
    // in the order it was added to the scene.
    this.topLayer?.setDepth(1);

    // lights
    this.light = this.lights.addLight(0, 0, 150);

    this.lights.enable().setAmbientColor(0x000000);

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
    this.enemies?.getChildren().forEach(child => (child as Enemy).update(this.player!, delta));
    this.light.x = this.player?.x;
    this.light.y = this.player.y;
  }

  /**
   * File path to the tilemap of this scene. Assume the tilemap file is located 
   * at `assets/map/` and the extension is json.
   * @param {SceneTransitionData} data - the data the scene received for initialization
   * @return {string} - tile map file path
   */
  public getTilemapFilePath(data: SceneTransitionData): string
  {
    return "assets/map/" + data.tilemapFileNamePrefix + data.destinationLevel!.toString() + ".json";
  }

  /**
   * File path to the tileset for the tilemap. Assume the tileset file is 
   * located at `assets/map/`
   * @param {SceneTransitionData} data - the data the scene received for initialization
   * @return {string} - tile set file path
   */
  public getTilesetFilePath(data: SceneTransitionData): string
  {
    return "assets/map/" + data.tilesetFileName + ".png";
  }

  public getTilesetNormalMapFilePath(data: SceneTransitionData): string
  {
    return "assets/map/" + data.tilesetFileName + "_n.png";
  }

  protected toggleDebugMode(): void
  {
    super.toggleDebugMode();

    if (this.bright)
    {
      this.enemies?.getChildren().forEach(child => {
        (child as Enemy).setPipeline('Light2D');
      });
      this.bottomLayer?.setPipeline('Light2D');
      this.middleLayer?.setPipeline('Light2D');
      this.topLayer?.setPipeline('Light2D');
    }
    else
    {
      this.enemies?.getChildren().forEach(child => {
        (child as Enemy).resetPipeline();
      });
      this.bottomLayer?.resetPipeline();
      this.middleLayer?.resetPipeline();
      this.topLayer?.resetPipeline();
    }

    this.bright = !this.bright;
    
  }

}

export default LevelScene;