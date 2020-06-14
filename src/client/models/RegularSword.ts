import WeaponModel from "./WeaponModel";
import { WeaponAsset } from '../assets/WeaponAsset';

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
    super(WeaponAsset.RegularSword, 10);
  }
}

export default RegularSword;