import EventDispatcher from '../dispatchers/EventDispatcher';
import TilemapScene from "./TilemapScene";
import Player from '../objects/Player';
import Enemy from '../objects/Enemy';
import { throttle, debounce } from 'throttle-debounce';

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

  constructor(key: string)
  {
    super(key, "assets/map/map.json", ["assets/tiles.png"]);
  }

  preload()
  {
    super.preload();
    this.load.spritesheet("assets/elf_f.png", "assets/elf_f.png", { frameWidth: 16, frameHeight: 28 });
    this.load.spritesheet("assets/orc_warrior.png", "assets/orc_warrior.png", { frameWidth: 16, frameHeight: 20 });
    this.load.image("assets/weapon_regular_sword.png", "assets/weapon_regular_sword.png");
    this.load.audio("assets/damage_1_karen.wav", "assets/damage_1_karen.wav");
    this.load.audio("assets/swing.wav", "assets/swing.wav");
    this.load.audio("assets/Sound_1.wav", "assets/Sound_1.wav");
  }

  create()
  {
    super.create();

    this.player = new Player(this, 100, 100);

    this.enemies = this.add.group();
    this.enemies.add(new Enemy(this, 200, 100));
    this.enemies.add(new Enemy(this, 200, 200));
    this.enemies.add(new Enemy(this, 300, 300));
    
    // add collision detection between player and collidable layer
    this.physics.add.collider(this.player!, this.middleLayer!);
    this.physics.add.collider(this.player!, this.bottomLayer!);

    // add collision detection between enemy and collidable layer
    this.physics.add.collider(this.enemies!, this.middleLayer!);
    this.physics.add.collider(this.enemies!, this.bottomLayer!);

    this.physics.add.collider(this.player!, this.enemies!, (object1, object2) => {
      (object2 as Enemy).getBody().setVelocity(0, 0);
    });

    this.physics.add.overlap(this.player.weapon, this.enemies, throttle(200, (object1, object2) => {
      const enemy = object2 as Enemy;
      if (this.player?.isAttacking)
      {
        enemy.receiveAttackFromPlayer();
      }
      
    }));

    // configure the camera to follow the player
    this.cameras.main.startFollow(this.player!, true, 1, 1);

    // bring top layer to the front
    // Depth is 0 (unsorted) by default, which perform the rendering 
    // in the order it was added to the scene
    this.topLayer?.setDepth(9999999);
  }

  update()
  {
    super.update();
    
    this.player?.update();
    this.enemies?.getChildren().forEach(child => {
      (child as Enemy).update(this.player!);
    })

  }

  public getPlayerLocation(): Phaser.Math.Vector2
  {
    return new Phaser.Math.Vector2(this.player!.x, this.player!.y);
  }
}

export default GameScene;