import Phaser from 'phaser'
import CharacterConfig from '../configs/CharacterConfig';

enum Direction
{
  Up,
  Left,
  Down,
  Right
}

class NonPlayer extends Phaser.GameObjects.Container
{

  private static readonly SPEED = 60;

  private direction: Direction;

  private bodySprite: Phaser.GameObjects.Sprite;
  private hairSprite: Phaser.GameObjects.Sprite;
  private legsSprite: Phaser.GameObjects.Sprite;
  private torsoSprite: Phaser.GameObjects.Sprite;
  private feetSprite: Phaser.GameObjects.Sprite;
  private shadowSprite: Phaser.GameObjects.Sprite;

  private config: CharacterConfig;
  
  constructor(scene: Phaser.Scene, x: number, y: number, config: CharacterConfig)
  {
    super(scene, x, y);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    
    // prevent it from being pushed 
    this.body.setImmovable();
  
    this.config = config;
    this.direction = Direction.Down;

    this.shadowSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, config.shadow.spritesheetId);
    scene.add.existing(this.shadowSprite);
    this.shadowSprite.setOrigin(0, 0);
    this.add(this.shadowSprite);

    this.bodySprite = new Phaser.GameObjects.Sprite(scene, 0, 0, config.body.spritesheetId);
    scene.add.existing(this.bodySprite);
    this.bodySprite.setOrigin(0, 0);
    this.add(this.bodySprite);

    this.hairSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, config.hair.spritesheetId);
    scene.add.existing(this.hairSprite);
    this.hairSprite.setOrigin(0, 0);
    this.add(this.hairSprite);

    this.legsSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, config.legs.spritesheetId);
    scene.add.existing(this.legsSprite);
    this.legsSprite.setOrigin(0, 0);
    this.add(this.legsSprite);

    this.torsoSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, config.torso.spritesheetId);
    scene.add.existing(this.torsoSprite);
    this.torsoSprite.setOrigin(0, 0);
    this.add(this.torsoSprite);

    this.feetSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, config.feet.spritesheetId);
    scene.add.existing(this.feetSprite);
    this.feetSprite.setOrigin(0, 0);
    this.add(this.feetSprite);

    const collisionBodyWidth = 36;
    const collisionBodyHeight = 48;
    this.body.setSize(collisionBodyWidth, collisionBodyHeight);
    this.body.setOffset((64 - collisionBodyWidth) / 2, 64 - collisionBodyHeight);
    
  }

  public update()
  {

    const probability = 0.01;
    const shouldTakeAction = Math.random() < probability;
    
    if (shouldTakeAction)
    {
      // idle
      if (!this.body.velocity.x && !this.body.velocity.y)
      {
        const choice = Math.random();

        if (choice < 0.25)
        {
          this.body.setVelocity(0, -NonPlayer.SPEED);
          this.setDirection(Direction.Up);
        }
        else if (choice < 0.5)
        {
          this.body.setVelocity(-NonPlayer.SPEED, 0);
          this.setDirection(Direction.Left);
        }
        else if (choice < 0.75)
        {
          this.body.setVelocity(0, NonPlayer.SPEED);
          this.setDirection(Direction.Down);
        }
        else 
        {
          this.body.setVelocity(NonPlayer.SPEED, 0);
          this.setDirection(Direction.Right);
        }

      }
      // moving
      else 
      {
        this.body.setVelocity(0, 0);
      }
    }

    if (!this.body.touching.none)
    {
      this.body.setVelocity(0, 0);
    }
    
    if (this.body.velocity.x > 0) 
    {
      this.bodySprite.anims.play(this.config.body.walkRightAnimationId, true);
      this.hairSprite.anims.play(this.config.hair.walkRightAnimationId, true);
      this.legsSprite.anims.play(this.config.legs.walkRightAnimationId, true);
      this.torsoSprite.anims.play(this.config.torso.walkRightAnimationId, true);
      this.feetSprite.anims.play(this.config.feet.walkRightAnimationId, true);
      this.shadowSprite.anims.play(this.config.shadow.walkRightAnimationId, true);
    }
    else if (this.body.velocity.x < 0) 
    {
      this.bodySprite.anims.play(this.config.body.walkLeftAnimationId, true);
      this.hairSprite.anims.play(this.config.hair.walkLeftAnimationId, true);
      this.legsSprite.anims.play(this.config.legs.walkLeftAnimationId, true);
      this.torsoSprite.anims.play(this.config.torso.walkLeftAnimationId, true);
      this.feetSprite.anims.play(this.config.feet.walkLeftAnimationId, true);
      this.shadowSprite.anims.play(this.config.shadow.walkLeftAnimationId, true);
    }
    else if (this.body.velocity.y > 0)
    {
      this.bodySprite.anims.play(this.config.body.walkDownAnimationId, true);
      this.hairSprite.anims.play(this.config.hair.walkDownAnimationId, true);
      this.legsSprite.anims.play(this.config.legs.walkDownAnimationId, true);
      this.torsoSprite.anims.play(this.config.torso.walkDownAnimationId, true);
      this.feetSprite.anims.play(this.config.feet.walkDownAnimationId, true);
      this.shadowSprite.anims.play(this.config.shadow.walkDownAnimationId, true);
    }
    else if (this.body.velocity.y < 0)
    {
      this.bodySprite.anims.play(this.config.body.walkUpAnimationId, true);
      this.hairSprite.anims.play(this.config.hair.walkUpAnimationId, true);
      this.legsSprite.anims.play(this.config.legs.walkUpAnimationId, true);
      this.torsoSprite.anims.play(this.config.torso.walkUpAnimationId, true);
      this.feetSprite.anims.play(this.config.feet.walkUpAnimationId, true);
      this.shadowSprite.anims.play(this.config.shadow.walkUpAnimationId, true);
    }
    else
    {
      if (this.direction === Direction.Up)
      {
        this.bodySprite.setFrame(this.config.faceUpFrameNumber);
        this.hairSprite.setFrame(this.config.faceUpFrameNumber);
        this.legsSprite.setFrame(this.config.faceUpFrameNumber);
        this.torsoSprite.setFrame(this.config.faceUpFrameNumber);
        this.feetSprite.setFrame(this.config.faceUpFrameNumber);
        this.shadowSprite.setFrame(this.config.faceUpFrameNumber);
      }
      else if (this.direction === Direction.Down)
      {
        this.bodySprite.setFrame(this.config.faceDownFrameNumber);
        this.hairSprite.setFrame(this.config.faceDownFrameNumber);
        this.legsSprite.setFrame(this.config.faceDownFrameNumber);
        this.torsoSprite.setFrame(this.config.faceDownFrameNumber);
        this.feetSprite.setFrame(this.config.faceDownFrameNumber);
        this.shadowSprite.setFrame(this.config.faceDownFrameNumber);
      }
      else if (this.direction === Direction.Left)
      {
        this.bodySprite.setFrame(this.config.faceLeftFrameNumber);
        this.hairSprite.setFrame(this.config.faceLeftFrameNumber);
        this.legsSprite.setFrame(this.config.faceLeftFrameNumber);
        this.torsoSprite.setFrame(this.config.faceLeftFrameNumber);
        this.feetSprite.setFrame(this.config.faceLeftFrameNumber);
        this.shadowSprite.setFrame(this.config.faceLeftFrameNumber);
      }
      else if (this.direction === Direction.Right)
      {
        this.bodySprite.setFrame(this.config.faceRightFrameNumber);
        this.hairSprite.setFrame(this.config.faceRightFrameNumber);
        this.legsSprite.setFrame(this.config.faceRightFrameNumber);
        this.torsoSprite.setFrame(this.config.faceRightFrameNumber);
        this.feetSprite.setFrame(this.config.faceRightFrameNumber);
        this.shadowSprite.setFrame(this.config.faceRightFrameNumber);
      }
    }

  }

  public setDirection(direction: Direction)
  {
    this.direction = direction;
  }

}

export default NonPlayer;