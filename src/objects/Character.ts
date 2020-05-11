import Phaser from 'phaser'
import CharacterConfig from '../configs/CharacterConfig';
import CharacterFactory from '~/factory/CharacterFactory';

enum Direction
{
  Up,
  Left,
  Down,
  Right
}

class Character extends Phaser.GameObjects.Container
{

  private static readonly SPEED = 60;
  private static readonly COLLISION_BODY_WIDTH = 32;
  private static readonly COLLISION_BODY_HEIGHT = 48;

  private direction: Direction;

  private config: CharacterConfig;

  private bodySprite: Phaser.GameObjects.Sprite;
  private hairSprite: Phaser.GameObjects.Sprite;
  private legsSprite: Phaser.GameObjects.Sprite;
  private torsoSprite: Phaser.GameObjects.Sprite;
  private feetSprite: Phaser.GameObjects.Sprite;
  private shadowSprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number, config: CharacterConfig)
  {
    super(scene, x, y);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);
    
    this.direction = Direction.Down;
    this.config = config;

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

    this.getBody().setSize(Character.COLLISION_BODY_WIDTH, Character.COLLISION_BODY_HEIGHT);
    this.getBody().setOffset((CharacterFactory.FRAME_WIDTH - Character.COLLISION_BODY_WIDTH) / 2, 
      CharacterFactory.FRAME_HEIGHT - Character.COLLISION_BODY_HEIGHT);
  }

  protected move(direction: Direction)
  {

    this.direction = direction;

    if (this.direction === Direction.Up)
    {
      this.getBody().setVelocity(0, -Character.SPEED);
    }
    else if (this.direction === Direction.Left)
    {
      this.getBody().setVelocity(-Character.SPEED, 0);
    }
    else if (this.direction === Direction.Down)
    {
      this.getBody().setVelocity(0, Character.SPEED);
    }
    else if (this.direction === Direction.Right)
    {
      this.getBody().setVelocity(Character.SPEED, 0);
    }

  }

  protected stopMoving()
  {
    this.getBody().setVelocity(0, 0);
  }

  protected updateFrame()
  {
    if (this.getBody().velocity.x > 0) 
    {
      this.bodySprite.anims.play(this.config.body.walkRightAnimationId, true);
      this.hairSprite.anims.play(this.config.hair.walkRightAnimationId, true);
      this.legsSprite.anims.play(this.config.legs.walkRightAnimationId, true);
      this.torsoSprite.anims.play(this.config.torso.walkRightAnimationId, true);
      this.feetSprite.anims.play(this.config.feet.walkRightAnimationId, true);
      this.shadowSprite.anims.play(this.config.shadow.walkRightAnimationId, true);
    }
    else if (this.getBody().velocity.x < 0) 
    {
      this.bodySprite.anims.play(this.config.body.walkLeftAnimationId, true);
      this.hairSprite.anims.play(this.config.hair.walkLeftAnimationId, true);
      this.legsSprite.anims.play(this.config.legs.walkLeftAnimationId, true);
      this.torsoSprite.anims.play(this.config.torso.walkLeftAnimationId, true);
      this.feetSprite.anims.play(this.config.feet.walkLeftAnimationId, true);
      this.shadowSprite.anims.play(this.config.shadow.walkLeftAnimationId, true);
    }
    else if (this.getBody().velocity.y > 0)
    {
      this.bodySprite.anims.play(this.config.body.walkDownAnimationId, true);
      this.hairSprite.anims.play(this.config.hair.walkDownAnimationId, true);
      this.legsSprite.anims.play(this.config.legs.walkDownAnimationId, true);
      this.torsoSprite.anims.play(this.config.torso.walkDownAnimationId, true);
      this.feetSprite.anims.play(this.config.feet.walkDownAnimationId, true);
      this.shadowSprite.anims.play(this.config.shadow.walkDownAnimationId, true);
    }
    else if (this.getBody().velocity.y < 0)
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

  protected stop()
  {
    this.getBody().setVelocity(0, 0);

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

  protected setDirection(direction: Direction)
  {
    this.direction = direction;
  }

  protected getBody(): Phaser.Physics.Arcade.Body
  {
    return this.body as Phaser.Physics.Arcade.Body;
  }

}

export default Character;
export { Direction };