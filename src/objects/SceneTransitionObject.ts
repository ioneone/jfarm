import { Direction } from '../objects/Character';
import Phaser from 'phaser';

// Raw data of Tiled transition object
// These are data provided by Tiled program by default
export interface TiledTransitionObject
{
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  properties: Array<{
    name: string,
    type: string,
    value: string | number
  }>;
}

/**
 * SceneTransitionObject is an instantiation of
 * transition object from Tiled map. This will be used
 * with overlap detection with the player.
 */
class SceneTransitionObject extends Phaser.GameObjects.Rectangle
{

  // the id of the scene to transition into
  private destination?: string;

  // direction the subject needs to face to transition
  private direction?: Direction;

  // the x coordinate of the subject in the new scene
  private targetX?: number;

  // the y coordinate of the subject in the new scene
  private targetY?: number;

  /**
   * @param {Phaser.Scene} scene - The scene this object belongs to
   * @param {TiledTransitionObject} tiledTransitionObject - The raw transition object from Tiled program
   */
  constructor(scene: Phaser.Scene, tiledTransitionObject: TiledTransitionObject)
  {
    super(scene, tiledTransitionObject.x, tiledTransitionObject.y);
    this.destination = tiledTransitionObject.name;
    tiledTransitionObject.properties.forEach(property =>{
      if (property.name.localeCompare("direction") === 0)
      {
        this.direction = property.value as Direction;
      }
      else if (property.name.localeCompare("targetX") === 0)
      {
        this.targetX = property.value as number;
      }
      else if (property.name.localeCompare("targetY") === 0)
      {
        this.targetY = property.value as number;
      }
    });
    this.setOrigin(0);
    this.setSize(tiledTransitionObject.width, tiledTransitionObject.height);
  }

  getDestination(): string
  {
    return this.destination!;
  }

  getDirection(): Direction
  {
    return this.direction!;
  }

  getTargetX(): number
  {
    return this.targetX!;
  }

  getTargetY(): number
  {
    return this.targetY!;
  }

}

export default SceneTransitionObject;