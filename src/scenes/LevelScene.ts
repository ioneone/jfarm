import { DamageEventData } from './../events/Event';
import EventDispatcher from '../events/EventDispatcher';
import { throttle } from 'throttle-debounce';
import { SceneTransitionObjectData, LevelSceneModel } from './../objects/SceneTransitionObject';
import Weapon from '../objects/Weapon';
import { AudioAsset } from './../assets/AudioAsset';
import { WeaponAsset } from './../assets/WeaponAsset';
import { EnemyAsset, EnemyAssetData } from './../assets/EnemyAsset';
import { PlayerAsset, PlayerAssetData } from './../assets/PlayerAsset';
import Phaser from 'phaser';
import TilemapScene, { TiledTransitionObject } from './TilemapScene';
import Player from '../objects/Player';
import SceneTransitionObject from '~/objects/SceneTransitionObject';
import Enemy from '~/objects/Enemy';
import { Event } from '~/events/Event';

class LevelScene extends TilemapScene
{

  private model?: LevelSceneModel; 

  private player?: Player;

  protected enemies?: Phaser.GameObjects.Group;

  constructor()
  {
    super("LevelScene");
  }

  public init(model: LevelSceneModel)
  {
    this.model = model;    
  }
 
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
    this.load.bitmapFont('PressStart2P', 'assets/font/font.png', 'assets/font/font.fnt');
  }

  public create()
  {
    super.create();

    this.player = new Player(this, this.model!.destinationXInTiles * 16, this.model!.destinationYInTiles * 16, PlayerAsset.ElfMale, new Weapon(this, WeaponAsset.RegularSword));

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
       const enemy = object2 as Enemy;
       const weapon = object1 as Weapon;
       
       if (weapon.isRotating())
       {
         const knockBack = enemy.getCenter().subtract(weapon.getCenter()).normalize().scale(1000);
         enemy.getBody().setAcceleration(knockBack.x, knockBack.y);
         enemy.receiveDamage(10);
       }
     }));

    this.physics.add.overlap(this.player!, this.transitionObjectGroup!, (object1, object2) => {
      const sceneTransitionObject = object2 as SceneTransitionObject;
      const model = sceneTransitionObject.createSceneDataModel();
      this.scene.start(model.destinationScene, model);
    });

    // configure the camera to follow the player
    this.cameras.main.startFollow(this.player!, true);
  
    // bring top layer to the front
    // Depth is 0 (unsorted) by default, which perform the rendering 
    // in the order it was added to the scene
    this.topLayer?.setDepth(1000);

    EventDispatcher.getInstance().on(Event.Damage, this.handleDamageEvent, this);

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      EventDispatcher.getInstance().off(Event.Damage, this.handleDamageEvent, this);
    });

  }

  public update(time, delta)
  {
    super.update(time, delta);
    this.player?.update();
    this.enemies?.getChildren().forEach(child => {
      (child as Enemy).update(this.player!);
    });

  }

  private handleDamageEvent(data: DamageEventData)
  {
    const damageText = this.add.bitmapText(data.x, data.y, 'PressStart2P', data.damage.toString(), 6);
    if (data.color)
    {
      damageText.setTint(data.color);
    }
    
    this.tweens.add({
      targets: damageText,
      ease: 'Linear',
      x: (Math.random() - 0.5 > 0 ? '+=' : '-=' ) + (7 * Math.random() + 1).toString(),
      y: '-=' + (7 * Math.random() + 1).toString(),
      alpha: 0,
      duration: 500,
      onComplete: () => {
        damageText.destroy();
      }
    });
  }

  /**
   * File path to the tilemap of this scene.
   * Assume the tilemap file is located at assets/map/ and the extension is json.
   * @return {string} - tile map file path
   */
  public getTilemapFilePath(): string
  {
    return "assets/map/" + this.model?.tilemapFileNamePrefix + this.model?.destinationLevel!.toString() + ".json";
  }

  /**
   * File path to the tileset for the tilemap.
   * Assume the tileset file is located at assets/map/
   * @return {string} - tile set file path
   */
  public getTilesetFilePath(): string
  {
    return "assets/map/" + this.model?.tilesetFileName;
  }

  public parseTransitionObject(tiledTransitionObject: TiledTransitionObject): SceneTransitionObject
  {
    return new SceneTransitionObject(this, tiledTransitionObject);
  }

}

export default LevelScene;