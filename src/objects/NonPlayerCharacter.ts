import { NonPlayerCharacterAssetData } from './../assets/NonPlayerCharacterAsset';
import { NonPlayerCharacterAsset } from '~/assets/NonPlayerCharacterAsset';
import Phaser from 'phaser';
import OutlinePipeline from '~/pipelines/OutlinePipeline';

export interface NonPlayerCharacterConfig
{
  asset: NonPlayerCharacterAsset;
  paragraph1: string;
  paragraph2?: string;
  paragraph3?: string;
}

export enum NonPlayerCharacterState
{
  Default,
  Talking
}

/**
 * Non controllable character (NPC)
 * @class
 * @classdesc
 * Player can talk to NPC. NPC exists only in a safe zone, meaning there can't 
 * be any enemies in the scene. You can extend this class to do more than 
 * talking such as buying items from NPC.
 */
class NonPlayerCharacter extends Phaser.GameObjects.Sprite
{

  protected static readonly MOVE_SPEED = 64;

  private config: NonPlayerCharacterConfig;

  public currentState = NonPlayerCharacterState.Default;
  
  constructor(scene: Phaser.Scene, x: number, y: number, config: NonPlayerCharacterConfig)
  {
    super(scene, x, y, config.asset);

    this.config = config;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);

    // register animations
    this.scene.anims.create({
      key: this.getIdleAnimationKey(), 
      frames: this.scene.anims.generateFrameNames(this.config.asset, 
        {
          prefix: NonPlayerCharacterAssetData.IdleAnimationPrefix as string,
          end: NonPlayerCharacterAssetData.IdleAnimationFrameEnd as number,
        }
      ),
      frameRate: 8
    });

    this.scene.anims.create({
      key: this.getRunAnimationKey(),
      frames: this.scene.anims.generateFrameNames(this.config.asset, 
        { 
          prefix: NonPlayerCharacterAssetData.RunAnimationPrefix as string,
          end: NonPlayerCharacterAssetData.RunAnimationFrameEnd as number,
        }
      ),
      frameRate: 8
    });

  }

  public update()
  {

    if (this.currentState === NonPlayerCharacterState.Default)
    {
      const probablity = 0.01;
      const shouldTakeAction = Math.random() < probablity;
  
      if (shouldTakeAction)
      {
        if (this.getBody().velocity.x === 0 && this.getBody().velocity.y === 0)
        {
          const choice = Math.random();
  
          if (choice < 0.25)
          {
            this.getBody().setVelocity(0, NonPlayerCharacter.MOVE_SPEED);
          }
          else if (choice < 0.5)
          {
            this.getBody().setVelocity(0, -NonPlayerCharacter.MOVE_SPEED);
          }
          else if (choice < 0.75)
          {
            this.getBody().setVelocity(NonPlayerCharacter.MOVE_SPEED, 0);
          }
          else
          {
            this.getBody().setVelocity(-NonPlayerCharacter.MOVE_SPEED, 0);
          }
        }
        else
        {
          this.getBody().setVelocity(0, 0);
        }
      }
    }
    else if (this.currentState === NonPlayerCharacterState.Talking)
    {
      this.getBody().setVelocity(0, 0);
    }

    if (this.getBody().velocity.x === 0 && this.getBody().velocity.y === 0)
    {
      this.anims.play(this.getIdleAnimationKey(), true);
    }
    else
    {
      this.anims.play(this.getRunAnimationKey(), true);
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

  /**
   * Get the key for idle animation.
   */
  protected getIdleAnimationKey(): string
  {
    return `${this.config.asset}:${NonPlayerCharacterAssetData.IdleAnimationPrefix}`;
  }

  /**
   * Get the key for running animation.
   */
  protected getRunAnimationKey(): string
  {
    return `${this.config.asset}:${NonPlayerCharacterAssetData.RunAnimationPrefix}`;
  }

  public setOutlinePipeline(): void
  {
    this.setPipeline(OutlinePipeline.KEY);
    this.pipeline.setFloat2('uTextureSize', this.texture.getSourceImage().width, this.texture.getSourceImage().height);
  }
  
  /**
   * Get the physics body.
   * @return {Phaser.Physics.Arcade.Body} - the physics body
   */
  public getBody(): Phaser.Physics.Arcade.Body
  {
    return this.body as Phaser.Physics.Arcade.Body;
  }

  public setCurrentState(state: NonPlayerCharacterState)
  {
    this.currentState = state;
  }

  public getParagraphs()
  {
    let paragraphs = [this.config.paragraph1];
    if (this.config.paragraph2) paragraphs.push(this.config.paragraph2);
    if (this.config.paragraph3) paragraphs.push(this.config.paragraph3);
    return paragraphs;
  }

}

export default NonPlayerCharacter;