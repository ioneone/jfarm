import { AudioAsset } from './../assets/AudioAsset';
import { SceneTransitionData } from '../objects/SceneTransitionObject';
import Weapon from '../objects/Weapon';
import { WeaponAsset } from '../assets/WeaponAsset';
import { EnemyAsset } from '../assets/EnemyAsset';
import { PlayerAsset } from '../assets/PlayerAsset';
import Phaser from 'phaser';
import TilemapScene, { TileLayer } from './TilemapScene';
import Player from '../objects/Player';
import SceneTransitionObject from '../objects/SceneTransitionObject';
import Enemy, { EnemyUpdateState } from '../objects/Enemy';
import PlayerFactory from '../factory/PlayerFactory';
import EnemyFactory from '../factory/EnemyFactory';
import Connection from '../socket/Connection';

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

  // other players
  protected players: {[key: string]: Player};

  // the group of enemies in the scene
  protected enemies?: Phaser.GameObjects.Group;

  protected bright: boolean;

  constructor()
  {
    super(LevelScene.KEY);
    this.bright = false;
    this.players = {};
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
    this.bright = false;
    this.players = {};
  }
 
  /**
   * Scenes can have a preload method, which is always called before the Scenes 
   * create method, allowing you to preload assets that the Scene may need.
   */
  public preload()
  {
    super.preload();
    this.load.atlas(PlayerAsset.ElfFemale);
    this.load.atlas(PlayerAsset.ElfMale);
    this.load.atlas(this.createDefaultAtlasJSONFileConfig(EnemyAsset.OrcWarrior));
    this.load.atlas(this.createDefaultAtlasJSONFileConfig(EnemyAsset.IceZombie));
    this.load.atlas(this.createDefaultAtlasJSONFileConfig(EnemyAsset.Chort));
    this.load.image(WeaponAsset.RegularSword);
    this.load.image(WeaponAsset.Axe);
    this.load.image(WeaponAsset.Hammer);
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.DamagePlayer));
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.Swing));
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.ThreeFootSteps));
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.EnemyHit));
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
    // this.player = PlayerFactory.create(this, 
    //   data.destinationXInTiles * 16, data.destinationYInTiles * 16, 
    //   PlayerAsset.ElfMale);

    // add enemies to the scene
    this.enemies = this.add.group();
    this.tilemap?.getObjectLayer(TileLayer.Object).objects.forEach(object => {
      if (object.name === "OrcWarrior")
      {
        this.enemies?.add(EnemyFactory.create(this, object.x!, object.y!, EnemyAsset.OrcWarrior));
      }
      else if (object.name === "IceZombie")
      {
        this.enemies?.add(EnemyFactory.create(this, object.x!, object.y!, EnemyAsset.IceZombie));
      }
      else if (object.name === "Chort")
      {
        this.enemies?.add(EnemyFactory.create(this, object.x!, object.y!, EnemyAsset.Chort));
      }
    });

    // add collision detection between enemy and collidable layer
    this.physics.add.collider(this.enemies!, this.middleLayer!);
    this.physics.add.collider(this.enemies!, this.bottomLayer!);
 
    // Bring top layer to the front.
    // Depth is 0 (unsorted) by default, which perform the rendering 
    // in the order it was added to the scene.
    this.topLayer?.setDepth(1);

    // @ts-ignore
    this.light = this.lights.addLight(0, 0, 150);

    this.lights.enable().setAmbientColor(0x404040);

    Connection.getInstance().socket.on('CurrentPlayers', (players) => {
      console.log(players);

      Object.keys(players).forEach((id) => {
        
        if (Connection.getInstance().socket.id === id)
        {
          console.log('player created');
          this.player = PlayerFactory.create(this, 
            players[id].x, players[id].y, PlayerAsset.ElfMale);

          // add collision detection between player and collidable layer
          this.physics.add.collider(this.player!, this.middleLayer!);
          this.physics.add.collider(this.player!, this.bottomLayer!);

          // add overlap detection between player attack and enemy
          this.physics.add.overlap(this.player.getWeapon(), this.enemies!, (object1, object2) => {
            const weapon = object1 as Weapon;
            const enemy = object2 as Enemy;
            const knockBackVelocity = enemy.getCenter().subtract(weapon.getCenter()).normalize().scale(200);
            enemy.knockBack(knockBackVelocity);
            enemy.receiveDamage(weapon.getModel().power);
            this.sound.play(AudioAsset.EnemyHit);
            this.cameras.main.shake(100, 0.001);
          }, (object1, object2) => {
            const weapon = object1 as Weapon;
            const enemy = object2 as Enemy;
            return weapon.getBody().angularVelocity !== 0 && enemy.getUpdateState() !== EnemyUpdateState.KnockBack;
          });

          // add collision detection between player and enemy
          this.physics.add.collider(this.player!, this.enemies!, (_, object2) => {
            const enemy = object2 as Enemy;
            enemy.setUpdateState(EnemyUpdateState.AttackPlayer);
            // prevent enemy from pushing the player
            enemy.getBody().setVelocity(0, 0);
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
          this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        }
        else
        {
          this.players[id] = PlayerFactory.create(this, 
            players[id].x, players[id].y, PlayerAsset.ElfMale);
        }
      })
    });

    Connection.getInstance().socket.on('NewPlayer', (player) => {
      this.players[player.id] = PlayerFactory.create(this, 
        player.x, player.y, PlayerAsset.ElfMale);
    });

    Connection.getInstance().socket.on('PlayerMoved', (player) => {
      this.players[player.id].getBody().setVelocity(player.velocityX, player.velocityY);
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
    this.player?.update();
    this.enemies?.getChildren().forEach(child => (child as Enemy).update(this.player!, delta));
    //@ts-ignore
    this.light.x = this.player?.x;
    //@ts-ignore
    this.light.y = this.player?.y;

    Object.values(this.players).forEach(player => player.update());
  }

  /**
   * Get the unique key of the tile map. The `key` of a tile map is just its 
   * file path excluding the extension. If your tile map is located at 
   * `path/to/tile/map/foo.json`, then the key should be `path/to/tile/map/foo`.
   * @override
   * @param {SceneTransitionData} data - the data the scene received for initialization
   * @return {string} - the tile map key
   */
  public getTilemapKey(data: SceneTransitionData): string
  {
    return "assets/map/" + data.tilemapFileNamePrefix + data.destinationLevel!.toString();
  }

  /**
   * Get the unique key of the tile set. The `key` of a tile set is just its 
   * file path excluding the extension. If your tile set is located at 
   * `path/to/tile/set/foo.png`, then the key should be `path/to/tile/set/foo`.
   * @override
   * @param {SceneTransitionData} data - the data the scene received for initialization
   * @return {string} - the tile set key
   */
  public getTilesetKey(data: SceneTransitionData): string
  {
    return "assets/map/" + data.tilesetFileName;
  }
  
  /**
   * The graphics shows useful information for debugging when the debug mode 
   * is turned on.
   * @override
   */
  protected toggleDebugMode(): void
  {
    super.toggleDebugMode();

    // turn off the light
    if (this.bright)
    {
      this.enemies?.getChildren().forEach(child => {
        (child as Enemy).setPipeline('Light2D');
      });
      this.bottomLayer?.setPipeline('Light2D');
      this.middleLayer?.setPipeline('Light2D');
      this.topLayer?.setPipeline('Light2D');
    }
    // turn on the light
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