import Enemy from "../objects/Enemy";
import OrcWarrior from '../objects/OrcWarrior';
import IceZombie from '../objects/IceZombie';
import Chort from '../objects/Chort';

/**
 * A factory for {@link Enemy}.
 * @class
 * @classdesc
 * Create a {@link Enemy} from {@link Phaser.Types.Tilemaps.TiledObject} with `create()`. This 
 * makes the construction of enemy easy without worry about how to parse 
 * {@link Phaser.Types.Tilemaps.TiledObject} to an instance of {@link Enemy}.
 */
class EnemyFactory
{
  /**
   * Constructs enemy from `tiledObject`. Expect `tiledObject.name` to contain 
   * unique id of the type of Enemy to create.
   * @param {Phaser.Scene} scene - the scene this enemy belongs to
   * @param {Phaser.Types.Tilemaps.TiledObject} tiledObject - the tiled object to create the enemy from
   */
  public static create(scene: Phaser.Scene, tiledObject: Phaser.Types.Tilemaps.TiledObject): Enemy
  {
    if (tiledObject.name === "OrcWarrior")
    {
      return new OrcWarrior(scene, tiledObject.x!, tiledObject.y!);
    }
    
    if (tiledObject.name === "IceZombie")
    {
      return new IceZombie(scene, tiledObject.x!, tiledObject.y!);
    }
    
    if (tiledObject.name === "Chort")
    {
      return new Chort(scene, tiledObject.x!, tiledObject.y!);
    }
    
    throw new Error(`Failed to create enemy from tiled object ${tiledObject}`);

  }
}

export default EnemyFactory;