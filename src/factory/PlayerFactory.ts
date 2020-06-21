import Phaser from 'phaser';
import Player from '../objects/Player';
import Assets from '../assets/Assets';

/**
 * A factory for {@link Player}.
 * @class
 * @classdesc
 * Create a {@link Player} from {@link Assets.Asset.Player} with `create()`. This 
 * makes the construction of player easy without worry about what {@link PlayerConfig}
 * to pass in.
 */
class PlayerFactory
{

  /**
   * Figure out what player config to pass based on the asset and create the player.
   * @param {Phaser.Scene} scene = the scene the player belongs to
   * @param {number} x = the x world coordinate of the player in pixels
   * @param {number} y - the y world coordinate of the player in pixels
   * @param {PlayerAsset} asset - the asset to create the player from
   */
  public static create(scene: Phaser.Scene, x: number, y: number, asset: Assets.Asset.Player): Player
  {
    if (asset === Assets.Asset.Player.ElfFemale)
    {
      return new Player(scene, x, y, {
        asset: asset,
        bodyWidth: 16,
        bodyHeight: 16,
        bodyOffsetX: 0,
        bodyOffsetY: 12
      });
    }
    
    if (asset === Assets.Asset.Player.ElfMale)
    {
      return new Player(scene, x, y, {
        asset: asset,
        bodyWidth: 12,
        bodyHeight: 18,
        bodyOffsetX: 2,
        bodyOffsetY: 10
      });
    }
    
    throw new Error(`Failed to create player from asset ${asset}`);

  }

}

export default PlayerFactory;