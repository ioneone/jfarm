import Phaser from 'phaser';
import Player from './Player';
import EventDispatcher from '../events/EventDispatcher';
import Events from '../events/Events';
import Assets from '~/assets/Assets';

export interface EnemyConfig
{
  asset: EnemyAsset;
  // the amount of damage this enemy deals
  attackDamage: number;
  // how long the enemy gets knocked back in ms
  knockBackDuration: number;
  // how often the enemy attacks player in ms
  attackInterval: number;
  // how far the enemy can see to find the player in pixels
  vision: number;
  // the max hit points of the enemy
  maxHitPoints: number;
}

/**
 * State machine of the enemy. This affects the behavior of {@link Enemy#update}.
 * @readonly
 * @enum {number}
 */
export enum EnemyState
{
  Default,
  FoundPlayer,
  ChasePlayer,
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

  // current state of the enemy
  private currentState: EnemyState;

  private currentHitPoints: number;

  // the time elapsed since current state has been set
  private elapsedTime: number;

  private config: EnemyConfig;

  /**
   * @param {Phaser.Scene} scene - the sceen this object belongs to 
   * @param {number} x - x world coordinate of this object in pixels 
   * @param {number} y - y world cooridnate of this object in pixels 
   * @param {EnemyAsset} asset - the spritesheet file path of this object 
   */
  constructor(scene: Phaser.Scene, x: number, y: number, config: EnemyConfig)
  {
    super(scene, x, y, config.asset);

    // initialize member variables
    this.currentState = EnemyState.Default;
    this.elapsedTime = 0;
    this.config = config;
    this.currentHitPoints = config.maxHitPoints;
    
    // add enemy to the scene
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);

    // register animations
    this.scene.anims.create({
      key: this.getIdleAnimationKey(), 
      frames: this.scene.anims.generateFrameNames(this.config.asset, 
        {
          prefix: Assets.Data.Enemy.IdleAnimationPrefix as string,
          end: Assets.Data.Enemy.IdleAnimationFrameEnd as number,
        }
      ),
      frameRate: 8
    });

    this.scene.anims.create({
      key: this.getRunAnimationKey(),
      frames: this.scene.anims.generateFrameNames(this.config.asset, 
        { 
          prefix: Assets.Data.Enemy.RunAnimationPrefix as string,
          end: Assets.Data.Enemy.RunAnimationFrameEnd as number,
        }
      ),
      frameRate: 8
    });

  }

  /**
   * Deals some damage to the player
   * @param {Player} player - the player this enemy deals the damage to 
   */
  public attackPlayer(player: Player): void
  {
    player.receiveDamage(this.config.attackDamage);
  }

  /**
   * Receive some damage from the player
   * @param {number} damage - the amount of damage this enemy receives 
   */
  public receiveDamage(damage: number): void
  {

    this.currentHitPoints = Math.max(0, this.currentHitPoints - damage);

    const canvasViewPosition = this.computeCanvasViewPosition();

    EventDispatcher.getInstance().emit(Events.Event.Damage, 
      { damage: damage, x: canvasViewPosition.x, y: canvasViewPosition.y } as Events.Data.Damage);
    
    // enemey flash effect
    this.scene.tweens.add({
      targets: this,
      duration: 60,
      repeat: 4,
      alpha: { from: 0, to: 1 }
    });

    // die
    if (this.currentHitPoints === 0)
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
    this.currentState = EnemyState.KnockBack;
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

    if (this.currentState === EnemyState.Default)
    {
      const distanceToPlayer = this.getCenter().distance(player.getCenter());

      if (distanceToPlayer < this.config.vision)
      {
        this.currentState = EnemyState.FoundPlayer;
        this.elapsedTime = 0;
      }
      else
      {
        this.moveRandomly();
      }

    }
    else if (this.currentState === EnemyState.FoundPlayer)
    {
      const canvasViewPosition = this.computeCanvasViewPosition();
      EventDispatcher.getInstance().emit(Events.Event.EnemyFoundPlayer, 
        { x: canvasViewPosition.x, y: canvasViewPosition.y, height: this.height } as Events.Data.EnemyFoundPlayer);
      this.currentState = EnemyState.ChasePlayer;
      this.elapsedTime = 0;
    }
    else if (this.currentState === EnemyState.ChasePlayer)
    {
      const distanceToPlayer = this.getCenter().distance(player.getCenter());

      if (distanceToPlayer < this.config.vision)
      {
        this.chasePlayer(player);
      }
      else
      {
        this.currentState = EnemyState.Default;
        this.elapsedTime = 0;
        this.getBody().setVelocity(0, 0);
      }
    }
    else if (this.currentState === EnemyState.KnockBack)
    {
      if (this.elapsedTime > this.config.knockBackDuration)
      {
        const distanceToPlayer = this.getCenter().distance(player.getCenter());

        if (distanceToPlayer < this.config.vision)
        {
          this.currentState = EnemyState.ChasePlayer;
        }
        else
        {
          this.currentState = EnemyState.Default;

        }
        this.elapsedTime = 0;
        this.getBody().setVelocity(0, 0);
      }
    }
    else if (this.currentState === EnemyState.AttackPlayer)
    {
      
      if (this.elapsedTime > this.config.attackInterval)
      {
        const distanceToPlayer = this.getCenter().distance(player.getBodyCenter());

        // max distance between player and enemy when they touch each other
        const attackRadius = Math.sqrt(
          Math.pow((player.getBody().width + this.getBody().width) / 2, 2) +
          Math.pow((player.getBody().height + this.getBody().height) / 2, 2)
        );

        if (distanceToPlayer < attackRadius)
        {
          this.attackPlayer(player);
          this.currentState = EnemyState.AttackPlayer;
        }
        else if (distanceToPlayer < this.config.vision)
        {
          this.currentState = EnemyState.ChasePlayer;
        }
        else
        {
          this.currentState = EnemyState.Default;
        }
        
        this.elapsedTime = 0;
        
      }
    }

    // update frame and physics body
    if (this.getBody().velocity.x === 0 && this.getBody().velocity.y === 0)
    {
      this.anims.play(this.getIdleAnimationKey(), true);
      this.getBody().setImmovable(true);
    }
    else
    {
      this.anims.play(this.getRunAnimationKey(), true);
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
   * Get current state of the enemy.
   * @return {EnemyState} - the current update state
   */
  public getCurrentState(): EnemyState
  {
    return this.currentState;
  }

  /**
   * Set the current update state of the enemy to change its behavior in `enemy.update()`.
   * @param {EnemyState} state - the state to update to 
   */
  public setCurrentState(state: EnemyState): void
  {
    this.currentState = state;
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

  /**
   * Compute the position in pixels of this object in canvas coordinate system
   * @return {Phaser.Math.Vector2} - the position in pixels relative to canvas coordinate system 
   */
  private computeCanvasViewPosition(): Phaser.Math.Vector2
  {
    const cameraTopLeftX = this.scene.cameras.main.worldView.x;
    const cameraTopLeftY = this.scene.cameras.main.worldView.y;

    const ratioX = (this.x - cameraTopLeftX) / this.scene.cameras.main.width;
    const ratioY = (this.y - cameraTopLeftY) / this.scene.cameras.main.height;

    const canvasWidth = this.scene.cameras.main.width * this.scene.cameras.main.zoom;
    const canvasHeight = this.scene.cameras.main.height * this.scene.cameras.main.zoom;

    return new Phaser.Math.Vector2(ratioX * canvasWidth, ratioY * canvasHeight);
  }

  /**
   * Get the key for idle animation.
   */
  private getIdleAnimationKey(): string
  {
    return `${this.config.asset}:${Assets.Data.Enemy.IdleAnimationPrefix}`;
  }

  /**
   * Get the key for running animation.
   */
  private getRunAnimationKey(): string
  {
    return `${this.config.asset}:${Assets.Data.Enemy.RunAnimationPrefix}`;
  }

}

export default Enemy;