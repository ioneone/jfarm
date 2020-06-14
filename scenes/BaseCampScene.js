"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FontAsset_1 = require("../assets/FontAsset");
const AudioAsset_1 = require("../assets/AudioAsset");
const WeaponAsset_1 = require("../assets/WeaponAsset");
const PlayerAsset_1 = require("../assets/PlayerAsset");
const TilemapScene_1 = __importDefault(require("./TilemapScene"));
const PlayerFactory_1 = __importDefault(require("../factory/PlayerFactory"));
/**
 * TODO: Work In Progress.
 */
class BaseCampScene extends TilemapScene_1.default {
    constructor() {
        super(BaseCampScene.KEY);
    }
    /**
     * Scenes can have a preload method, which is always called before the Scenes
     * create method, allowing you to preload assets that the Scene may need.
     */
    preload() {
        super.preload();
        this.load.atlas(PlayerAsset_1.PlayerAsset.ElfFemale);
        this.load.atlas(PlayerAsset_1.PlayerAsset.ElfMale);
        this.load.image(WeaponAsset_1.WeaponAsset.RegularSword);
        this.load.image(WeaponAsset_1.WeaponAsset.Axe);
        this.load.image(WeaponAsset_1.WeaponAsset.Hammer);
        this.load.audio(this.createDefaultAudioFileConfig(AudioAsset_1.AudioAsset.Swing));
        this.load.audio(this.createDefaultAudioFileConfig(AudioAsset_1.AudioAsset.ThreeFootSteps));
        this.load.bitmapFont(FontAsset_1.FontAsset.PressStart2P);
    }
    /**
     * Scenes can have a create method, which is always called after the Scenes
     * init and preload methods, allowing you to create assets that the Scene may need.
     *
     * The data is passed when the scene is started/launched by the scene manager.
     *
     * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
     * @param {any} data - the data being passed when the scene manager starts this scene
     */
    create(data) {
        var _a;
        super.create(data);
        // add player to the scene
        this.player = PlayerFactory_1.default.create(this, 100, 100, PlayerAsset_1.PlayerAsset.ElfMale);
        this.player.setAttackEnabled(false);
        // add collision detection between player and collidable layer
        this.physics.add.collider(this.player, this.middleLayer);
        this.physics.add.collider(this.player, this.bottomLayer);
        // configure the camera to follow the player
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        // Bring top layer to the front.
        // Depth is 0 (unsorted) by default, which perform the rendering 
        // in the order it was added to the scene.
        (_a = this.topLayer) === null || _a === void 0 ? void 0 : _a.setDepth(1);
        // need at least one light source
        // this.light = this.lights.addLight(0, 0, 0);
        this.lights.enable().setAmbientColor(0xffffff);
    }
    /**
     * This method is called once per game step while the scene is running.
     * @param {number} time - the current time
     * @param {number} delta - the delta time in ms since the last frame
     */
    update(time, delta) {
        var _a;
        super.update(time, delta);
        (_a = this.player) === null || _a === void 0 ? void 0 : _a.update();
    }
    /**
     * Get the unique key of the tile map. The `key` of a tile map is just its
     * file path excluding the extension. If your tile map is located at
     * `path/to/tile/map/foo.json`, then the key should be `path/to/tile/map/foo`.
     * @param {SceneTransitionData} data - the data the scene received for initialization
     * @return {string} - the tile map key
     */
    getTilemapKey(data) {
        return "assets/map/basecamp";
    }
    /**
     * Get the unique key of the tile set. The `key` of a tile set is just its
     * file path excluding the extension. If your tile set is located at
     * `path/to/tile/set/foo.png`, then the key should be `path/to/tile/set/foo`.
     * The tile set normal map must be located at `path/to/tile/set/foo_n.png`.
     * @param {SceneTransitionData} data - the data the scene received for initialization
     * @return {string} - the tile set key
     */
    getTilesetKey(data) {
        return "assets/map/tiles";
    }
}
BaseCampScene.KEY = "BaseCampScene";
exports.default = BaseCampScene;
//# sourceMappingURL=BaseCampScene.js.map