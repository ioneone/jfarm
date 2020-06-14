"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EnemyAsset_1 = require("../assets/EnemyAsset");
const Enemy_1 = __importDefault(require("../objects/Enemy"));
/**
 * A factory for {@link Enemy}.
 * @class
 * @classdesc
 * Create a {@link Enemy} from {@link EnemyAsset} with `create()`. This
 * makes the construction of enemy easy without worry about what {@link EnemyConfig}
 * to pass in.
 */
class EnemyFactory {
    /**
     * Constructs enemy
     * @param {EnemyAsset} asset - the asset to create the enemy from
     */
    static create(scene, x, y, asset) {
        if (asset === EnemyAsset_1.EnemyAsset.OrcWarrior) {
            return new Enemy_1.default(scene, x, y, {
                asset: asset,
                attackDamage: 1,
                knockBackDuration: 200,
                attackInterval: 800,
                vision: 64,
                hitPoints: 100
            });
        }
        else if (asset === EnemyAsset_1.EnemyAsset.IceZombie) {
            return new Enemy_1.default(scene, x, y, {
                asset: asset,
                attackDamage: 1,
                knockBackDuration: 200,
                attackInterval: 800,
                vision: 64,
                hitPoints: 100
            });
        }
        else if (asset === EnemyAsset_1.EnemyAsset.Chort) {
            return new Enemy_1.default(scene, x, y, {
                asset: asset,
                attackDamage: 1,
                knockBackDuration: 200,
                attackInterval: 800,
                vision: 64,
                hitPoints: 100
            });
        }
        else {
            throw new Error(`Failed to create enemy from asset ${asset}`);
        }
    }
}
exports.default = EnemyFactory;
//# sourceMappingURL=EnemyFactory.js.map