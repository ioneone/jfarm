import Phaser from 'phaser';
import { TiledTransitionObject } from '../scenes/TilemapScene';

/**
 * Custom properties of scene transition obejct
 * @interface
 */
export interface SceneTransitionData
{
  destinationScene: string;
  destinationXInTiles: number;
  destinationYInTiles: number;
  destinationLevel: number;
  tilemapFileNamePrefix: string;
  tilesetFileName: string;
}

/**
 * An Phaser representation of transition object from Tiled map. This will be used
 * for overlap detection with the player.
 * @class
 * @classdesc
 * ...
 */
class SceneTransitionObject extends Phaser.GameObjects.Rectangle
{

  // the id of the scene to transition into
  private destinationScene?: string;

  // the x coordinate in tiles to spawn the player in the next scene
  private destinationXInTiles?: number;

  // the y coordinate in tiles to spawn the player in the next scene
  private destinationYInTiles?: number;

  // the level of the dungeon in the next scene
  private destinationLevel?: number

  // file name prefix for the tilemap
  private tilemapFileNamePrefix?: string;

  // file name of the tileset for the tilemap
  private tilesetFileName?: string;

  /**
   * @param {Phaser.Scene} scene - The scene this object belongs to
   * @param {TiledTransitionObject} tiledTransitionObject - The raw transition object from Tiled program
   */
  constructor(scene: Phaser.Scene, tiledTransitionObject: TiledTransitionObject)
  {
    super(scene, tiledTransitionObject.x, tiledTransitionObject.y);
    tiledTransitionObject.properties.forEach(property =>{
      if (property.name.localeCompare("DestinationLevel") === 0)
      {
        this.destinationLevel = property.value as number;
      }
      else if (property.name.localeCompare("DestinationScene") === 0)
      {
        this.destinationScene = property.value as string;
      }
      else if (property.name.localeCompare("DestinationXInTiles") === 0)
      {
        this.destinationXInTiles = property.value as number;
      }
      else if (property.name.localeCompare("DestinationYInTiles") === 0)
      {
        this.destinationYInTiles = property.value as number;
      }
      else if (property.name.localeCompare("TilemapFileNamePrefix") === 0)
      {
        this.tilemapFileNamePrefix = property.value as string;
      }
      else if (property.name.localeCompare("TilesetFileName") === 0)
      {
        this.tilesetFileName = property.value as string;
      }
    });
    this.setOrigin(0);
    this.setSize(tiledTransitionObject.width, tiledTransitionObject.height);
  }

  /**
   * Get the data needed for starting next scene
   * @return {SceneTransitionData} - the data representation of this object
   */
  public toData(): SceneTransitionData
  {
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

export default SceneTransitionObject;