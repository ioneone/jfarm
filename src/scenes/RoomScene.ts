import Phaser from 'phaser';
import Player from '../objects/Player';
import CharacterConfig from '../configs/CharacterConfig';
import { Direction } from '../objects/Character';

class RoomScene extends Phaser.Scene
{

  private player?: Player;
  private playerConfig?: CharacterConfig;
  private targetX?: number;
  private targetY?: number;
  private direction?: Direction;

  private isTransitioning?: boolean;

	constructor()
	{
    super(RoomScene.name);
  }
  
  public init(data)
  {
    console.log("init is called");
    this.playerConfig = data.playerConfig;
    this.targetX = data.targetX;
    this.targetY = data.targetY;
    this.direction = data.direction;
    this.isTransitioning = false;
  }

	public preload()
	{
    console.log("preload is called");
    this.load.image("building-interior", "assets/tileset/building-interior/building-interior.png");
    this.load.image("background", "assets/tileset/background/background.png");
    this.load.tilemapTiledJSON("room", "assets/map/room.json");
	}

	public create()
	{

    const tilemap = this.make.tilemap({ key: "room" });
    const buildingInteriorTileset = tilemap.addTilesetImage("building-interior", "building-interior");
    const backgroundTileset = tilemap.addTilesetImage("background", "background");



    const transitionObjects = tilemap.getObjectLayer("TransitionLayer").objects;
    const transitionObjectGroup = this.physics.add.staticGroup();
    transitionObjects.forEach(object => {
      const obj = transitionObjectGroup.create(object.x, object.y);
      obj.setOrigin(0);
      obj.body.setSize(object.width, object.height);
      obj.destination = object.name;
      obj.targetX = parseFloat(object.properties[1].value);
      obj.targetY = parseFloat(object.properties[2].value);
      obj.direction = object.properties[0].value;
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

    this.player = new Player(this, this.targetX - 32, this.targetY - 32, this.playerConfig!);
    this.player.setDirection(this.direction);

    const middleLayers = this.add.group([middleLayer1, middleLayer2, middleLayer3, middleLayer4]);

    const topLayer1 = tilemap.createDynamicLayer("TopLayer/Level1", [buildingInteriorTileset, backgroundTileset], 0, 0);
    const topLayer2 = tilemap.createDynamicLayer("TopLayer/Level2", [buildingInteriorTileset, backgroundTileset], 0, 0);
    const topLayer3 = tilemap.createDynamicLayer("TopLayer/Level3", [buildingInteriorTileset, backgroundTileset], 0, 0);
    const topLayer4 = tilemap.createDynamicLayer("TopLayer/Level4", [buildingInteriorTileset, backgroundTileset], 0, 0);

    this.physics.add.collider(this.player, middleLayers);

    

    this.physics.add.overlap(this.player, transitionObjectGroup, (object1, object2) => {
      console.log("object: ", object2);
      if (this.isTransitioning || this.player?.getDirection() !== object2.direction) return;
      this.isTransitioning = true;
      this.cameras.main.fadeOut(200);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(object2.destination, { playerConfig: this.player?.getConfig(), targetX: object2.targetX, targetY: object2.targetY, direction: object2.direction });
      })
      
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