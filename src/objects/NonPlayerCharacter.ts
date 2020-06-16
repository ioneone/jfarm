import NonPlayerCharacterAsset from '../assets/NonPlayerCharacterAsset';
import Phaser from 'phaser';

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
  constructor(scene: Phaser.Scene, x: number, y: number, asset: NonPlayerCharacterAsset)
  {
    super(scene, x, y, asset);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.getBody().setImmovable(true);
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