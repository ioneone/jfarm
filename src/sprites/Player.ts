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

  private static SPEED = 70;

  private cursor: Phaser.Types.Input.Keyboard.CursorKeys;
  private direction: Direction;

  constructor(
    scene: Phaser.Scene, 
    cursor: Phaser.Types.Input.Keyboard.CursorKeys, 
    x: number, y: number)
  {
    super(scene, x, y, Player.TEXTURE_KEY);
    this.cursor = cursor;
    this.direction = Direction.Down;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }

  public update()
  {
    if (this.cursor.up?.isDown && this.cursor.left?.isDown)
    {
      this.setVelocity(-Player.SPEED, -Player.SPEED);
      this.anims.play('walk_left', true);
      this.setFlipX(false);
      this.direction = Direction.UpLeft;
    }
    else if (this.cursor.up?.isDown && this.cursor.right?.isDown)
    {
      this.setVelocity(Player.SPEED, -Player.SPEED);
      this.anims.play('walk_left', true);
      this.setFlipX(true);
      this.direction = Direction.UpRight;
    }
    else if (this.cursor.down?.isDown && this.cursor.left?.isDown)
    {
      this.setVelocity(-Player.SPEED, Player.SPEED);
      this.anims.play('walk_left', true);
      this.setFlipX(false);
      this.direction = Direction.DownLeft;
    }
    else if (this.cursor.down?.isDown && this.cursor.right?.isDown)
    {
      this.setVelocity(Player.SPEED, Player.SPEED);
      this.anims.play('walk_left', true);
      this.setFlipX(true);
      this.direction = Direction.DownRight;
    }
    else if (this.cursor.up?.isDown)
    {
      this.setVelocity(0, -Player.SPEED);
      this.anims.play('walk_up', true);
      this.setFlipX(false);
      this.direction = Direction.Up;
    }
    else if (this.cursor.down?.isDown)
    {
      this.setVelocity(0, Player.SPEED);
      this.anims.play('walk_down', true);
      this.setFlipX(false);
      this.direction = Direction.Down;
    }
    else if (this.cursor.left?.isDown)
    {
      this.setVelocity(-Player.SPEED, 0);
      this.anims.play('walk_left', true);
      this.setFlipX(false);
      this.direction = Direction.Left;
    }
    else if (this.cursor.right?.isDown)
    {
      this.setVelocity(Player.SPEED, 0);
      this.anims.play('walk_left', true);
      this.setFlipX(true);
      this.direction = Direction.Right;
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
  }

}

export default Player;