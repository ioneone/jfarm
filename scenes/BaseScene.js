"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
/**
 * The base class for all the scenes.
 * @class
 * @clasdesc
 * This class includes helper functions needed for most of the scenes.
 */
class BaseScene extends phaser_1.default.Scene {
    /**
     * @param {string} key - the unique id of the scene
     */
    constructor(key) {
        super(key);
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
    }
    /**
     * This method is called once per game step while the scene is running.
     * @param {number} time - the current time
     * @param {number} delta - the delta time in ms since the last frame
     */
    update(time, delta) {
    }
    /**
     * If the key is `foo`, it assumes the file path to the image is `foo.png`
     * and the file path to the normal map is `foo_n.png`.
     * @param {string} key - the unique id of the resource
     */
    createDefaultImageFileConfig(key) {
        return {
            key: key,
            url: `${key}.png`,
            normalMap: `${key}_n.png`
        };
    }
    /**
     * If the key is `foo`, it assumes the file path to the texture image is
     * `foo.png`, the file path to normal map is `foo_n.png`, and the file path
     * to the atlas is `foo.json`.
     * @param {string} key - the unique id of the resource
     */
    createDefaultAtlasJSONFileConfig(key) {
        return {
            key: key,
            textureURL: `${key}.png`,
            normalMap: `${key}_n.png`,
            atlasURL: `${key}.json`
        };
    }
    /**
     * If the key is `foo`, it assumes the file path to the audio file is
     * `foo.wav`.
     * @param {string} key - the unique id of the resource
     */
    createDefaultAudioFileConfig(key) {
        return {
            key: key,
            // @ts-ignore
            url: `${key}.wav`
        };
    }
}
exports.default = BaseScene;
//# sourceMappingURL=BaseScene.js.map