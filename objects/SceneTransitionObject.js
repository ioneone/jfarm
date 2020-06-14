"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
/**
 * An Phaser representation of transition object from Tiled map.
 * @class
 * @classdesc
 * This will be used for overlap detection with the player.
 */
class SceneTransitionObject extends phaser_1.default.GameObjects.Rectangle {
    /**
     * @param {Phaser.Scene} scene - The scene this object belongs to
     * @param {TiledTransitionObject} tiledTransitionObject - The raw transition object from Tiled program
     */
    constructor(scene, tiledTransitionObject) {
        super(scene, tiledTransitionObject.x, tiledTransitionObject.y);
        tiledTransitionObject.properties.forEach(property => {
            if (property.name === "DestinationLevel") {
                this.destinationLevel = property.value;
            }
            else if (property.name === "DestinationScene") {
                this.destinationScene = property.value;
            }
            else if (property.name === "DestinationXInTiles") {
                this.destinationXInTiles = property.value;
            }
            else if (property.name === "DestinationYInTiles") {
                this.destinationYInTiles = property.value;
            }
            else if (property.name === "TilemapFileNamePrefix") {
                this.tilemapFileNamePrefix = property.value;
            }
            else if (property.name === "TilesetFileName") {
                this.tilesetFileName = property.value;
            }
        });
        this.setOrigin(0);
        this.setSize(tiledTransitionObject.width, tiledTransitionObject.height);
    }
    /**
     * Get the data needed for starting next scene
     * @return {SceneTransitionData} - the data representation of this object
     */
    toData() {
        return {
            destinationScene: this.destinationScene || "",
            destinationXInTiles: this.destinationXInTiles || 0,
            destinationYInTiles: this.destinationYInTiles || 0,
            destinationLevel: this.destinationLevel || 0,
            tilemapFileNamePrefix: this.tilemapFileNamePrefix || "",
            tilesetFileName: this.tilesetFileName || ""
        };
    }
}
exports.default = SceneTransitionObject;
//# sourceMappingURL=SceneTransitionObject.js.map