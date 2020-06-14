import { WeaponAsset } from '../assets/WeaponAsset';
import WeaponModel from '../models/WeaponModel';
import RegularSword from '../models/RegularSword';
import Hammer from '../models/Hammer';
import Axe from '../models/Axe';

/**
 * A factory for {@link WeaponModel}.
 * @class
 * @classdesc
 * Create a {@link WeaponModel} from {@link WeaponAsset} with `create()`. This 
 * makes the construction of weapon model easy without worry about what parameters
 * of the weapon stats to pass.
 */
class WeaponModelFactory
{
  /**
   * Constructs a data structure that represents a weapon.
   * @param {WeaponAsset} asset - the asset to create the model from
   */
  public static create(asset: WeaponAsset): WeaponModel
  {
    if (asset === WeaponAsset.RegularSword)
    {
      return new RegularSword();
    }
    else if (asset === WeaponAsset.Hammer)
    {
      return new Hammer();
    }
    else if (asset === WeaponAsset.Axe)
    {
      return new Axe();
    }
    else
    {
      throw new Error(`Failed to create weapon model from asset ${asset}`);
    }
  }
}

export default WeaponModelFactory;