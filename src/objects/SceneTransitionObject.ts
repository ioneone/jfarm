import Phaser from 'phaser';
import { TiledTransitionObject } from '../scenes/TilemapScene';

/**
 * Custom properties of scene transition obejct
 * @interface
 */
export interface SceneTransitionData
{
  destinationScene: string;
  destinationX: number;
  destinationY: number;
  isDark: boolean;
}

/**
 * An Phaser representation of transition object from Tiled map.
 * @class
 * @classdesc
 * This will be used for overlap detection with the player.
 */
class SceneTransitionObject extends Phaser.GameObjects.Rectangle
{

  // the id of the scene to transition into
  protected destinationScene?: string;

  // the x coordinate in tiles to spawn the player in the next scene
  protected destinationX?: number;

  // the y coordinate in tiles to spawn the player in the next scene
  protected destinationY?: number;

  protected isDark?: boolean;

  /**
   * @param {Phaser.Scene} scene - The scene this object belongs to
   * @param {TiledTransitionObject} tiledTransitionObject - The raw transition object from Tiled program
   */
  constructor(scene: Phaser.Scene, tiledTransitionObject: TiledTransitionObject)
  {
    super(scene, tiledTransitionObject.x, tiledTransitionObject.y);
    this.setOrigin(0);
    this.setSize(tiledTransitionObject.width, tiledTransitionObject.height);

    tiledTransitionObject.properties.forEach(property => {
      if (property.name === "DestinationScene")
      {
        this.destinationScene = property.value as string;
      }
      else if (property.name === "DestinationX")
      {
        this.destinationX = property.value as number;
      }
      else if (property.name === "DestinationY")
      {
        this.destinationY = property.value as number;
      }
      else if (property.name === "IsDark")
      {
        this.isDark = property.value as boolean;
      }
    });
  }

  /**
   * Get the data needed for starting next scene
   * @return {SceneTransitionData} - the data representation of this object
   */
  public toSceneTransitionData(): SceneTransitionData
  {
    return {
      destinationScene: this.destinationScene!,
      destinationX: this.destinationX!,
      destinationY: this.destinationY!,
      isDark: this.isDark!
    };
  }
  
}

export default SceneTransitionObject;