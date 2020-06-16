import { NonPlayerCharacterAssetData } from './../assets/NonPlayerCharacterAsset';
import { NonPlayerCharacterAsset } from '~/assets/NonPlayerCharacterAsset';
import Phaser from 'phaser';
import Player from './Player';

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

  private static readonly MOVE_SPEED = 64;

  private asset: NonPlayerCharacterAsset;

  constructor(scene: Phaser.Scene, x: number, y: number, asset: NonPlayerCharacterAsset)
  {
    super(scene, x, y, asset);

    this.asset = asset;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);

    // register animations
    this.scene.anims.create({
      key: this.getIdleAnimationKey(), 
      frames: this.scene.anims.generateFrameNames(this.asset, 
        {
          prefix: NonPlayerCharacterAssetData.IdleAnimationPrefix as string,
          end: NonPlayerCharacterAssetData.IdleAnimationFrameEnd as number,
        }
      ),
      frameRate: 8
    });

    this.scene.anims.create({
      key: this.getRunAnimationKey(),
      frames: this.scene.anims.generateFrameNames(this.asset, 
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
  private getIdleAnimationKey(): string
  {
    return `${this.asset}:${NonPlayerCharacterAssetData.IdleAnimationPrefix}`;
  }

  /**
   * Get the key for running animation.
   */
  private getRunAnimationKey(): string
  {
    return `${this.asset}:${NonPlayerCharacterAssetData.RunAnimationPrefix}`;
  }

  public setOutlinePipeline(): void
  {
    this.setPipeline('Outline');
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

}

export default NonPlayerCharacter;