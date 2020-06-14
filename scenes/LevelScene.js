"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AudioAsset_1 = require("./../assets/AudioAsset");
const WeaponAsset_1 = require("../assets/WeaponAsset");
const EnemyAsset_1 = require("../assets/EnemyAsset");
const PlayerAsset_1 = require("../assets/PlayerAsset");
const TilemapScene_1 = __importStar(require("./TilemapScene"));
const Enemy_1 = require("../objects/Enemy");
const PlayerFactory_1 = __importDefault(require("../factory/PlayerFactory"));
const EnemyFactory_1 = __importDefault(require("../factory/EnemyFactory"));
/**
 * The scene for the dugeon.
 * @class
 * @classdesc
 * A dungeon is a collection of level scenes. Make sure your transition object
 * exported from Tiled program has all the properties specified in {@link SceneTransitionData}.
 * Then it automatically takes care of loading the next level scene.
 */
class LevelScene extends TilemapScene_1.default {
    constructor() {
        super(LevelScene.KEY);
        this.bright = false;
    }
    /**
     * Scenes can have a init method, which is always called before the Scenes
     * preload method, allowing you to initialize data that the Scene may need.
     *
     * The data is passed when the scene is started/launched by the scene manager.
     *
     * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
     * @param {SceneTransitionData} data - the data being passed when the scene manager starts this scene
     */
    init(data) {
        super.init(data);
        this.bright = false;
    }
    /**
     * Scenes can have a preload method, which is always called before the Scenes
     * create method, allowing you to preload assets that the Scene may need.
     */
    preload() {
        super.preload();
        this.load.atlas(PlayerAsset_1.PlayerAsset.ElfFemale);
        this.load.atlas(PlayerAsset_1.PlayerAsset.ElfMale);
        this.load.atlas(this.createDefaultAtlasJSONFileConfig(EnemyAsset_1.EnemyAsset.OrcWarrior));
        this.load.atlas(this.createDefaultAtlasJSONFileConfig(EnemyAsset_1.EnemyAsset.IceZombie));
        this.load.atlas(this.createDefaultAtlasJSONFileConfig(EnemyAsset_1.EnemyAsset.Chort));
        this.load.image(WeaponAsset_1.WeaponAsset.RegularSword);
        this.load.image(WeaponAsset_1.WeaponAsset.Axe);
        this.load.image(WeaponAsset_1.WeaponAsset.Hammer);
        this.load.audio(this.createDefaultAudioFileConfig(AudioAsset_1.AudioAsset.DamagePlayer));
        this.load.audio(this.createDefaultAudioFileConfig(AudioAsset_1.AudioAsset.Swing));
        this.load.audio(this.createDefaultAudioFileConfig(AudioAsset_1.AudioAsset.ThreeFootSteps));
        this.load.audio(this.createDefaultAudioFileConfig(AudioAsset_1.AudioAsset.EnemyHit));
    }
    /**
     * Scenes can have a create method, which is always called after the Scenes
     * init and preload methods, allowing you to create assets that the Scene may need.
     *
     * The data is passed when the scene is started/launched by the scene manager.
     *
     * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
     * @param {SceneTransitionData} data - the data being passed when the scene manager starts this scene
     */
    create(data) {
        var _a, _b;
        super.create(data);
        // add player to the scene
        this.player = PlayerFactory_1.default.create(this, data.destinationXInTiles * 16, data.destinationYInTiles * 16, PlayerAsset_1.PlayerAsset.ElfMale);
        // add enemies to the scene
        this.enemies = this.add.group();
        (_a = this.tilemap) === null || _a === void 0 ? void 0 : _a.getObjectLayer(TilemapScene_1.TileLayer.Object).objects.forEach(object => {
            var _a, _b, _c;
            if (object.name === "OrcWarrior") {
                (_a = this.enemies) === null || _a === void 0 ? void 0 : _a.add(EnemyFactory_1.default.create(this, object.x, object.y, EnemyAsset_1.EnemyAsset.OrcWarrior));
            }
            else if (object.name === "IceZombie") {
                (_b = this.enemies) === null || _b === void 0 ? void 0 : _b.add(EnemyFactory_1.default.create(this, object.x, object.y, EnemyAsset_1.EnemyAsset.IceZombie));
            }
            else if (object.name === "Chort") {
                (_c = this.enemies) === null || _c === void 0 ? void 0 : _c.add(EnemyFactory_1.default.create(this, object.x, object.y, EnemyAsset_1.EnemyAsset.Chort));
            }
        });
        // add collision detection between player and collidable layer
        this.physics.add.collider(this.player, this.middleLayer);
        this.physics.add.collider(this.player, this.bottomLayer);
        // add collision detection between enemy and collidable layer
        this.physics.add.collider(this.enemies, this.middleLayer);
        this.physics.add.collider(this.enemies, this.bottomLayer);
        // add collision detection between player and enemy
        this.physics.add.collider(this.player, this.enemies, (_, object2) => {
            const enemy = object2;
            enemy.setUpdateState(Enemy_1.EnemyUpdateState.AttackPlayer);
            // prevent enemy from pushing the player
            enemy.getBody().setVelocity(0, 0);
        });
        // add overlap detection between player attack and enemy
        this.physics.add.overlap(this.player.getWeapon(), this.enemies, (object1, object2) => {
            const weapon = object1;
            const enemy = object2;
            const knockBackVelocity = enemy.getCenter().subtract(weapon.getCenter()).normalize().scale(200);
            enemy.knockBack(knockBackVelocity);
            enemy.receiveDamage(weapon.getModel().power);
            this.sound.play(AudioAsset_1.AudioAsset.EnemyHit);
            this.cameras.main.shake(100, 0.001);
        }, (object1, object2) => {
            const weapon = object1;
            const enemy = object2;
            return weapon.getBody().angularVelocity !== 0 && enemy.getUpdateState() !== Enemy_1.EnemyUpdateState.KnockBack;
        });
        // add overlap detection between player and transition objects
        this.physics.add.overlap(this.player, this.transitionObjectGroup, (object1, object2) => {
            const player = object1;
            player.getBody().setEnable(false);
            const nextSceneTransitionData = object2.toData();
            this.sound.play(AudioAsset_1.AudioAsset.ThreeFootSteps);
            this.cameras.main.fadeOut(200, 0, 0, 0, (_, progress) => {
                if (progress === 1) {
                    this.scene.start(nextSceneTransitionData.destinationScene, nextSceneTransitionData);
                }
            });
        });
        // configure the camera to follow the player
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        // Bring top layer to the front.
        // Depth is 0 (unsorted) by default, which perform the rendering 
        // in the order it was added to the scene.
        (_b = this.topLayer) === null || _b === void 0 ? void 0 : _b.setDepth(1);
        // @ts-ignore
        this.light = this.lights.addLight(0, 0, 150);
        this.lights.enable().setAmbientColor(0x404040);
    }
    /**
     * This method is called once per game step while the scene is running.
     * @param {number} time - the current time
     * @param {number} delta - the delta time in ms since the last frame
     */
    update(time, delta) {
        var _a, _b, _c;
        super.update(time, delta);
        (_a = this.player) === null || _a === void 0 ? void 0 : _a.update();
        (_b = this.enemies) === null || _b === void 0 ? void 0 : _b.getChildren().forEach(child => child.update(this.player, delta));
        //@ts-ignore
        this.light.x = (_c = this.player) === null || _c === void 0 ? void 0 : _c.x;
        //@ts-ignore
        this.light.y = this.player.y;
    }
    /**
     * Get the unique key of the tile map. The `key` of a tile map is just its
     * file path excluding the extension. If your tile map is located at
     * `path/to/tile/map/foo.json`, then the key should be `path/to/tile/map/foo`.
     * @override
     * @param {SceneTransitionData} data - the data the scene received for initialization
     * @return {string} - the tile map key
     */
    getTilemapKey(data) {
        return "assets/map/" + data.tilemapFileNamePrefix + data.destinationLevel.toString();
    }
    /**
     * Get the unique key of the tile set. The `key` of a tile set is just its
     * file path excluding the extension. If your tile set is located at
     * `path/to/tile/set/foo.png`, then the key should be `path/to/tile/set/foo`.
     * @override
     * @param {SceneTransitionData} data - the data the scene received for initialization
     * @return {string} - the tile set key
     */
    getTilesetKey(data) {
        return "assets/map/" + data.tilesetFileName;
    }
    /**
     * The graphics shows useful information for debugging when the debug mode
     * is turned on.
     * @override
     */
    toggleDebugMode() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        super.toggleDebugMode();
        // turn off the light
        if (this.bright) {
            (_a = this.enemies) === null || _a === void 0 ? void 0 : _a.getChildren().forEach(child => {
                child.setPipeline('Light2D');
            });
            (_b = this.bottomLayer) === null || _b === void 0 ? void 0 : _b.setPipeline('Light2D');
            (_c = this.middleLayer) === null || _c === void 0 ? void 0 : _c.setPipeline('Light2D');
            (_d = this.topLayer) === null || _d === void 0 ? void 0 : _d.setPipeline('Light2D');
        }
        // turn on the light
        else {
            (_e = this.enemies) === null || _e === void 0 ? void 0 : _e.getChildren().forEach(child => {
                child.resetPipeline();
            });
            (_f = this.bottomLayer) === null || _f === void 0 ? void 0 : _f.resetPipeline();
            (_g = this.middleLayer) === null || _g === void 0 ? void 0 : _g.resetPipeline();
            (_h = this.topLayer) === null || _h === void 0 ? void 0 : _h.resetPipeline();
        }
        this.bright = !this.bright;
    }
}
// the unique id of this scene
LevelScene.KEY = "LevelScene";
exports.default = LevelScene;
//# sourceMappingURL=LevelScene.js.map