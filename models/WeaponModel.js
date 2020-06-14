"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A data structure that represents all the information about a weapon.
 * @class
 * @classdesc
 * You can extend this class to define a specific weapon.
 * @see {@link RegularSword}
 * @see {@link Hammer}
 * @see {@link Axe}
 */
class WeaponModel {
    /**
     * @param {WeaponAsset} asset - the texture id for this weapon model
     * @param {number} power - the damage it deals with enemy
     */
    constructor(asset, power) {
        this.asset = asset;
        this.power = power;
    }
}
exports.default = WeaponModel;
//# sourceMappingURL=WeaponModel.js.map