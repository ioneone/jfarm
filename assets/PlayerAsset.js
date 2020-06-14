"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerAssetData = exports.PlayerAsset = void 0;
/**
 * Collection of the absolute or relative URLs to load the player spritesheets from.
 * Every player spritesheet must follow a specific requirement. See {@link PlayerAssetData}
 * for more details.
 * @readonly
 * @enum {string}
 */
var PlayerAsset;
(function (PlayerAsset) {
    PlayerAsset["ElfFemale"] = "assets/players/elf_f/elf_f";
    PlayerAsset["ElfMale"] = "assets/players/elf_m/elf_m";
})(PlayerAsset = exports.PlayerAsset || (exports.PlayerAsset = {}));
/**
 * Common attributes for {@link PlayerAsset}
 * @readonly
 * @enum {string | number}
 */
var PlayerAssetData;
(function (PlayerAssetData) {
    PlayerAssetData["IdleAnimationPrefix"] = "idle_anim_f";
    PlayerAssetData["RunAnimationPrefix"] = "run_anim_f";
    PlayerAssetData[PlayerAssetData["IdleAnimationFrameEnd"] = 3] = "IdleAnimationFrameEnd";
    PlayerAssetData[PlayerAssetData["RunAnimationFrameEnd"] = 3] = "RunAnimationFrameEnd";
    PlayerAssetData["HitFrameKey"] = "hit_anim_f0";
})(PlayerAssetData = exports.PlayerAssetData || (exports.PlayerAssetData = {}));
//# sourceMappingURL=PlayerAsset.js.map