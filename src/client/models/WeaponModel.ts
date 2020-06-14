import { WeaponAsset } from '../assets/WeaponAsset';

/**
 * A data structure that represents all the information about a weapon.
 * @class
 * @classdesc
 * You can extend this class to define a specific weapon.
 * @see {@link RegularSword}
 * @see {@link Hammer}
 * @see {@link Axe}
 */
class WeaponModel
{

  // the texture id for this weapon model
  public readonly asset: WeaponAsset;

  // the damage it deals with enemy
  public readonly power: number;

  /**
   * @param {WeaponAsset} asset - the texture id for this weapon model
   * @param {number} power - the damage it deals with enemy 
   */
  constructor(asset: WeaponAsset, power: number)
  {
    this.asset = asset;
    this.power = power;
  }
}

export default WeaponModel;