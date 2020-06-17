import { EnemyAsset } from '../assets/EnemyAsset';
import Enemy from "../objects/Enemy";

/**
 * A factory for {@link Enemy}.
 * @class
 * @classdesc
 * Create a {@link Enemy} from {@link Phaser.Types.Tilemaps.TiledObject} with `create()`. This 
 * makes the construction of enemy easy without worry about what {@link EnemyConfig} 
 * to pass in.
 */
class EnemyFactory
{
  /**
   * Constructs enemy
   * @param {EnemyAsset} asset - the asset to create the enemy from
   */
  public static create(scene: Phaser.Scene, tiledObject: Phaser.Types.Tilemaps.TiledObject): Enemy
  {
    if (tiledObject.name === "OrcWarrior")
    {
      return new Enemy(scene, tiledObject.x!, tiledObject.y!, {
        asset: EnemyAsset.OrcWarrior,
        attackDamage: 1,
        knockBackDuration: 200,
        attackInterval: 800,
        vision: 64,
        maxHitPoints: 100
      });
    }
    else if (tiledObject.name === "IceZombie")
    {
      return new Enemy(scene, tiledObject.x!, tiledObject.y!, {
        asset: EnemyAsset.IceZombie,
        attackDamage: 1,
        knockBackDuration: 200,
        attackInterval: 800,
        vision: 64,
        maxHitPoints: 100
      });
    }
    else if (tiledObject.name === "Chort")
    {
      return new Enemy(scene, tiledObject.x!, tiledObject.y!, {
        asset: EnemyAsset.Chort,
        attackDamage: 1,
        knockBackDuration: 200,
        attackInterval: 800,
        vision: 64,
        maxHitPoints: 100
      });
    }
    
    throw new Error(`Failed to create enemy from tiled object ${tiledObject}`)

  }
}

export default EnemyFactory;