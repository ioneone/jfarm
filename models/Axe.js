"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WeaponAsset_1 = require("../assets/WeaponAsset");
const WeaponModel_1 = __importDefault(require("./WeaponModel"));
/**
 * A weapon model for {@link WeaponAsset#Axe}.
 * @class
 * @classdesc
 * This class defines the stats for {@link WeaponAsset#Axe}.
 */
class Axe extends WeaponModel_1.default {
    constructor() {
        super(WeaponAsset_1.WeaponAsset.Axe, 14);
    }
}
exports.default = Axe;
//# sourceMappingURL=Axe.js.map