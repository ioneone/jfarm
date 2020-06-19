import WeaponModel from "./WeaponModel";
import Assets from '../assets/Assets';

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
    super(Assets.Asset.Weapon.Hammer, 12);
  }
}

export default Hammer;