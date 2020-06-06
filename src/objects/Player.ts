import Phaser from 'phaser';
import EventDispatcher from '../dispatchers/EventDispatcher';

class Player extends Phaser.GameObjects.Sprite
{

  private static readonly SPEED = 60;

  private static readonly COLLISION_BODY_WIDTH = 16;
  private static readonly COLLISION_BODY_HEIGHT = 16;

  // keyboard key for moving up
  private keyW: Phaser.Input.Keyboard.Key;

  // keyboard key for moving left
  private keyA: Phaser.Input.Keyboard.Key;

  // keyboard key for moving down
  private keyS: Phaser.Input.Keyboard.Key;

  // keyboard key for moving right
  private keyD: Phaser.Input.Keyboard.Key;

  private keyJ: Phaser.Input.Keyboard.Key;
  private keyH: Phaser.Input.Keyboard.Key;

  // status
  private hp: number;
  private maxHp: number;

  private sp: number;
  private maxSp: number;

  public weapon: Phaser.GameObjects.Sprite;

  public isAttacking: boolean;
  private attackAngle: number;
  

  constructor(scene: Phaser.Scene, x: number, y: number)
  {
    super(scene, x, y, "assets/elf_f.png");

    // add weapon to the scene
    this.weapon = new Phaser.GameObjects.Sprite(this.scene, x, y, "assets/weapon_regular_sword.png");
    this.scene.add.existing(this.weapon);
    this.scene.physics.add.existing(this.weapon);
    this.weapon.setOrigin(0.5, 1);
    this.weapon.setDepth(1);
    this.setDepth(2);

    this.getWeaponBody().setCircle(6);

    // add player to the scene
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);

    // get references to the keyboard
    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyS = this.scene.input.keyboard.addKey('S');
    this.keyD = this.scene.input.keyboard.addKey('D');
    this.keyJ = this.scene.input.keyboard.addKey('J');
    this.keyH = this.scene.input.keyboard.addKey('H');

    // register animations
    this.scene.anims.create({
      key: "assets/elf_f.png:idle",
      frames: this.scene.anims.generateFrameNames("assets/elf_f.png", { start: 0, end: 3 }),
      frameRate: 8
    });

    this.scene.anims.create({
      key: "assets/elf_f.png:run",
      frames: this.scene.anims.generateFrameNames("assets/elf_f.png", { start: 4, end: 7 }),
      frameRate: 8
    });

    // set collision bounds
    this.getBody().setSize(Player.COLLISION_BODY_WIDTH, Player.COLLISION_BODY_HEIGHT);
    this.getBody().setOffset(0, 28 - Player.COLLISION_BODY_HEIGHT);

    this.hp = this.maxHp = 100;
    this.sp = this.maxSp = 100;

    this.isAttacking = false;
    this.attackAngle = 0;

  }

  public receiveAttackFromEnemy()
  {
    this.setFrame(8);
    this.hp -= 10;
    this.scene.sound.play("assets/damage_1_karen.wav");
    EventDispatcher.getInstance().emit("PlayerHpChange", { hp: this.hp, maxHp: this.maxHp });
  }

  public update()
  {

    if (this.keyW.isDown && this.keyA.isDown)
    {
      this.getBody().setVelocity(-1, -1);
      this.getBody().velocity.normalize().scale(Player.SPEED);
      this.setFlipX(true);
      this.weapon.setFlipX(true);
    }
    else if (this.keyS.isDown && this.keyA.isDown)
    {
      this.getBody().setVelocity(-1, 1);
      this.getBody().velocity.normalize().scale(Player.SPEED);
      this.setFlipX(true);
      this.weapon.setFlipX(true);
    }
    else if (this.keyS.isDown && this.keyD.isDown)
    {
      this.getBody().setVelocity(1, 1);
      this.getBody().velocity.normalize().scale(Player.SPEED);
      this.setFlipX(false);
      this.weapon.setFlipX(false);
    }
    else if (this.keyW.isDown && this.keyD.isDown)
    {
      this.getBody().setVelocity(1, -1);
      this.getBody().velocity.normalize().scale(Player.SPEED);
      this.setFlipX(false);
      this.weapon.setFlipX(false);
    }
    else if (this.keyW.isDown)
    {
      this.getBody().setVelocity(0, -Player.SPEED);
    }
    else if (this.keyA.isDown)
    {
      this.getBody().setVelocity(-Player.SPEED, 0);
      this.setFlipX(true);
      this.weapon.setFlipX(true);
    }
    else if (this.keyS.isDown)
    {
      this.getBody().setVelocity(0, Player.SPEED);
    }
    else if (this.keyD.isDown)
    {
      this.getBody().setVelocity(Player.SPEED, 0);
      this.setFlipX(false);
      this.weapon.setFlipX(false);
    }
    else 
    {
      this.getBody().setVelocity(0, 0);
    }

    if (this.getBody().velocity.x === 0 && this.getBody().velocity.y === 0)
    {
      this.anims.play("assets/elf_f.png:idle", true);
      this.getBody().setImmovable(true);
    }
    else
    {
      this.anims.play("assets/elf_f.png:run", true);
      this.getBody().setImmovable(false);
    }

    if (this.keyH.isDown)
    {
      this.setFrame(8);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyJ))
    {
      if (!this.isAttacking)
      {
        this.isAttacking = true;
        this.scene.sound.play("assets/swing.wav");
      }
    }

    if (this.weapon.flipX)
    {
      this.weapon.setPosition(this.x - 8, this.y + 8);
      this.attackAngle = -Math.abs(this.attackAngle);
    }
    else
    {
      this.weapon.setPosition(this.x + 8, this.y + 8);
      this.attackAngle = Math.abs(this.attackAngle);
    }

    if (this.isAttacking)
    {

      if (this.weapon.flipX)
      {
       this.attackAngle -= 16;
      }
      else
      {
        this.attackAngle += 16;
      }

      if (this.attackAngle < -180 || this.attackAngle > 180)
      {
        this.isAttacking = false;
        this.attackAngle = 0;
      }

    }

    const radius = 16;
    this.weapon.setAngle(this.attackAngle);
    this.getWeaponBody().setOffset(
      radius * Math.sin(this.attackAngle * Math.PI / 180), 
      radius - radius * Math.cos(this.attackAngle * Math.PI / 180));

    this.getWeaponBody().setVelocity(10);
  }

  public getBody(): Phaser.Physics.Arcade.Body
  {
    return this.body as Phaser.Physics.Arcade.Body;
  }

  public getWeaponBody(): Phaser.Physics.Arcade.Body
  {
    return this.weapon.body as Phaser.Physics.Arcade.Body;
  }

}

export default Player;