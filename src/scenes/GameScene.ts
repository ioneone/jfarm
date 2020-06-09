import { AudioAsset } from './../assets/AudioAsset';
import { WeaponAsset } from '../assets/WeaponAsset';
import { EnemyAsset, EnemyAssetData } from '../assets/EnemyAsset';
import { PlayerAsset, PlayerAssetData } from '../assets/PlayerAsset';
import TilemapScene, { TiledTransitionObject } from "./TilemapScene";
import Player from '../objects/Player';
import Enemy from '../objects/Enemy';
import { throttle } from 'throttle-debounce';
import Weapon from '~/objects/Weapon';
import SceneTransitionObject from '~/objects/SceneTransitionObject';

/**
 * GameScene is responsible for handling logics 
 * common to all the scene such as player rendering,
 * player collision, transition detections, and depth
 * sorting.
 */
class GameScene extends TilemapScene
{

  protected player?: Player;

  protected enemies?: Phaser.GameObjects.Group;

  constructor()
  {
    super("GameScene");
  }

  public preload(): void
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

  public create(): void
  {
    super.create();

    this.player = new Player(this, 150, 250, PlayerAsset.ElfMale, new Weapon(this, WeaponAsset.RegularSword));

    this.enemies = this.add.group();
    this.enemies.add(new Enemy(this, 250, 250, EnemyAsset.OrcWarrior));
    // this.enemies.add(new Enemy(this, 200, 200, EnemyAsset.OrcWarrior));
    // this.enemies.add(new Enemy(this, 300, 300, EnemyAsset.OrcWarrior));
    
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
      const enemy = object2 as Enemy;
      if (this.player?.isAttacking())
      {
        enemy.receiveDamage(10);
      }
    }));

    // configure the camera to follow the player
    // this.cameras.main.startFollow(this.player!, true);
    this.cameras.main.setRoundPixels(true);

    // bring top layer to the front
    // Depth is 0 (unsorted) by default, which perform the rendering 
    // in the order it was added to the scene
    this.topLayer?.setDepth(9999999);
  }

  public update(): void
  {
    super.update();
    
    this.player?.update();
    this.enemies?.getChildren().forEach(child => {
      (child as Enemy).update(this.player!);
    });

  }

  public getPlayerLocation(): Phaser.Math.Vector2
  {
    return new Phaser.Math.Vector2(this.player!.x, this.player!.y);
  }

  /**
   * file path to the tilemap of this scene
   * @return {string} - tile map file path
   */
  public getTilemapFilePath(): string
  {
    return "assets/map/level1.json";
  }

  /**
   * file path to the tileset for the tilemap
   * @return {string} - tile set file path
   */
  public getTilesetFilePath(): string
  {
    return "assets/map/tiles.png";
  }

  public parseTransitionObject(tiledTransitionObject: TiledTransitionObject): SceneTransitionObject
  {
    return new SceneTransitionObject(this, tiledTransitionObject);
  }
}

export default GameScene;