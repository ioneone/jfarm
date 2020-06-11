import { throttle } from 'throttle-debounce';
import { DamageEventData } from './../events/Event';
import { AudioAsset } from './../assets/AudioAsset';
import { EnemyAssetData } from './../assets/EnemyAsset';
import Phaser from 'phaser';
import Player from './Player';
import { EnemyAsset } from '../assets/EnemyAsset';
import EventDispatcher from '~/events/EventDispatcher';
import { Event } from '~/events/Event';

export enum EnemyUpdateState
{
  Default,
  KnockBack,
  AttackPlayer
}

class Enemy extends Phaser.GameObjects.Sprite
{

  private static readonly SPEED = 64;

  private asset: EnemyAsset;

  private hp: number;

  private attackCharge = 0;

  private moveEnergy = 0;

  private attackCounter = 0;

  private isFrozen = false;

  public updateState;

  private elapsedTime = 0;

  private duration = 100; // ms

  private attackInterval = 800; // ms

  constructor(scene: Phaser.Scene, x: number, y: number, asset: EnemyAsset)
  {
    super(scene, x, y, asset);

    this.asset = asset;

    this.updateState = EnemyUpdateState.Default;
    
    // add enemy to the scene
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);

    this.getBody().setBounce(0, 0);

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

  }

  public attackPlayer(player: Player)
  {
    player.receiveDamage(1);
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
    
    this.scene.tweens.add({
      targets: this,
      ease: 'Linear',
      duration: 60,
      repeat: 4,
      alpha: { from: 0, to: 1 }
    });

    // die
    if (this.hp === 0)
    {
      this.destroy();
    }

  }

  public knockBack(force: Phaser.Math.Vector2)
  {
    this.updateState = EnemyUpdateState.KnockBack;
    this.getBody().setVelocity(force.x, force.y);
    this.elapsedTime = 0;
  }

  public update(player: Player, delta: number)
  {

    if (this.updateState === EnemyUpdateState.Default)
    {
      const distanceToPlayer = this.getCenter().distance(player.getCenter());

      const chaseRadius = 64;
      // large enough so it won't push the player
      const attackRadius = 28;

      if (attackRadius < distanceToPlayer && distanceToPlayer < chaseRadius)
      {
        this.chasePlayer(player.getCenter());
      }
      else if (distanceToPlayer > chaseRadius)
      {
        this.moveRandomly();
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

    }
    else if (this.updateState === EnemyUpdateState.KnockBack)
    {
      this.elapsedTime += delta;
      if (this.elapsedTime > this.duration)
      {
        this.updateState = EnemyUpdateState.Default;
        this.getBody().setVelocity(0, 0);
      }
    }
    else if (this.updateState === EnemyUpdateState.AttackPlayer)
    {
      this.elapsedTime += delta;
      if (this.elapsedTime > this.attackInterval)
      {
        const distanceToPlayer = this.getCenter().distance(player.getCenter());

        const attackRadius = 28; // TODO: don't use constant
        if (distanceToPlayer < attackRadius)
        {
          this.attackPlayer(player);
        }
        else
        {
          this.updateState = EnemyUpdateState.Default;
        }
        
        this.elapsedTime = 0;
      }
    }

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