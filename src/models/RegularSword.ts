import WeaponModel from "./WeaponModel";
import Assets from '../assets/Assets';

/**
 * A weapon model for {@link WeaponAsset#RegularSword}.
 * @class
 * @classdesc
 * This class defines the stats for {@link WeaponAsset#RegularSword}.
 */
class RegularSword extends WeaponModel
{
  constructor()
  {
    super(Assets.Asset.Weapon.RegularSword, 10);
  }
}

export default RegularSword;