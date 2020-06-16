import SceneTransitionObject, { SceneTransitionData } from '../objects/SceneTransitionObject';
import Phaser from 'phaser';
import { TiledTransitionObject } from '../scenes/TilemapScene';

/**
 * Custom properties of scene transition obejct
 * @interface
 */
export interface LevelSceneTransitionData extends SceneTransitionData
{
  destinationLevel: number;
  tilemapFileNamePrefix: string;
  tilesetFileName: string;
}

/**
 * An Phaser representation of transition object from Tiled map.
 * @class
 * @classdesc
 * This will be used for overlap detection with the player.
 */
class LevelSceneTransitionObject extends SceneTransitionObject
{

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
    super(scene, tiledTransitionObject);

    tiledTransitionObject.properties.forEach(property =>{
      if (property.name === "DestinationLevel")
      {
        this.destinationLevel = property.value as number;
      }
      else if (property.name === "TilemapFileNamePrefix")
      {
        this.tilemapFileNamePrefix = property.value as string;
      }
      else if (property.name === "TilesetFileName")
      {
        this.tilesetFileName = property.value as string;
      }
    });
  }

  /**
   * Get the data needed for starting next scene
   * @return {LevelSceneTransitionData} - the data representation of this object
   */
  public toSceneTransitionData(): LevelSceneTransitionData
  {
    return {
      ...super.toSceneTransitionData(),
      destinationLevel: this.destinationLevel || 0,
      tilemapFileNamePrefix: this.tilemapFileNamePrefix || "",
      tilesetFileName: this.tilesetFileName || ""
    };
  }

}

export default LevelSceneTransitionObject;