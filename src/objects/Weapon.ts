import { AudioAsset } from './../assets/AudioAsset';
import { WeaponAsset } from '../assets/WeaponAsset';
import Phaser from 'phaser';
import Player from "./Player";

/**
 * The weapon the player holds
 */
class Weapon extends Phaser.GameObjects.Sprite
{
  // A model of this weapon that includes all the information about this weapon
  // such as attack damage
  // private model: WeaponModel

  // how faset the weapon rotates in degrees
  private static readonly ROTATION_SPEED = 16;

  // whether or not the weapon is rotating
  private rotating: boolean;

  constructor(scene: Phaser.Scene, asset: WeaponAsset)
  {
    super(scene, 0, 0, asset);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.rotating = false;

    this.setOrigin(0.5, 1);
    this.getBody().setCircle(5);
  }

  public update(player: Player)
  {
    if (player.isActivatingWeapon())
    {
      if (!this.rotating)
      {
        this.scene.sound.play(AudioAsset.Swing);
        this.setRotating(true);
      }
    }

    this.flipX = player.flipX;
    
    if (this.flipX)
    {
      this.setPosition(player.x - 8, player.y + 8);
      this.setAngle(-Math.abs(this.angle));
    }
    else
    {
      this.setPosition(player.x + 8, player.y + 8);
      this.setAngle(Math.abs(this.angle));
    }

    if (this.rotating)
    {

      if (this.flipX)
      {
        this.angle -= Weapon.ROTATION_SPEED;

        // overshoot
        if (this.angle > 0)
        {
          this.setRotating(false);
          this.angle = 0;
        }
      }
      else
      {
        this.angle += Weapon.ROTATION_SPEED;

        // overshoot
        if (this.angle < 0)
        {
          this.setRotating(false);
          this.angle = 0;
        }
      }

    }

    // distance from center of rotation of the weapon
    // to center of the weapon physics body (circle)
    const radius = 21 - 5;
    this.setAngle(this.angle);
    this.getBody().setOffset(
      radius * Math.sin(this.angle * Math.PI / 180), 
      radius - radius * Math.cos(this.angle * Math.PI / 180));

  }

  private setRotating(rotating: boolean): void
  {
    this.rotating = rotating;
  }

  public isRotating(): boolean
  {
    return this.rotating;
  }

  private getBody(): Phaser.Physics.Arcade.Body
  {
    return this.body as Phaser.Physics.Arcade.Body;
  }
}

export default Weapon;