import Phaser from 'phaser';
import { TiledTransitionObject } from '../scenes/TilemapScene';

export interface SceneModel {}

export interface LevelSceneModel extends SceneModel
{
  destinationScene: string;
  destinationXInTiles: number;
  destinationYInTiles: number;
  destinationLevel: number;
  tilemapFileNamePrefix: string;
  tilesetFileName: string;
}

/**
 * SceneTransitionObject is an instantiation of
 * transition object from Tiled map. This will be used
 * with overlap detection with the player.
 */
class SceneTransitionObject extends Phaser.GameObjects.Rectangle
{

  // the id of the scene to transition into
  private destinationScene?: string;

  private destinationXInTiles?: number;

  private destinationYInTiles?: number;

  private destinationLevel?: number

  private tilemapFileNamePrefix?: string;

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

  public createSceneDataModel(): LevelSceneModel
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