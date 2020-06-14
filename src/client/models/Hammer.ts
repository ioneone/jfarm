import WeaponModel from "./WeaponModel";
import { WeaponAsset } from '../assets/WeaponAsset';

/**
 * A weapon model for {@link WeaponAsset#Hammer}.
 * @class
 * @classdesc
 * This class defines the stats for {@link WeaponAsset#Hammer}.
 */
class Hammer extends WeaponModel
{
  constructor()
  {
    super(WeaponAsset.Hammer, 12);
  }
}

export default Hammer;