"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WeaponModel_1 = __importDefault(require("./WeaponModel"));
const WeaponAsset_1 = require("../assets/WeaponAsset");
/**
 * A weapon model for {@link WeaponAsset#Hammer}.
 * @class
 * @classdesc
 * This class defines the stats for {@link WeaponAsset#Hammer}.
 */
class Hammer extends WeaponModel_1.default {
    constructor() {
        super(WeaponAsset_1.WeaponAsset.Hammer, 12);
    }
}
exports.default = Hammer;
//# sourceMappingURL=Hammer.js.map