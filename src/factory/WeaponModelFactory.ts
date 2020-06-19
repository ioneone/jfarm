import WeaponModel from '../models/WeaponModel';
import RegularSword from '../models/RegularSword';
import Hammer from '../models/Hammer';
import Axe from '../models/Axe';
import Assets from '../assets/Assets';

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
   * @param {Assets.Asset.Weapon} asset - the asset to create the model from
   */
  public static create(asset: Assets.Asset.Weapon): WeaponModel
  {
    if (asset === Assets.Asset.Weapon.RegularSword)
    {
      return new RegularSword();
    }
    
    if (asset === Assets.Asset.Weapon.Hammer)
    {
      return new Hammer();
    }
     
    if (asset === Assets.Asset.Weapon.Axe)
    {
      return new Axe();
    }

    throw new Error(`Failed to create weapon model from asset ${asset}`);

  }
}

export default WeaponModelFactory;