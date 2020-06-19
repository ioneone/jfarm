import Phaser from 'phaser';
import { TiledTransitionObject } from '../scenes/TilemapScene';

/**
 * Custom properties of scene transition obejct. This is the data that will be 
 * passed for {@link TilemapScene} `init()` and `create()` methods.
 * @interface
 */
export interface SceneTransitionData
{
  // the id of the scene to transition into
  destinationScene?: string;
  // the x coordinate in tiles to spawn the player in the next scene
  destinationX?: number;
  // the y coordinate in tiles to spawn the player in the next scene
  destinationY?: number;
  // the key of the tilemap to load
  tilemapKey?: string;
  // the key of the tileset to load
  tilesetKey?: string;
}

/**
 * A Phaser representation of transition object from Tiled map.
 * @class
 * @classdesc
 * This will be used for overlap detection with the player. When the player 
 * overlaps with this object, you should trigger the scene transition.
 */
class SceneTransitionObject extends Phaser.GameObjects.Rectangle
{

  private sceneTransitionData: SceneTransitionData;

  /**
   * @param {Phaser.Scene} scene - The scene this object belongs to
   * @param {TiledTransitionObject} tiledTransitionObject - The raw transition object from Tiled program
   */
  constructor(scene: Phaser.Scene, tiledTransitionObject: TiledTransitionObject)
  {
    super(scene, tiledTransitionObject.x, tiledTransitionObject.y);

    this.sceneTransitionData = {};

    // Tiled uses top left corner as the origin
    this.setOrigin(0);
    this.setSize(tiledTransitionObject.width, tiledTransitionObject.height);

    // Parse Tiled transition object.
    // Make sure the names match the properties in Tiled.
    const tiledTransitionObjectPropertiesDictionary = this.convertTiledTransitionObjectPropertiesToDictionary(tiledTransitionObject.properties);
    this.sceneTransitionData.destinationScene = tiledTransitionObjectPropertiesDictionary["DestinationScene"] as string;
    this.sceneTransitionData.destinationX = tiledTransitionObjectPropertiesDictionary["DestinationX"] as number;
    this.sceneTransitionData.destinationY = tiledTransitionObjectPropertiesDictionary["DestinationY"] as number;
    this.sceneTransitionData.tilemapKey = tiledTransitionObjectPropertiesDictionary["TilemapKey"] as string;
    this.sceneTransitionData.tilesetKey = tiledTransitionObjectPropertiesDictionary["TilesetKey"] as string;
  }

  /**
   * Get the data needed for starting next scene. This is the data to pass 
   * for a scene's initialization.
   * @return {SceneTransitionData} - the data representation of this object
   */
  public getSceneTransitionData(): SceneTransitionData
  {
    return this.sceneTransitionData;
  }

  private convertTiledTransitionObjectPropertiesToDictionary(properties: Array<{
    name: string,
    type: string,
    value: string | number
  }>): {[key: string]: (string | number)}
  {
    let dictionary = {};
    properties.forEach(property => {
      dictionary[property.name] = property.value;
    });
    return dictionary;
  }
  
}

export default SceneTransitionObject;