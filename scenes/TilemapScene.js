"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TileLayer = void 0;
const SceneTransitionObject_1 = __importDefault(require("../objects/SceneTransitionObject"));
const phaser_1 = __importDefault(require("phaser"));
const AnimatedTile_1 = __importDefault(require("../objects/AnimatedTile"));
const BaseScene_1 = __importDefault(require("./BaseScene"));
/**
 * The name of tile layers of the tilemap exported from Tiled program.
 * @see TilemapScene
 * @readonly
 * @enum {string}
 */
var TileLayer;
(function (TileLayer) {
    TileLayer["Top"] = "TopLayer";
    TileLayer["Object"] = "ObjectLayer";
    TileLayer["Middle"] = "MiddleLayer";
    TileLayer["Bottom"] = "BottomLayer";
    TileLayer["Transition"] = "TransitionLayer";
})(TileLayer = exports.TileLayer || (exports.TileLayer = {}));
/**
 * Responsible for reading tiledmap and rendering the world.
 * @class
 * @classdesc
 * The tilemap must have the structure as follows:
 * - TopLayer (non-collidable)
 * - ObjectLayer
 * - MiddleLayer (collidable)
 * - BottomLayer (collidable)
 * - TransitionLayer
 * The lower layer will be rendered first. Use default name for tileset name.
 * (e.g. `path/to/file/foo.png` => `foo`)
 *
 * The tile map and tile set files should follow a convention. If the key of the
 * map is `foo`, then your tile map file must be located at `foo.json`,
 * the tile set file at `foo.png`, and the tile set normal map file at
 * `foo_n.png`.
 */
class TilemapScene extends BaseScene_1.default {
    /**
     * @param {string} key - the unique id of the scene
     */
    constructor(key) {
        super(key);
        this.animatedTiles = [];
    }
    /**
     * Scenes can have a init method, which is always called before the Scenes
     * preload method, allowing you to initialize data that the Scene may need.
     *
     * The data is passed when the scene is started/launched by the scene manager.
     *
     * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
     * @param {SceneTransitionData} data - the data being passed when the scene manager starts this scene
     * @override
     */
    init(data) {
        super.init(data);
        this.animatedTiles = [];
        this.sceneTransitionData = data;
    }
    /**
     * Scenes can have a preload method, which is always called before the Scenes
     * create method, allowing you to preload assets that the Scene may need.
     * @override
     */
    preload() {
        super.preload();
        // load tileset image
        this.load.image(this.createDefaultImageFileConfig(this.getTilesetKey(this.sceneTransitionData)));
        // load tilemap json data
        this.load.tilemapTiledJSON(this.getTilemapKey(this.sceneTransitionData));
    }
    /**
     * Scenes can have a create method, which is always called after the Scenes
     * init and preload methods, allowing you to create assets that the Scene may need.
     *
     * The data is passed when the scene is started/launched by the scene manager.
     *
     * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
     * @param {SceneTransitionData} data - the data being passed when the scene manager starts this scene
     * @override
     */
    create(data) {
        super.create(data);
        // parse tilemap json data to phaser tile map object
        this.tilemap = this.make.tilemap({
            key: this.getTilemapKey(this.sceneTransitionData)
        });
        // parse tileset image
        const tilesetKey = this.getTilesetKey(this.sceneTransitionData);
        const tilesetName = this.getDefaultTilesetName(tilesetKey);
        this.tileset = this.tilemap.addTilesetImage(tilesetName, tilesetKey);
        // create transition layer
        this.transitionObjectGroup = this.physics.add.staticGroup();
        const tiledTransitionObjects = this.tilemap.getObjectLayer(TileLayer.Transition).objects;
        tiledTransitionObjects.forEach(tiledTransitionObject => {
            var _a;
            (_a = this.transitionObjectGroup) === null || _a === void 0 ? void 0 : _a.add(new SceneTransitionObject_1.default(this, tiledTransitionObject));
        });
        // create bottom layer
        this.bottomLayer = this.tilemap.createDynamicLayer(TileLayer.Bottom, this.tileset, 0, 0).setPipeline('Light2D');
        this.bottomLayer.setCollisionByProperty({ collision: true });
        // create middle layer
        this.middleLayer = this.tilemap.createDynamicLayer(TileLayer.Middle, this.tileset, 0, 0).setPipeline('Light2D');
        this.middleLayer.setCollisionByProperty({ collision: true });
        // create top layer
        this.topLayer = this.tilemap.createDynamicLayer(TileLayer.Top, this.tileset, 0, 0).setPipeline('Light2D');
        // create animated tiles
        for (let key in this.tileset.tileData) {
            this.tilemap.layers.forEach(layer => {
                if (layer.tilemapLayer.type === "DynamicTilemapLayer") {
                    layer.data.forEach(tileRow => {
                        tileRow.forEach(tile => {
                            if ((tile.index - this.tileset.firstgid) === parseInt(key)) {
                                this.animatedTiles.push(new AnimatedTile_1.default(tile, this.tileset.tileData[key].animation, this.tileset.firstgid));
                            }
                        });
                    });
                }
            });
        }
        // get reference to the keyboard key
        this.keyI = this.input.keyboard.addKey('I');
        // setup debug mode
        this.debugGraphics = this.add.graphics().setAlpha(0.5);
        this.bottomLayer.renderDebug(this.debugGraphics, TilemapScene.RENDER_DEBUG_CONFIG);
        this.middleLayer.renderDebug(this.debugGraphics, TilemapScene.RENDER_DEBUG_CONFIG);
        // set world bounds
        this.physics.world.bounds.width = this.tilemap.widthInPixels;
        this.physics.world.bounds.height = this.tilemap.heightInPixels;
        // configure camera
        this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
        this.cameras.main.setZoom(2);
        // hide debug graphics
        this.physics.world.debugGraphic.setVisible(false);
        this.debugGraphics.setVisible(false);
    }
    /**
     * This method is called once per game step while the scene is running.
     * @param {number} time - the current time
     * @param {number} delta - the delta time in ms since the last frame
     * @override
     */
    update(time, delta) {
        super.update(time, delta);
        // toggle debug mode
        if (phaser_1.default.Input.Keyboard.JustDown(this.keyI)) {
            this.toggleDebugMode();
        }
        this.animatedTiles.forEach(tile => tile.update(delta));
    }
    /**
     * The graphics shows useful information for debugging when the debug mode
     * is turned on.
     */
    toggleDebugMode() {
        // toggle built in debug display
        this.physics.world.debugGraphic.setVisible(!this.physics.world.debugGraphic.visible);
        // toggle custom debug display
        this.debugGraphics.setVisible(!this.debugGraphics.visible);
    }
    /**
     * By default, Tiled uses the filename of the tileset image to reference the
     * tiles in that tileset. See {@link TilemapScene#getTilesetKey} for
     * definition of `tilesetKey`.
     *
     * @example
     * getDefaultTilesetName("path/to/tile/set/foo"); // return "foo"
     *
     * @param {string} tilesetKey - the tile set key
     */
    getDefaultTilesetName(tilesetKey) {
        // extract the filename
        return tilesetKey.slice(tilesetKey.lastIndexOf("/") + 1);
    }
}
// the style config for debug mode
TilemapScene.RENDER_DEBUG_CONFIG = {
    // Color of non-colliding tiles
    tileColor: null,
    // Color of colliding tiles
    collidingTileColor: new phaser_1.default.Display.Color(243, 134, 48, 255),
    // Color of colliding face edges
    faceColor: new phaser_1.default.Display.Color(40, 39, 37, 255)
};
exports.default = TilemapScene;
//# sourceMappingURL=TilemapScene.js.map