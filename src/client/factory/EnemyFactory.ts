import { EnemyConfig } from '../objects/Enemy';
import { EnemyAsset } from '../assets/EnemyAsset';
import Enemy from "../objects/Enemy";

/**
 * A factory for {@link Enemy}.
 * @class
 * @classdesc
 * Create a {@link Enemy} from {@link EnemyAsset} with `create()`. This 
 * makes the construction of enemy easy without worry about what {@link EnemyConfig} 
 * to pass in.
 */
class EnemyFactory
{
  /**
   * Constructs enemy
   * @param {EnemyAsset} asset - the asset to create the enemy from
   */
  public static create(scene: Phaser.Scene, x: number, y: number, asset: EnemyAsset): Enemy
  {
    if (asset === EnemyAsset.OrcWarrior)
    {
      return new Enemy(scene, x, y, {
        asset: asset,
        attackDamage: 1,
        knockBackDuration: 200,
        attackInterval: 800,
        vision: 64,
        hitPoints: 100
      });
    }
    else if (asset === EnemyAsset.IceZombie)
    {
      return new Enemy(scene, x, y, {
        asset: asset,
        attackDamage: 1,
        knockBackDuration: 200,
        attackInterval: 800,
        vision: 64,
        hitPoints: 100
      });
    }
    else if (asset === EnemyAsset.Chort)
    {
      return new Enemy(scene, x, y, {
        asset: asset,
        attackDamage: 1,
        knockBackDuration: 200,
        attackInterval: 800,
        vision: 64,
        hitPoints: 100
      });
    }
    else
    {
      throw new Error(`Failed to create enemy from asset ${asset}`)
    }
  }
}

export default EnemyFactory;