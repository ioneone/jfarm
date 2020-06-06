import { throttle } from 'throttle-debounce';
import Phaser from 'phaser';
import GameScene from '../scenes/GameScene';
import EventDispatcher from '~/dispatchers/EventDispatcher';
import Player from './Player';

class Enemy extends Phaser.GameObjects.Sprite
{

  private static readonly SPEED = 32;

  private hp: number;
  private maxHp: number;

  constructor(scene: Phaser.Scene, x: number, y: number)
  {
    super(scene, x, y, "assets/orc_warrior.png");
    
    // add enemy to the scene
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);

    // register animations
    this.scene.anims.create({
      key: "assets/orc_warrior.png:idle",
      frames: this.scene.anims.generateFrameNames("assets/orc_warrior.png", { start: 0, end: 3 }),
      frameRate: 8
    });

    this.scene.anims.create({
      key: "assets/orc_warrior.png:run",
      frames: this.scene.anims.generateFrameNames("assets/orc_warrior.png", { start: 4, end: 7 }),
      frameRate: 8
    });

    // prevent player from pushing the enemy
    this.getBody().setImmovable(true);

    this.hp = 100;
    this.maxHp = 100;

  }

  public receiveAttackFromPlayer()
  {
    this.hp -= 10;
    if (this.hp <= 0)
    {
      this.destroy();
    } 
  }

  public update(player: Player)
  {

    const distanceToPlayer = this.getCenter().distance(player.getCenter());

    if (32 < distanceToPlayer && distanceToPlayer < 64)
    {
      // this.chasePlayer(player.getCenter());
    }
    else if (distanceToPlayer >= 64)
    {
      // this.moveRandomly();
    }

    if (this.getBody().velocity.x === 0 && this.getBody().velocity.y === 0)
    {
      this.anims.play("assets/orc_warrior.png:idle", true);
      this.getBody().setImmovable(true);
    }
    else
    {
      this.anims.play("assets/orc_warrior.png:run", true);
      this.getBody().setImmovable(false);
    }

    if (this.getBody().velocity.x > 0)
    {
      this.setFlipX(false);
    }
    else if (this.getBody().velocity.x < 0)
    {
      this.setFlipX(true);
    }

  }

  private chasePlayer(playerLocation: Phaser.Math.Vector2)
  {
    const distanceToPlayer = this.getCenter().distance(playerLocation);
    if (1 < distanceToPlayer && distanceToPlayer < 64) {
      this.getBody().setVelocity(playerLocation.x - this.x, playerLocation.y - this.y);
      this.getBody().velocity.normalize().scale(Enemy.SPEED); 
    }
    else
    {
      this.getBody().setVelocity(0, 0);
    }
  }

  private moveRandomly()
  {
    const takeActionProbability = 0.01;
    const shouldTakeAction = Math.random() < takeActionProbability;
    
    if (shouldTakeAction)
    {
      // idle
      if (this.getBody().velocity.x === 0 && this.getBody().velocity.y === 0)
      {
        const choice = Math.random();

        // move up
        if (choice < 0.25)
        {
          this.getBody().setVelocity(0, -Enemy.SPEED);
        }
        // move left
        else if (choice < 0.5)
        {
          this.getBody().setVelocity(-Enemy.SPEED, 0);
          this.setFlipX(true);
        }
        // move down
        else if (choice < 0.75)
        {
          this.getBody().setVelocity(0, Enemy.SPEED);
        }
        // move right
        else
        {
          this.getBody().setVelocity(Enemy.SPEED, 0);
          this.setFlipX(false);
        }
      }
      else
      {
        this.getBody().setVelocity(0, 0);
      }
    }
  }

  public getBody(): Phaser.Physics.Arcade.Body
  {
    return this.body as Phaser.Physics.Arcade.Body;
  }

}

export default Enemy;