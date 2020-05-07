import Phaser from 'phaser'
import AnimationFactory from '~/factory/AnimationFactory';

enum Direction
{
  Up,
  UpLeft,
  Left,
  DownLeft,
  Down,
  DownRight,
  Right,
  UpRight
}

class Player extends Phaser.GameObjects.Container
{

  public static TEXTURE_KEY = "light";

  private static SPEED = 60;

  private direction: Direction;
  private isAnimating: boolean;

  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  private keySpace: Phaser.Input.Keyboard.Key;

  private body_: Phaser.GameObjects.Sprite;
  private hair: Phaser.GameObjects.Sprite;
  private legs: Phaser.GameObjects.Sprite;
  private torso: Phaser.GameObjects.Sprite;
  private shoes: Phaser.GameObjects.Sprite;
  
  constructor(scene: Phaser.Scene, x: number, y: number)
  {
    super(scene, x, y);

    this.direction = Direction.Down;
    this.isAnimating = false;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);   
    
    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyS = this.scene.input.keyboard.addKey('S');
    this.keyD = this.scene.input.keyboard.addKey('d');
    this.keySpace = this.scene.input.keyboard.addKey('SPACE');

    // this.step = this.scene.sound.add('sandstep1');
    // this.hoe = this.scene.sound.add('hoe');
    // this.hoeHit = this.scene.sound.add('hoeHit');

    this.body_ = new Phaser.GameObjects.Sprite(scene, 0, 0, AnimationFactory.BODY);
    scene.add.existing(this.body_);
    this.body_.setOrigin(0, 0);
    this.add(this.body_);

    this.hair = new Phaser.GameObjects.Sprite(scene, 0, 0, AnimationFactory.HAIR);
    scene.add.existing(this.hair);
    this.hair.setOrigin(0, 0);
    this.add(this.hair);

    this.legs = new Phaser.GameObjects.Sprite(scene, 0, 0, AnimationFactory.PANTS);
    scene.add.existing(this.legs);
    this.legs.setOrigin(0, 0);
    this.add(this.legs);

    this.torso = new Phaser.GameObjects.Sprite(scene, 0, 0, AnimationFactory.LONG_SLEEVE);
    scene.add.existing(this.torso);
    this.torso.setOrigin(0, 0);
    this.add(this.torso);

    this.shoes = new Phaser.GameObjects.Sprite(scene, 0, 0, AnimationFactory.SHOES);
    scene.add.existing(this.shoes);
    this.shoes.setOrigin(0, 0);
    this.add(this.shoes);

    this.body.setSize(18, 8);
    this.body.setOffset((64 - 18) / 2, 64 - 8);
    
  }

  public update()
  {

    // if (this.isAnimating) {

    //   if (this.anims.currentAnim.getFrameByProgress(this.anims.getProgress()).index === 2) {
    //     if (!this.hoeHit.isPlaying) this.hoeHit.play();
    //   }

    //   return;
    // }

    // this.body.setSize(0, 0);

    // if (this.keySpace.isDown)
    // {

    //   this.isAnimating = true;

    //   this.hoe.play();

      

    //   this.setVelocity(0, 0);

    //   switch (this.direction)
    //   {
    //     case Direction.Up:
    //       this.anims.play('turn_soil_up', true);
    //       this.setFlipX(false);
    //       break;  
    //     case Direction.UpLeft:
    //     case Direction.DownLeft:
    //     case Direction.Left:
    //       this.anims.play('turn_soil_left', true);
    //       this.setFlipX(false);
    //       break;
    //     case Direction.UpRight:
    //     case Direction.DownRight:
    //     case Direction.Right:
    //       this.anims.play('turn_soil_left', true);
    //       this.setFlipX(true);
    //       // this.setScale(-1 ,1);
    //       break;
    //     default:
    //       this.anims.play('turn_soil_down', true);
    //       this.setFlipX(false);
    //       break;
    //   }

    //   return;

    // }

    // if (this.keyW.isDown && this.keyA.isDown)
    // {
    //   this.setVelocity(-Player.SPEED, -Player.SPEED);
    //   this.anims.play('walk_left', true);
    //   this.setFlipX(false);
    //   this.direction = Direction.UpLeft;
    //   if (!this.step.isPlaying) this.step.play();
    // }
    // else if (this.keyW.isDown && this.keyD.isDown)
    // {
    //   this.setVelocity(Player.SPEED, -Player.SPEED);
    //   this.anims.play('walk_left', true);
    //   this.setFlipX(true);
    //   this.direction = Direction.UpRight;
    //   if (!this.step.isPlaying) this.step.play();
    // }
    // else if (this.keyS.isDown && this.keyA.isDown)
    // {
    //   this.setVelocity(-Player.SPEED, Player.SPEED);
    //   this.anims.play('walk_left', true);
    //   this.setFlipX(false);
    //   this.direction = Direction.DownLeft;
    //   if (!this.step.isPlaying) this.step.play();
    // }
    // else if (this.keyS.isDown && this.keyD.isDown)
    // {
    //   this.setVelocity(Player.SPEED, Player.SPEED);
    //   this.anims.play('walk_left', true);
    //   this.setFlipX(true);
    //   this.direction = Direction.DownRight;
    //   if (!this.step.isPlaying) this.step.play();
    // }
    // else if (this.keyW.isDown)
    // {
    //   this.setVelocity(0, -Player.SPEED);
    //   this.anims.play('walk_up', true);
    //   this.setFlipX(false);
    //   this.direction = Direction.Up;
    //   if (!this.step.isPlaying) this.step.play();
    // }
    // else if (this.keyS.isDown)
    // {
    //   this.setVelocity(0, Player.SPEED);
    //   this.anims.play('walk_down', true);
    //   this.setFlipX(false);
    //   this.direction = Direction.Down;
    //   if (!this.step.isPlaying) this.step.play();
    // }
    // else if (this.keyA.isDown)
    // {
    //   this.setVelocity(-Player.SPEED, 0);
    //   this.anims.play('walk_left', true);
    //   this.setFlipX(false);
    //   this.direction = Direction.Left;
    //   if (!this.step.isPlaying) this.step.play();
    // }
    // else if (this.keyD.isDown)
    // {
    //   this.setVelocity(Player.SPEED, 0);
    //   this.anims.play('walk_left', true);
    //   this.setFlipX(true);
    //   this.direction = Direction.Right;
    //   if (!this.step.isPlaying) this.step.play();
    // }
    // else
    // {

    //   this.setVelocity(0, 0);

    //   switch (this.direction)
    //   {
    //     case Direction.Up:
    //       this.anims.play('up', true);
    //       this.setFlipX(false);
    //       break;
    //     case Direction.UpLeft:
    //     case Direction.DownLeft:
    //     case Direction.Left:
    //       this.anims.play('left', true);
    //       this.setFlipX(false);
    //       break;
    //     case Direction.UpRight:
    //     case Direction.DownRight:
    //     case Direction.Right:
    //       this.anims.play('left', true);
    //       this.setFlipX(true);
    //       break;
    //     default:
    //       this.anims.play('down', true);
    //       this.setFlipX(false);
    //       break;
    //   }

    // }

    // this.body.velocity.normalize().scale(Player.SPEED);
   
    if (this.keyW.isDown)
    {
      this.body.setVelocity(0, -Player.SPEED);
      this.setDirection(Direction.Up);
    }
    else if (this.keyS.isDown)
    {
      this.body.setVelocity(0, Player.SPEED);
      this.setDirection(Direction.Down);
    }
    else if (this.keyA.isDown)
    {
      this.body.setVelocity(-Player.SPEED, 0);
      this.setDirection(Direction.Left);
    }
    else if (this.keyD.isDown)
    {
      this.body.setVelocity(Player.SPEED, 0);
      this.setDirection(Direction.Right);
    }
    else 
    {
      this.body.setVelocity(0, 0);
    }

    if (this.body.velocity.x > 0) 
    {
      this.body_.anims.play(AnimationFactory.BODY_WALK_RIGHT, true);
      this.hair.anims.play(AnimationFactory.HAIR_WALK_RIGHT, true);
      this.legs.anims.play(AnimationFactory.PANTS_WALK_RIGHT, true);
      this.torso.anims.play(AnimationFactory.LONG_SLEEVE_WALK_RIGHT, true);
      this.shoes.anims.play(AnimationFactory.SHOES_WALK_RIGHT, true);
    }
    else if (this.body.velocity.x < 0) 
    {
      this.body_.anims.play(AnimationFactory.BODY_WALK_LEFT, true);
      this.hair.anims.play(AnimationFactory.HAIR_WALK_LEFT, true);
      this.legs.anims.play(AnimationFactory.PANTS_WALK_LEFT, true);
      this.torso.anims.play(AnimationFactory.LONG_SLEEVE_WALK_LEFT, true);
      this.shoes.anims.play(AnimationFactory.SHOES_WALK_LEFT, true);
    }
    else if (this.body.velocity.y > 0)
    {
      this.body_.anims.play(AnimationFactory.BODY_WALK_DOWN, true);
      this.hair.anims.play(AnimationFactory.HAIR_WALK_DOWN, true);
      this.legs.anims.play(AnimationFactory.PANTS_WALK_DOWN, true);
      this.torso.anims.play(AnimationFactory.LONG_SLEEVE_WALK_DOWN, true);
      this.shoes.anims.play(AnimationFactory.SHOES_WALK_DOWN, true);
    }
    else if (this.body.velocity.y < 0)
    {
      this.body_.anims.play(AnimationFactory.BODY_WALK_UP, true);
      this.hair.anims.play(AnimationFactory.HAIR_WALK_UP, true);
      this.legs.anims.play(AnimationFactory.PANTS_WALK_UP, true);
      this.torso.anims.play(AnimationFactory.LONG_SLEEVE_WALK_UP, true);
      this.shoes.anims.play(AnimationFactory.SHOES_WALK_UP, true);
    }
    else
    {
      if (this.direction === Direction.Up)
      {
        this.body_.anims.play(AnimationFactory.BODY_UP, true);
        this.hair.anims.play(AnimationFactory.HAIR_UP, true);
        this.legs.anims.play(AnimationFactory.PANTS_UP, true);
        this.torso.anims.play(AnimationFactory.LONG_SLEEVE_UP, true);
        this.shoes.anims.play(AnimationFactory.SHOES_UP, true);
      }
      else if (this.direction === Direction.Down)
      {
        this.body_.anims.play(AnimationFactory.BODY_DOWN, true);
        this.hair.anims.play(AnimationFactory.HAIR_DOWN, true);
        this.legs.anims.play(AnimationFactory.PANTS_DOWN, true);
        this.torso.anims.play(AnimationFactory.LONG_SLEEVE_DOWN, true);
        this.shoes.anims.play(AnimationFactory.SHOES_DOWN, true);
      }
      else if (this.direction === Direction.Left)
      {
        this.body_.anims.play(AnimationFactory.BODY_LEFT, true);
        this.hair.anims.play(AnimationFactory.HAIR_LEFT, true);
        this.legs.anims.play(AnimationFactory.PANTS_LEFT, true);
        this.torso.anims.play(AnimationFactory.LONG_SLEEVE_LEFT, true);
        this.shoes.anims.play(AnimationFactory.SHOES_LEFT, true);
      }
      else if (this.direction === Direction.Right)
      {
        this.body_.anims.play(AnimationFactory.BODY_RIGHT, true);
        this.hair.anims.play(AnimationFactory.HAIR_RIGHT, true);
        this.legs.anims.play(AnimationFactory.PANTS_RIGHT, true);
        this.torso.anims.play(AnimationFactory.LONG_SLEEVE_RIGHT, true);
        this.shoes.anims.play(AnimationFactory.SHOES_RIGHT, true);
      }
    }

  }

  public setDirection(direction: Direction)
  {
    this.direction = direction;
  }

}

export default Player;