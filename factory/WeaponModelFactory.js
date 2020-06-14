"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WeaponAsset_1 = require("../assets/WeaponAsset");
const RegularSword_1 = __importDefault(require("../models/RegularSword"));
const Hammer_1 = __importDefault(require("../models/Hammer"));
const Axe_1 = __importDefault(require("../models/Axe"));
/**
 * A factory for {@link WeaponModel}.
 * @class
 * @classdesc
 * Create a {@link WeaponModel} from {@link WeaponAsset} with `create()`. This
 * makes the construction of weapon model easy without worry about what parameters
 * of the weapon stats to pass.
 */
class WeaponModelFactory {
    /**
     * Constructs a data structure that represents a weapon.
     * @param {WeaponAsset} asset - the asset to create the model from
     */
    static create(asset) {
        if (asset === WeaponAsset_1.WeaponAsset.RegularSword) {
            return new RegularSword_1.default();
        }
        else if (asset === WeaponAsset_1.WeaponAsset.Hammer) {
            return new Hammer_1.default();
        }
        else if (asset === WeaponAsset_1.WeaponAsset.Axe) {
            return new Axe_1.default();
        }
        else {
            throw new Error(`Failed to create weapon model from asset ${asset}`);
        }
    }
}
exports.default = WeaponModelFactory;
//# sourceMappingURL=WeaponModelFactory.js.map