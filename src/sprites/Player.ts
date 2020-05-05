import Phaser from 'phaser'

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

class Player extends Phaser.Physics.Arcade.Sprite
{

  public static TEXTURE_KEY = "jack";

  private static SPEED = 60;

  private direction: Direction;
  private isAnimating: boolean;

  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  private keySpace: Phaser.Input.Keyboard.Key;

  private step;
  private hoe;
  private hoeHit;
  
  private currentAnim;

  constructor(scene: Phaser.Scene, x: number, y: number)
  {
    super(scene, x, y, Player.TEXTURE_KEY);
    this.direction = Direction.Down;
    this.isAnimating = false;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyS = this.scene.input.keyboard.addKey('S');
    this.keyD = this.scene.input.keyboard.addKey('d');
    this.keySpace = this.scene.input.keyboard.addKey('SPACE');

    this.on('animationcomplete', () => {
      this.isAnimating = false;
    });

    this.step = this.scene.sound.add('sandstep1');
    this.hoe = this.scene.sound.add('hoe');
    this.hoeHit = this.scene.sound.add('hoeHit');
  }

  public update()
  {

    if (this.isAnimating) {

      if (this.anims.currentAnim.getFrameByProgress(this.anims.getProgress()).index === 2) {
        if (!this.hoeHit.isPlaying) this.hoeHit.play();
      }

      return;
    }

    this.body.setSize(0, 0);

    if (this.keySpace.isDown)
    {

      this.isAnimating = true;

      this.hoe.play();

      

      this.setVelocity(0, 0);

      switch (this.direction)
      {
        case Direction.Up:
          this.anims.play('turn_soil_up', true);
          this.setFlipX(false);
          break;  
        case Direction.UpLeft:
        case Direction.DownLeft:
        case Direction.Left:
          this.anims.play('turn_soil_left', true);
          this.setFlipX(false);
          break;
        case Direction.UpRight:
        case Direction.DownRight:
        case Direction.Right:
          this.anims.play('turn_soil_left', true);
          this.setFlipX(true);
          // this.setScale(-1 ,1);
          break;
        default:
          this.anims.play('turn_soil_down', true);
          this.setFlipX(false);
          break;
      }

      return;

    }

    if (this.keyW.isDown && this.keyA.isDown)
    {
      this.setVelocity(-Player.SPEED, -Player.SPEED);
      this.anims.play('walk_left', true);
      this.setFlipX(false);
      this.direction = Direction.UpLeft;
      if (!this.step.isPlaying) this.step.play();
    }
    else if (this.keyW.isDown && this.keyD.isDown)
    {
      this.setVelocity(Player.SPEED, -Player.SPEED);
      this.anims.play('walk_left', true);
      this.setFlipX(true);
      this.direction = Direction.UpRight;
      if (!this.step.isPlaying) this.step.play();
    }
    else if (this.keyS.isDown && this.keyA.isDown)
    {
      this.setVelocity(-Player.SPEED, Player.SPEED);
      this.anims.play('walk_left', true);
      this.setFlipX(false);
      this.direction = Direction.DownLeft;
      if (!this.step.isPlaying) this.step.play();
    }
    else if (this.keyS.isDown && this.keyD.isDown)
    {
      this.setVelocity(Player.SPEED, Player.SPEED);
      this.anims.play('walk_left', true);
      this.setFlipX(true);
      this.direction = Direction.DownRight;
      if (!this.step.isPlaying) this.step.play();
    }
    else if (this.keyW.isDown)
    {
      this.setVelocity(0, -Player.SPEED);
      this.anims.play('walk_up', true);
      this.setFlipX(false);
      this.direction = Direction.Up;
      if (!this.step.isPlaying) this.step.play();
    }
    else if (this.keyS.isDown)
    {
      this.setVelocity(0, Player.SPEED);
      this.anims.play('walk_down', true);
      this.setFlipX(false);
      this.direction = Direction.Down;
      if (!this.step.isPlaying) this.step.play();
    }
    else if (this.keyA.isDown)
    {
      this.setVelocity(-Player.SPEED, 0);
      this.anims.play('walk_left', true);
      this.setFlipX(false);
      this.direction = Direction.Left;
      if (!this.step.isPlaying) this.step.play();
    }
    else if (this.keyD.isDown)
    {
      this.setVelocity(Player.SPEED, 0);
      this.anims.play('walk_left', true);
      this.setFlipX(true);
      this.direction = Direction.Right;
      if (!this.step.isPlaying) this.step.play();
    }
    else
    {

      this.setVelocity(0, 0);

      switch (this.direction)
      {
        case Direction.Up:
          this.anims.play('up', true);
          this.setFlipX(false);
          break;
        case Direction.UpLeft:
        case Direction.DownLeft:
        case Direction.Left:
          this.anims.play('left', true);
          this.setFlipX(false);
          break;
        case Direction.UpRight:
        case Direction.DownRight:
        case Direction.Right:
          this.anims.play('left', true);
          this.setFlipX(true);
          break;
        default:
          this.anims.play('down', true);
          this.setFlipX(false);
          break;
      }

    }

    this.body.velocity.normalize().scale(Player.SPEED);
  }

}

export default Player;