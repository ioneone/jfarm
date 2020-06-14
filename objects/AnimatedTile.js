"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Tile with animation.
 * @class
 * @classdesc
 * As of Phaser 3.23.0, animted tile is not supported. This is a simple implementation
 * of animating {@link Phaser.Tilemaps.Tile} and probably does not cover all
 * the edge cases. Assume the duration of animation is uniform for simplicity.
 */
class AnimatedTile {
    /**
     * @param {Phaser.Tilemaps.Tile} tile - the tile to animate
     * @param {TileAnimationData} tileAnimationData  - the animation data
     * @param {number} firstgid - the starting index of the first tile index the tileset of the tile contains
     */
    constructor(tile, tileAnimationData, firstgid) {
        this.tile = tile;
        this.tileAnimationData = tileAnimationData;
        this.firstgid = firstgid;
        this.elapsedTime = 0;
        // assuming the duration is uniform across all frames
        this.animationDuration = tileAnimationData[0].duration * tileAnimationData.length;
    }
    /**
     * Update the tile if necessary. This method should be called every frame.
     * @param {number} delta - the delta time in ms since the last frame
     */
    update(delta) {
        this.elapsedTime += delta;
        this.elapsedTime %= this.animationDuration;
        const animatonFrameIndex = Math.floor(this.elapsedTime / this.tileAnimationData[0].duration);
        this.tile.index = this.tileAnimationData[animatonFrameIndex].tileid + this.firstgid;
    }
}
exports.default = AnimatedTile;
//# sourceMappingURL=AnimatedTile.js.map