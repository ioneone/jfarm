"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerAsset_1 = require("../assets/PlayerAsset");
const Player_1 = __importDefault(require("../objects/Player"));
/**
 * A factory for {@link Player}.
 * @class
 * @classdesc
 * Create a {@link Player} from {@link PlayerAsset} with `create()`. This
 * makes the construction of player easy without worry about what {@link PlayerConfig}
 * to pass in.
 */
class PlayerFactory {
    /**
     * Constructs player
     * @param {PlayerAsset} asset - the asset to create the player from
     */
    static create(scene, x, y, asset) {
        if (asset === PlayerAsset_1.PlayerAsset.ElfFemale) {
            return new Player_1.default(scene, x, y, {
                asset: asset,
                bodyWidth: 16,
                bodyHeight: 16,
                bodyOffsetX: 0,
                bodyOffsetY: 12
            });
        }
        else if (asset === PlayerAsset_1.PlayerAsset.ElfMale) {
            return new Player_1.default(scene, x, y, {
                asset: asset,
                bodyWidth: 16,
                bodyHeight: 18,
                bodyOffsetX: 0,
                bodyOffsetY: 10
            });
        }
        else {
            throw new Error(`Failed to create player from asset ${asset}`);
        }
    }
}
exports.default = PlayerFactory;
//# sourceMappingURL=PlayerFactory.js.map