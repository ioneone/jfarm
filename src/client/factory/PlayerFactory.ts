import { PlayerConfig } from '../objects/Player';
import Phaser from 'phaser';
import { PlayerAsset } from '../assets/PlayerAsset';
import Player from '../objects/Player';

/**
 * A factory for {@link Player}.
 * @class
 * @classdesc
 * Create a {@link Player} from {@link PlayerAsset} with `create()`. This 
 * makes the construction of player easy without worry about what {@link PlayerConfig}
 * to pass in.
 */
class PlayerFactory
{

  /**
   * Constructs player
   * @param {PlayerAsset} asset - the asset to create the player from
   */
  public static create(scene: Phaser.Scene, x: number, y: number, asset: PlayerAsset): Player
  {
    if (asset === PlayerAsset.ElfFemale)
    {
      return new Player(scene, x, y, {
        asset: asset,
        bodyWidth: 16,
        bodyHeight: 16,
        bodyOffsetX: 0,
        bodyOffsetY: 12
      });
    }
    else if (asset === PlayerAsset.ElfMale)
    {
      return new Player(scene, x, y, {
        asset: asset,
        bodyWidth: 16,
        bodyHeight: 18,
        bodyOffsetX: 0,
        bodyOffsetY: 10
      });
    }
    else
    {
      throw new Error(`Failed to create player from asset ${asset}`);
    }
  }

}

export default PlayerFactory;