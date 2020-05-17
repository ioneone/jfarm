import Phaser from 'phaser';
import Player from '../objects/Player';
import CharacterConfig from '../configs/CharacterConfig';
import { Direction } from '../objects/Character';
import GameScene from './GameScene';
import CharacterAsset from '../assets/CharacterAsset';
import CharacterConfigBuilder from '../builder/CharacterConfigBuilder';

class RoomScene extends Phaser.Scene
{

  private player?: Player;
  private targetX?: number;
  private targetY?: number;
  private direction?: Direction;

	constructor()
	{
    super("RoomScene");
  }
  
  public init(data)
  {
    this.targetX = data.targetX;
    this.targetY = data.targetY;
    this.direction = data.direction;
  }

	public preload()
	{
    this.load.image("building-interior", "assets/tileset/building-interior/building-interior.png");
    this.load.image("background", "assets/tileset/background/background.png");
    this.load.tilemapTiledJSON("room", "assets/map/room.json");
	}

	public create()
	{

    const tilemap = this.make.tilemap({ key: "room" });
    const buildingInteriorTileset = tilemap.addTilesetImage("building-interior", "building-interior");
    const backgroundTileset = tilemap.addTilesetImage("background", "background");

    const tiledTransitionObjects = tilemap.getObjectLayer("TransitionLayer").objects;
    const transitionObjectGroup = this.physics.add.staticGroup();
    tiledTransitionObjects.forEach(tiledTransitionObject => {
      const transitionObject = transitionObjectGroup.create(tiledTransitionObject.x, tiledTransitionObject.y);
      transitionObject.setOrigin(0);
      transitionObject.body.setSize(tiledTransitionObject.width, tiledTransitionObject.height);
      transitionObject.destination = tiledTransitionObject.name;
      tiledTransitionObject.properties.forEach((property: { name: string, type: string, value: string }) => {
        if (property.type.localeCompare("string"))
        {
          transitionObject[property.name] = property.value;
        }
        else if (property.type.localeCompare("float"))
        {
          transitionObject[property.name] = parseFloat(property.value);
        }
        else
        {
          console.error("Cannot parse property");
        }
      });
    });
    transitionObjectGroup.refresh();

    const bottomLayer1 = tilemap.createDynamicLayer("BottomLayer/Level1", [buildingInteriorTileset, backgroundTileset], 0, 0);
    const bottomLayer2 = tilemap.createDynamicLayer("BottomLayer/Level2", [buildingInteriorTileset, backgroundTileset], 0, 0);
    const bottomLayer3 = tilemap.createDynamicLayer("BottomLayer/Level3", [buildingInteriorTileset, backgroundTileset], 0, 0);
    const bottomLayer4 = tilemap.createDynamicLayer("BottomLayer/Level4", [buildingInteriorTileset, backgroundTileset], 0, 0);

    const middleLayer1 = tilemap.createDynamicLayer("MiddleLayer/Level1", [buildingInteriorTileset, backgroundTileset], 0, 0);
    const middleLayer2 = tilemap.createDynamicLayer("MiddleLayer/Level2", [buildingInteriorTileset, backgroundTileset], 0, 0);
    const middleLayer3 = tilemap.createDynamicLayer("MiddleLayer/Level3", [buildingInteriorTileset, backgroundTileset], 0, 0);
    const middleLayer4 = tilemap.createDynamicLayer("MiddleLayer/Level4", [buildingInteriorTileset, backgroundTileset], 0, 0);

    middleLayer1.setCollisionByProperty({ collision: true });
    middleLayer2.setCollisionByProperty({ collision: true });
    middleLayer3.setCollisionByProperty({ collision: true });
    middleLayer4.setCollisionByProperty({ collision: true });

    const playerConfig = new CharacterConfigBuilder()
      .setHairCharacterAsset(CharacterAsset.WhiteBedheadMaleHair)
      .setBodyCharacterAsset(CharacterAsset.LightMaleBody)
      .setTorsoCharacterAsset(CharacterAsset.WhiteMaleLongSleeve)
      .setLegsCharacterAsset(CharacterAsset.MagentaMalePants)
      .setFeetCharacterAsset(CharacterAsset.BlackMaleShoes)
      .setShadowCharacterAsset(CharacterAsset.Shadow)
      .setScene(this)
      .build();

    this.player = new Player(playerConfig)
      .setPosition(this.targetX! - 32, this.targetY! - 32)
      .setDirection(this.direction);

    const middleLayers = this.add.group([middleLayer1, middleLayer2, middleLayer3, middleLayer4]);

    const topLayer1 = tilemap.createDynamicLayer("TopLayer/Level1", [buildingInteriorTileset, backgroundTileset], 0, 0);
    const topLayer2 = tilemap.createDynamicLayer("TopLayer/Level2", [buildingInteriorTileset, backgroundTileset], 0, 0);
    const topLayer3 = tilemap.createDynamicLayer("TopLayer/Level3", [buildingInteriorTileset, backgroundTileset], 0, 0);
    const topLayer4 = tilemap.createDynamicLayer("TopLayer/Level4", [buildingInteriorTileset, backgroundTileset], 0, 0);

    this.physics.add.collider(this.player, middleLayers);


    this.physics.add.overlap(this.player, transitionObjectGroup, (object1, object2) => {
      this.scene.start(GameScene.name, { targetX: object2.targetX, targetY: object2.targetY, direction: object2.direction });
    });

    this.physics.world.bounds.width = tilemap.widthInPixels;
    this.physics.world.bounds.height = tilemap.heightInPixels;

    // center the tilemap
    this.cameras.main.setPosition(
      this.cameras.main.centerX - tilemap.widthInPixels / 2, 
      this.cameras.main.centerY - tilemap.heightInPixels / 2
    );
    this.cameras.main.startFollow(this.player, false, 1, 1, -16, -16);
    this.cameras.main.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);
  }
  
  public update()
	{
    this.player!.update();
  }
  
}

export default RoomScene;