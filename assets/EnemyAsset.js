"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyAssetData = exports.EnemyAsset = void 0;
/**
 * Collection of the absolute or relative URLs to load the enemy spritesheets from.
 * Every enemy spritesheet must follow a specific requirement. See {@link EnemyAssetData}
 * for more details.
 * @readonly
 * @see EnemyAssetData
 * @enum {string}
 */
var EnemyAsset;
(function (EnemyAsset) {
    EnemyAsset["OrcWarrior"] = "assets/enemies/orc_warrior/orc_warrior";
    EnemyAsset["IceZombie"] = "assets/enemies/ice_zombie/ice_zombie";
    EnemyAsset["Chort"] = "assets/enemies/chort/chort";
})(EnemyAsset = exports.EnemyAsset || (exports.EnemyAsset = {}));
/**
 * Common attributes for {@link EnemyAsset}
 * @readonly
 * @enum {string | number}
 */
var EnemyAssetData;
(function (EnemyAssetData) {
    EnemyAssetData["IdleAnimationPrefix"] = "idle_anim_f";
    EnemyAssetData["RunAnimationPrefix"] = "run_anim_f";
    EnemyAssetData[EnemyAssetData["IdleAnimationFrameEnd"] = 3] = "IdleAnimationFrameEnd";
    EnemyAssetData[EnemyAssetData["RunAnimationFrameEnd"] = 3] = "RunAnimationFrameEnd";
})(EnemyAssetData = exports.EnemyAssetData || (exports.EnemyAssetData = {}));
//# sourceMappingURL=EnemyAsset.js.map