import { TiledTransitionObject } from '../scenes/TilemapScene';
import LevelSceneTransitionObject from '../objects/LevelSceneTransitionObject';
import SceneTransitionObject from '../objects/SceneTransitionObject';

/**
 * The factory for creating Phaser transition object from Tiled transition object.
 * @class
 * @classdesc
 * The data a scene needs for initialization varies. In other words, we need a 
 * different way to parse Tiled transition object depending on what the destination 
 * scene is. Assume every transition object must have a property `DestinationScene` 
 * that allows us to identify what scene the object can take us to. This class 
 * helps creating different type of Phaser transition object based on `DestinationScene`.
 */
class SceneTransitionObjectFactory
{
  public static create(scene: Phaser.Scene, tiledTransitionObject: TiledTransitionObject): SceneTransitionObject
  {
    for (let i = 0; i < tiledTransitionObject.properties.length; i++)
    {

      const property = tiledTransitionObject.properties[i];

      if (property.name === "DestinationScene")
      {
        const destinationScene = property.value as string;

        if (destinationScene === "LevelScene")
        {
          return new LevelSceneTransitionObject(scene, tiledTransitionObject);
        }
        else if (destinationScene === "BasecampScene")
        {
          return new SceneTransitionObject(scene, tiledTransitionObject);
        }

        throw new Error(`Failed to parse a transition object with destination scene "${destinationScene}"`);

      }
    }
    
    throw new Error(`Failed to find "DestinationScene" property from a transition object`);
  }
}

export default SceneTransitionObjectFactory;