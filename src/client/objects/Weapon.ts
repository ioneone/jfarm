import { AudioAsset } from '../assets/AudioAsset';
import Phaser from 'phaser';
import Player from "./Player";
import WeaponModel from '../models/WeaponModel';

/**
 * The weapon the player holds.
 * @class
 * @classdesc
 * If there is a collision between the weapon and an enemy, the enemy will
 * rececive a damage. The weapon is lethal only when it has angular velocity.
 * It won't deal any damage when it's still.
 */
class Weapon extends Phaser.GameObjects.Sprite
{

  // the speed the weapon moves in degree per second
  private static readonly ANGULAR_VELOCITY = 1600;

  // the raidus of the collision circle
  private static readonly COLLISON_CIRCLE_RADIUS = 5;
  
  // the model of this weapon
  private model: WeaponModel;

  // the angle in degree from previous frame
  private prevAngle: number;

  // the flipX from previous frame
  private prevFlipX: boolean;

  /**
   * @param {Phaser.Scene} scene - the scene this object belongs to
   * @param {WeaponModel} model - the weapon image file path  
   */
  constructor(scene: Phaser.Scene, model: WeaponModel)
  {
    super(scene, 0, 0, model.asset);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.model = model;

    // the origin of the rotation is where you grab the weapon
    this.setOrigin(0.5, 1);

    // use circle for collision body because arcade physics does not support collision body rotation
    this.getBody().setCircle(Weapon.COLLISON_CIRCLE_RADIUS);

    // prevent the enemy from push the weapon
    this.getBody().setImmovable(true);

    this.prevAngle = 0;
    this.prevFlipX = false;
  }

  /**
   * This should be called every frame. The weapon follows the player.
   * @param {Player} player 
   */
  public update(player: Player)
  {

    this.flipX = player.flipX;

    if (this.getBody().angularVelocity === 0)
    {
      this.angle = 0;

      if (player.isActivatingWeapon())
      {
        this.scene.sound.play(AudioAsset.Swing);
        if (this.flipX)
        {
          this.getBody().setAngularVelocity(-Weapon.ANGULAR_VELOCITY);
        }
        else
        {
          this.getBody().setAngularVelocity(Weapon.ANGULAR_VELOCITY);
        }
      }
      
    }
    else
    {
      if (this.prevAngle * this.angle < 0)
      {
        this.getBody().setAngularVelocity(0);
      }
    }

    if (this.flipX !== this.prevFlipX)
    {
      this.setAngle(-this.angle);
      this.getBody().setAngularVelocity(-this.getBody().angularVelocity);
    }

    if (this.flipX)
    {
      this.setPosition(player.x - Player.HANDS_OFFSET_X, player.y + Player.HANDS_OFFSET_Y)
    }
    else
    {
      this.setPosition(player.x + Player.HANDS_OFFSET_X, player.y + Player.HANDS_OFFSET_Y)
    }
  
    // distance from center of rotation of the weapon (origin) to center of the weapon physics body (circle)
    const rotationRadius = this.height - Weapon.COLLISON_CIRCLE_RADIUS;
    this.getBody().setOffset(
      rotationRadius * Math.sin(this.angle * Math.PI / 180), 
      rotationRadius - rotationRadius * Math.cos(this.angle * Math.PI / 180));

    this.prevAngle = this.angle;
    this.prevFlipX = this.flipX;
  }

  public updateSnapshot(player)
  {
    this.setFlipX(player.flipX);
    if (this.flipX)
    {
      this.setPosition(player.x - Player.HANDS_OFFSET_X, player.y + Player.HANDS_OFFSET_Y)
    }
    else
    {
      this.setPosition(player.x + Player.HANDS_OFFSET_X, player.y + Player.HANDS_OFFSET_Y)
    }
    this.angle = player.weaponAngle;
  }

  /**
   * Get the physics body
   * @return {Phaser.Physics.Arcade.Body} - the physics body
   */
  public getBody(): Phaser.Physics.Arcade.Body
  {
    return this.body as Phaser.Physics.Arcade.Body;
  }

  /**
   * Update the model. It also updates the texture based on the model.
   * @param {WeaponModel} model - the model of the weapon 
   */
  public setModel(model: WeaponModel): void
  {
    this.model = model;
    this.setTexture(model.asset);
  }

  /**
   * Get the model of this weapon.
   * @return {WeaponModel} 
   */
  public getModel(): WeaponModel
  {
    return this.model;
  }
  
}

export default Weapon;