import { WeaponAsset } from '../assets/WeaponAsset';
import WeaponModel from "./WeaponModel";

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
    super(WeaponAsset.Axe, 14);
  }
}

export default Axe;