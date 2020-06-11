import { throttle } from 'throttle-debounce';
import { DamageEventData } from './../events/Event';
import { AudioAsset } from './../assets/AudioAsset';
import { EnemyAssetData } from './../assets/EnemyAsset';
import Phaser from 'phaser';
import Player from './Player';
import { EnemyAsset } from '../assets/EnemyAsset';
import EventDispatcher from '~/events/EventDispatcher';
import { Event } from '~/events/Event';

/**
 * State machine of the enemy. This affects the behavior of {@link Enemy#update}.
 * @readonly
 * @enum {number}
 */
export enum EnemyUpdateState
{
  Default,
  KnockBack,
  AttackPlayer
}

/**
 * The enemy sprite.
 * @class
 * @classdesc
 * Player can attack enemies and vice versa.
 */
class Enemy extends Phaser.GameObjects.Sprite
{

  // how fast the enemy moves
  private static readonly MOVE_SPEED = 48;

  // the spritesheet file path
  private asset: EnemyAsset;

  // the hit points of the enemy
  private hitPoints: number;

  // current update state of the enemy
  private updateState: EnemyUpdateState;

  // the time elapsed since current update state has been set
  private elapsedTime: number;

  // how long the enemy gets knocked back in ms
  private knockBackDuration: number;

  // how often the enemy attacks player in ms
  private attackInterval: number;

  // the amount of damage this enemy deals
  private attackDamage: number;

  // how far the enemy can see to find the player in pixels
  private vision: number;

  /**
   * @param {Phaser.Scene} scene - the sceen this object belongs to 
   * @param {number} x - x world coordinate of this object in pixels 
   * @param {number} y - y world cooridnate of this object in pixels 
   * @param {EnemyAsset} asset - the spritesheet file path of this object 
   */
  constructor(scene: Phaser.Scene, x: number, y: number, asset: EnemyAsset)
  {
    super(scene, x, y, asset);

    this.asset = asset;
    this.hitPoints = 100;
    this.updateState = EnemyUpdateState.Default;
    this.elapsedTime = 0;
    this.knockBackDuration = 100;
    this.attackInterval = 800;
    this.attackDamage = 2;
    this.vision = 64;
    
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

  }

  /**
   * Deals some damage to the player
   * @param {Player} player - the player this enemy deals the damage to 
   */
  public attackPlayer(player: Player): void
  {
    player.receiveDamage(this.attackDamage);
  }

  /**
   * Receive some damage from the player
   * @param {number} damage - the amount of damage this enemy receives 
   */
  public receiveDamage(damage: number): void
  {

    this.hitPoints = Math.max(0, this.hitPoints - damage);

    const cameraTopLeftX = this.scene.cameras.main.worldView.x;
    const cameraTopLeftY = this.scene.cameras.main.worldView.y;

    const ratioX = (this.x - cameraTopLeftX) / this.scene.cameras.main.width;
    const ratioY = (this.y - cameraTopLeftY) / this.scene.cameras.main.height;

    const canvasWidth = this.scene.cameras.main.width * this.scene.cameras.main.zoom;
    const canvasHeight = this.scene.cameras.main.height * this.scene.cameras.main.zoom;

    EventDispatcher.getInstance().emit(Event.Damage, 
      { damage: damage, x: ratioX * canvasWidth, y: ratioY * canvasHeight } as DamageEventData);
    
    // enemey flash effect
    this.scene.tweens.add({
      targets: this,
      duration: 60,
      repeat: 4,
      alpha: { from: 0, to: 1 }
    });

    // die
    if (this.hitPoints === 0)
    {
      this.destroy();
    }

  }

  /**
   * Kock this enemy back with given direction and magnitude. Use this effect 
   * when the enemy receives damage from the player.
   * @param {Phaser.Math.Vector2} velocity - the direction and magnitude to be knocked back 
   */
  public knockBack(velocity: Phaser.Math.Vector2): void
  {
    this.updateState = EnemyUpdateState.KnockBack;
    this.elapsedTime = 0;
    this.getBody().setVelocity(velocity.x, velocity.y);
  }

  /**
   * Update the enemy. This should be called every frame.
   * @param {Player} player - the reference to the player 
   * @param {number} delta - the time elapsed since last frame
   */
  public update(player: Player, delta: number): void
  {

    if (this.updateState === EnemyUpdateState.Default)
    {
      const distanceToPlayer = this.getCenter().distance(player.getCenter());

      if (distanceToPlayer < this.vision)
      {
        this.chasePlayer(player);
      }
      else
      {
        this.moveRandomly();
      }

    }
    else if (this.updateState === EnemyUpdateState.KnockBack)
    {
      if (this.elapsedTime > this.knockBackDuration)
      {
        this.updateState = EnemyUpdateState.Default;
        this.elapsedTime = 0;
        this.getBody().setVelocity(0, 0);
      }
    }
    else if (this.updateState === EnemyUpdateState.AttackPlayer)
    {
      
      if (this.elapsedTime > this.attackInterval)
      {
        const distanceToPlayer = this.getCenter().distance(player.getCenter());

        // max distance between player and enemy when they touch each other
        const attackRadius = Math.sqrt(
          Math.pow((player.getBody().width + this.getBody().width) / 2, 2) +
          Math.pow((player.getBody().height + this.getBody().height) / 2, 2)
        );

        if (distanceToPlayer < attackRadius)
        {
          this.attackPlayer(player);
          this.updateState = EnemyUpdateState.AttackPlayer;
        }
        else
        {
          this.updateState = EnemyUpdateState.Default;
        }
        
        this.elapsedTime = 0;
        
      }
    }

    // update frame and physics body
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

    this.elapsedTime += delta;

  }

  /**
   * Get current update state of the enemy.
   * @return {EnemyUpdateState} - the current update state
   */
  public getUpdateState(): EnemyUpdateState
  {
    return this.updateState;
  }

  /**
   * Set the current update state of the enemy.
   * @param {EnemyUpdateState} state - the state to update to 
   */
  public setUpdateState(state: EnemyUpdateState): void
  {
    this.updateState = state;
  } 

  /**
   * Update the velocity to approach the player
   * @param player - the player to approach
   */
  private chasePlayer(player: Player): void
  {
    const playerLocation = player.getCenter();
    this.getBody().setVelocity(playerLocation.x - this.x, playerLocation.y - this.y);
    this.getBody().velocity.normalize().scale(Enemy.MOVE_SPEED); 
  }

  /**
   * Move in random direction.
   */
  private moveRandomly(): void
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
          this.getBody().setVelocity(0, -Enemy.MOVE_SPEED);
        }
        // move left
        else if (choice < 0.5)
        {
          this.getBody().setVelocity(-Enemy.MOVE_SPEED, 0);
          this.setFlipX(true);
        }
        // move down
        else if (choice < 0.75)
        {
          this.getBody().setVelocity(0, Enemy.MOVE_SPEED);
        }
        // move right
        else
        {
          this.getBody().setVelocity(Enemy.MOVE_SPEED, 0);
          this.setFlipX(false);
        }
      }
      else
      {
        this.getBody().setVelocity(0, 0);
      }
    }
  }

  /**
   * Get the physics body.
   * @return {Phaser.Physics.Arcade.Body} - the physics body
   */
  public getBody(): Phaser.Physics.Arcade.Body
  {
    return this.body as Phaser.Physics.Arcade.Body;
  }

}

export default Enemy;