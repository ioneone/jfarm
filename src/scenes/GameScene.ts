import SceneTransitionObject from '../objects/SceneTransitionObject';
import Character, { Direction } from '../objects/Character';
import TilemapScene from "./TilemapScene";
import Player from '../objects/Player';
import CharacterConfigBuilder from '../builder/CharacterConfigBuilder';
import CharacterAsset from '../assets/CharacterAsset';
import CharacterConfigFactory from '../factory/CharacterConfigFactory';

/**
 * GameScene is responsible for handling logics 
 * common to all the scene such as player rendering,
 * player collision, transition detections, and depth
 * sorting.
 */
class GameScene extends TilemapScene
{

  protected characterGroup?: Phaser.GameObjects.Group;

  // the character to control
  protected player?: Player;

  constructor(key: string, tilemapFilePath: string, tilesetFilePaths: string[])
  {
    super(key, tilemapFilePath, tilesetFilePaths);
  }

  preload()
  {
    super.preload();

    // load character assets if not loaded
    CharacterConfigFactory.getSingletonInstance().preloadCharacterSpritesheets(
      this.load, Object.keys(CharacterAsset).map(key => CharacterAsset[key]));
  }

  create()
  {
    super.create();

    // create character animation if not created
    CharacterConfigFactory.getSingletonInstance().createCharacterAnimations(
      this.anims, Object.keys(CharacterAsset).map(key => CharacterAsset[key]));

    // create the player
    const playerConfig = new CharacterConfigBuilder()
      .setHairCharacterAsset(CharacterAsset.WhiteBedheadMaleHair)
      .setBodyCharacterAsset(CharacterAsset.LightMaleBody)
      .setTorsoCharacterAsset(CharacterAsset.WhiteMaleLongSleeve)
      .setLegsCharacterAsset(CharacterAsset.MagentaMalePants)
      .setFeetCharacterAsset(CharacterAsset.BlackMaleShoes)
      .setShadowCharacterAsset(CharacterAsset.Shadow)
      .setWeaponCharacterAsset(CharacterAsset.Shovel)
      .setScene(this)
      .build();
    
    if (this.sceneTransitionObject)
    {
      this.player = new Player(playerConfig)
        .setPosition(this.sceneTransitionObject.getTargetX() - 32, this.sceneTransitionObject.getTargetY() - 32)
        .setDirection(this.sceneTransitionObject.getDirection());
    }
    else
    {
      this.player = new Player(playerConfig)
        .setPosition(400, 300)
        .setDirection(Direction.Down);
    }
    

    // add collision detection between player and collidable layer
    this.physics.add.collider(this.player!, this.middleLayer!);
    this.physics.add.collider(this.player!, this.bottomLayer!);

    // add transition detection
    this.physics.add.overlap(this.player!, this.transitionObjectGroup!, (object1, object2) => {
      const player = object1 as Player;
      const sceneTransitionObject = object2 as SceneTransitionObject;
      if (player.getDirection() === sceneTransitionObject.getDirection())
      {
        // pass sceneTransitionObject to destination scene
        this.scene.start(sceneTransitionObject.getDestination(), { sceneTransitionObject });
      }
    });

    // configure the camera to follow the player
    this.cameras.main.startFollow(this.player!, false, 1, 1, -16, -16);

    // prevent tile bleeding
    this.cameras.main.setRoundPixels(true);

    // bring top layer to the front
    // Depth is 0 (unsorted) by default, which perform the rendering 
    // in the order it was added to the scene
    this.topLayer?.setDepth(9999999);

    this.characterGroup = this.add.group([this.player!]);

  }

  update()
  {
    super.update();

    this.player?.update();

    // perform depth sort
    this.characterGroup?.getChildren().forEach(character => {
      const c = character as Character;
      c.setDepth(Math.max(0, c.y + c.height / 2));
    })
  }
}

export default GameScene;