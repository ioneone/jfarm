import { DamageEventData } from './../events/Event';
import { AudioAsset } from './../assets/AudioAsset';
import { EnemyAssetData } from './../assets/EnemyAsset';
import Phaser from 'phaser';
import Player from './Player';
import { EnemyAsset } from '../assets/EnemyAsset';
import EventDispatcher from '~/events/EventDispatcher';
import { Event } from '~/events/Event';

class Enemy extends Phaser.GameObjects.Sprite
{

  private static readonly SPEED = 48;

  private asset: EnemyAsset;

  private hp: number;
  private maxHp: number;

  private attackCharge = 0;

  private moveEnergy = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, asset: EnemyAsset)
  {
    super(scene, x, y, asset);

    this.asset = asset;
    
    // add enemy to the scene
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);

    // register animations
    this.scene.anims.create({
      key: asset + ":idle",
      frames: this.scene.anims.generateFrameNames(asset, 
        { start: EnemyAssetData.IdleAnimationFrameStart, 
          end: EnemyAssetData.IdleAnimationFrameEnd }),
      frameRate: 8
    });

    this.scene.anims.create({
      key: asset + ":run",
      frames: this.scene.anims.generateFrameNames(asset, 
        { start: EnemyAssetData.RunAnimationFrameStart, 
          end: EnemyAssetData.RunAnimationFrameEnd }),
      frameRate: 8
    });

    // prevent player from pushing the enemy
    this.getBody().setImmovable(true);

    this.hp = 100;
    this.maxHp = 100;

    this.getBody().bounce.setTo(1, 1);

  }

  public receiveDamage(damage: number)
  {

    this.hp = Math.max(0, this.hp - damage);

    this.moveEnergy = -8;

    const cameraWorldPosition = this.scene.cameras.main.getWorldPoint(
      this.scene.cameras.main.x, this.scene.cameras.main.y);

    const cameraTopLeftX = this.scene.cameras.main.worldView.x;
    const cameraTopLeftY = this.scene.cameras.main.worldView.y;

    const ratioX = (this.x - cameraTopLeftX) / this.scene.cameras.main.width;
    const ratioY = (this.y - cameraTopLeftY) / this.scene.cameras.main.height;

    const canvasWidth = this.scene.cameras.main.width * this.scene.cameras.main.zoom;
    const canvasHeight = this.scene.cameras.main.height * this.scene.cameras.main.zoom;

    EventDispatcher.getInstance().emit(Event.Damage, 
      { damage: damage, x: ratioX * canvasWidth, y: ratioY * canvasHeight } as DamageEventData);
    
    this.getBody().setVelocity(0, 0);

    this.scene.tweens.add({
      targets: this,
      ease: 'Linear',
      duration: 60,
      repeat: 4,
      alpha: { from: 0, to: 1 }
    });

    this.scene.sound.play(AudioAsset.DamageEnemy);

    if (this.hp === 0)
    {
      this.destroy();
    } 

  }

  public update(player: Player)
  {

    if (this.moveEnergy >= 0)
    {

      this.getBody().setAcceleration(0, 0);

      const distanceToPlayer = this.getCenter().distance(player.getCenter());

      const attackRange = 28;
      const vision = 64;

      if (attackRange < distanceToPlayer && distanceToPlayer < vision)
      {
        this.chasePlayer(player.getCenter());
      }
      else if (distanceToPlayer >= vision)
      {
        this.moveRandomly();
      }
      else
      {
        if (this.getBody().velocity.x === 0 && this.getBody().velocity.y === 0)
        {
          this.attackCharge += 1;
          this.attackCharge %= 30;
  
          if (this.attackCharge === 0)
          {
            player.receiveDamage(10);
          }
          
        }
      }
    }

    if (this.getBody().velocity.x === 0 && this.getBody().velocity.y === 0)
    {
      this.anims.play(this.asset + ":idle", true);
      this.getBody().setImmovable(true);
    }
    else
    {
      this.anims.play(this.asset + ":run", true);
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

    this.moveEnergy = Math.min(this.moveEnergy + 1, 0);

  }

  private chasePlayer(playerLocation: Phaser.Math.Vector2)
  {
    this.getBody().setVelocity(playerLocation.x - this.x, playerLocation.y - this.y);
    this.getBody().velocity.normalize().scale(Enemy.SPEED); 
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