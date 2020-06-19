import WeaponModel from "./WeaponModel";
import Assets from '../assets/Assets';

/**
 * A weapon model for {@link WeaponAsset#Axe}.
 * @class
 * @classdesc
 * This class defines the stats for {@link WeaponAsset#Axe}.
 */
class Axe extends WeaponModel
{
  constructor()
  {
    super(Assets.Asset.Weapon.Axe, 14);
  }
}

export default Axe;