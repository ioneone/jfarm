import { NonPlayerCharacterAsset } from '~/assets/NonPlayerCharacterAsset';
import { NonPlayerCharacterConfig } from './../objects/NonPlayerCharacter';
import NonPlayerCharacter from '../objects/NonPlayerCharacter';
import Alchemist from '~/objects/Alchemist';
import Blacksmith from '~/objects/Blacksmith';

/**
 * A factory for {@link NonPlayerCharacter}.
 * @class
 * @classdesc
 * Create a {@link NonPlayerCharacter} from {@link Phaser.Types.Tilemaps.TiledObject} 
 * with `create()`. This makes the construction of NPC easy without worry about 
 * what {@link NonPlayerCharacterConfig} to pass in.
 */
class NonPlayerCharacterFactory
{
  /**
   * Constructs NPC
   */
  public static create(scene: Phaser.Scene, tiledObject: Phaser.Types.Tilemaps.TiledObject): NonPlayerCharacter
  {

    tiledObject.x += tiledObject.width / 2;
    tiledObject.y -= tiledObject.height / 2;

    if (tiledObject.name === "TownsfolkMale")
    {

      let paragraph1;
      let paragraph2;
      let paragraph3;

      tiledObject.properties.forEach(property => {
        if (property.name === 'Paragraph1')
        {
          paragraph1 = property.value;
        }
        else if (property.name === 'Paragraph2')
        {
          paragraph2 = property.value;
        }
        else if (property.name === 'Paragraph3')
        {
          paragraph3 = property.value;
        }
      });

      return new NonPlayerCharacter(scene, tiledObject.x!, tiledObject.y!, {
        asset: NonPlayerCharacterAsset.TownsfolkMale,
        paragraph1: paragraph1,
        paragraph2: paragraph2,
        paragraph3: paragraph3
      });
    }
    else if (tiledObject.name === 'Alchemist')
    {
      return new Alchemist(scene, tiledObject.x!, tiledObject.y!);
    }
    else if (tiledObject.name === 'Blacksmith')
    {
      return new Blacksmith(scene, tiledObject.x!, tiledObject.y!).setFlipX(tiledObject.flippedHorizontal!);
    }
    
    throw new Error(`Failed to create npc from tiled object ${tiledObject}`)

  }
}

export default NonPlayerCharacterFactory;