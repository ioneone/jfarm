"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FontAsset_1 = require("../assets/FontAsset");
const phaser_1 = __importDefault(require("phaser"));
const LevelScene_1 = __importDefault(require("./LevelScene"));
const UIScene_1 = __importDefault(require("./UIScene"));
const BaseScene_1 = __importDefault(require("./BaseScene"));
/**
 * The scene the player sees when died.
 * @class
 * @classdesc
 * Prompts the player to restart the game.
 */
class GameOverScene extends BaseScene_1.default {
    constructor() {
        super(GameOverScene.KEY);
    }
    /**
     * Scenes can have a init method, which is always called before the Scenes
     * preload method, allowing you to initialize data that the Scene may need.
     *
     * The data is passed when the scene is started/launched by the scene manager.
     *
     * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
     * @param {any} data - the data being passed when the scene manager starts this scene
     */
    init(data) {
    }
    /**
     * Scenes can have a preload method, which is always called before the Scenes
     * create method, allowing you to preload assets that the Scene may need.
     */
    preload() {
        // load font
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
        this.keyEnter = this.input.keyboard.addKey('ENTER');
        const title = "GAME OVER";
        const titleFontSize = 24;
        const helperText = "Press Enter to Restart";
        const helperTextFontSize = 12;
        const spacingBetweenTitleAndHelperText = 24;
        // add texts in the center of the screen
        const titleBitmapText = this.add.bitmapText(this.cameras.main.centerX, this.cameras.main.centerY, FontAsset_1.FontAsset.PressStart2P, title, titleFontSize).setOrigin(0.5, 0.5);
        this.add.bitmapText(this.cameras.main.centerX, titleBitmapText.y + titleBitmapText.height / 2 + spacingBetweenTitleAndHelperText, FontAsset_1.FontAsset.PressStart2P, helperText, helperTextFontSize).setOrigin(0.5, 0.5);
    }
    /**
     * This method is called once per game step while the scene is running.
     * @param {number} time - the current time
     * @param {number} delta - the delta time in ms since the last frame
     */
    update(time, delta) {
        if (phaser_1.default.Input.Keyboard.JustDown(this.keyEnter)) {
            this.scene.start(LevelScene_1.default.KEY, {
                destinationScene: LevelScene_1.default.KEY,
                destinationXInTiles: 9,
                destinationYInTiles: 16,
                destinationLevel: 1,
                tilemapFileNamePrefix: "level",
                tilesetFileName: "tiles"
            });
            this.scene.start(UIScene_1.default.KEY);
        }
    }
}
// the unique id of this scene
GameOverScene.KEY = "GameOverScene";
exports.default = GameOverScene;
//# sourceMappingURL=GameOverScene.js.map