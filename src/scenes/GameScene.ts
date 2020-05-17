import CharacterAsset from '../assets/CharacterAsset';
import Phaser from 'phaser';
import Player from "../objects/Player";
import NonPlayer from "../objects/NonPlayer";
import CharacterConfigBuilder from '../builder/CharacterConfigBuilder';
import CharacterConfigFactory from '../factory/CharacterConfigFactory';
import RoomScene from './RoomScene';
import { Direction } from '~/objects/Character';
import Crop from '~/objects/Crop';
import Item from '~/ui/Item';

class GameScene extends Phaser.Scene
{

  private player?: Player;
  private npcs?: Phaser.GameObjects.Group;
  private keyZero?: Phaser.Input.Keyboard.Key;

  private targetX?: number;
  private targetY?: number;
  private direction?: Direction;

  private marker?: Phaser.GameObjects.Sprite;
  private marker2?: Phaser.GameObjects.Rectangle;
  private bottomLayer2?: Phaser.Tilemaps.DynamicTilemapLayer;

  private cropMode: boolean;
  private keyP?: Phaser.Input.Keyboard.Key;

  private crops?: Crop[][];

  // tilemap of this scene
  private tilemap?: Phaser.Tilemaps.Tilemap;

  // tilesets for the tilemap
  private tilesets?: Phaser.Tilemaps.Tileset[];

  // transition objects
  private transitionObjectGroup?: Phaser.Physics.Arcade.StaticGroup;

  // layer that can develop soils / could have soils
  // dynamic layer because we could turn a non-soil tile into a soil tile
  private soilLayer?: Phaser.Tilemaps.DynamicTilemapLayer;

  // middle layers of the tilemap
  private middleLayers?: Phaser.GameObjects.Group;

  // custom graphics for drawing debug info
  private debugGraphics?: Phaser.GameObjects.Graphics;

	constructor()
	{
    super("GameScene"); 
    this.cropMode = true;
  }

  public init(data)
  {
    this.targetX = data.targetX;
    this.targetY = data.targetY;
    this.direction = data.direction;
  }
  
	public preload()
	{
  
    CharacterConfigFactory.getSingletonInstance().preloadCharacterSpritesheets(
      this.load, Object.keys(CharacterAsset).map(key => CharacterAsset[key]));

    const option = { frameWidth: 32, frameHeight: 64 };

    this.load.image("outdoor", "assets/tileset/outdoor/outdoor.png");
    this.load.image("house", "assets/tileset/building-exterior/house.png");
    this.load.image("soil", "assets/tileset/farming/soil.png");
    this.load.tilemapTiledJSON("simple", "assets/map/simple.json");
    this.load.spritesheet("assets/tileset/farming/plants.png", "assets/tileset/farming/plants.png", option);

	}

	public create()
	{

    // the order of calling these functions matter
    this.createResources();

    this.createTiledTransitionLayer();

    this.createTiledBottomLayers();

    this.createTiledMiddleLayers();

    this.createCharacters();

    this.createTiledTopLayers();

    this.createDebugGraphics();    

    // Create a simple graphic that can be used to show which tile the mouse is over
    this.marker = this.add.sprite(0, 0, "assets/tileset/farming/plants.png", 4);
    this.marker.setOrigin(0.5, 0.9);
    this.marker.setAlpha(0.5);
    this.marker2 = this.add.rectangle(0, 0, 32, 32);
    
    this.addCollisionDetection();

    this.addOverlapDetection();
  
    this.configureMainCamera();
    
    this.initializeCropDatabase();

    this.addKeyboardActions();    

  }
  
  public update()
	{

    // toggle debug mode
    if (Phaser.Input.Keyboard.JustDown(this.keyZero!)) 
    {
      this.physics.world.debugGraphic.setVisible(!this.physics.world.debugGraphic.visible);
      this.debugGraphics!.setVisible(!this.debugGraphics!.visible);
    }

    // toggle crop mode
    if (Phaser.Input.Keyboard.JustDown(this.keyP!))
    {
      this.cropMode = !this.cropMode;
      this.marker?.setVisible(!this.marker.visible);
      this.marker2?.setVisible(!this.marker2.visible);
    }

    this.player!.update();

    Phaser.Actions.Call(this.npcs!.getChildren(), (npc) => npc.update(), this);

    if (this.cropMode)
    {
      
      // Convert the mouse position to world position within the camera
      const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

      // Place the marker in world space, but snap it to the tile grid. If we convert world -> tile and
      // then tile -> world, we end up with the position of the tile under the pointer
      const pointerTileXY = this.soilLayer!.worldToTileXY(worldPoint.x, worldPoint.y);
      const snappedWorldPoint = this.soilLayer!.tileToWorldXY(pointerTileXY.x, pointerTileXY.y);
      this.marker!.setPosition(snappedWorldPoint.x + 16, snappedWorldPoint.y + 16);
      this.marker2?.setPosition(snappedWorldPoint.x + 16, snappedWorldPoint.y + 16);

      const isSoil = this.soilLayer!.getTileAt(pointerTileXY.x, pointerTileXY.y).properties.isSoil;

      if (isSoil && !this.crops[pointerTileXY.y][pointerTileXY.x])
      {
        this.marker2.setStrokeStyle(1, 0x00ff00);
      }
      else
      {
        this.marker2.setStrokeStyle(1, 0xff0000);

      }
    }
    
  }

  // create any additional resources needed for this scene such as animations
  // do things you want to do after preload() is completed
  private createResources()
  {
    // create animations needed for this scene
    CharacterConfigFactory.getSingletonInstance().createCharacterAnimations(
      this.anims, Object.keys(CharacterAsset).map(key => CharacterAsset[key]));

    // create tilemap resources
    this.tilemap = this.make.tilemap({ key: "simple" });
    this.tilesets = [];
    this.tilesets.push(this.tilemap.addTilesetImage("outdoor", "outdoor"));
    this.tilesets.push(this.tilemap.addTilesetImage("house", "house"));
    this.tilesets.push(this.tilemap.addTilesetImage("soil", "soil"));

    // get references to keybord keys
    this.keyZero = this.input.keyboard.addKey('ZERO');
    this.keyP = this.input.keyboard.addKey('P');

  }

  // construct the scene from Tiled map
  private createTiledTransitionLayer()
  {
    this.transitionObjectGroup = this.physics.add.staticGroup();

    const tiledTransitionObjects = this.tilemap!.getObjectLayer("TransitionLayer").objects;
    tiledTransitionObjects.forEach(tiledTransitionObject => {
      const transitionObject = this.transitionObjectGroup!.create(tiledTransitionObject.x, tiledTransitionObject.y);
      transitionObject.setOrigin(0);
      transitionObject.body.setSize(tiledTransitionObject.width, tiledTransitionObject.height);
      transitionObject.destination = tiledTransitionObject.name;
      tiledTransitionObject.properties.forEach((property: { name: string, type: string, value: string }) => {
        if (property.type.localeCompare("string") === 0)
        {
          transitionObject[property.name] = property.value;
        }
        else if (property.type.localeCompare("float") === 0)
        {
          transitionObject[property.name] = parseFloat(property.value);
        }
        else
        {
          console.error("Cannot parse property");
        }
      });
    });

    // needs to be refreshed becuase we changed the body size
    this.transitionObjectGroup!.refresh();
  }

  private createTiledBottomLayers()
  {
    this.tilemap!.createStaticLayer("BottomLayer/Level1", this.tilesets!, 0, 0);

    // level 2 is for soil layer
    this.soilLayer = this.tilemap!.createDynamicLayer("BottomLayer/Level2", this.tilesets!, 0, 0);

    this.tilemap!.createStaticLayer("BottomLayer/Level3", this.tilesets!, 0, 0);
    this.tilemap!.createStaticLayer("BottomLayer/Level4", this.tilesets!, 0, 0);
  }

  private createTiledMiddleLayers()
  {

    this.middleLayers = this.add.group();

    for (let i = 1; i <= 4; i++)
    {
      const middleLayer = this.tilemap!.createDynamicLayer(`MiddleLayer/Level${i}`, this.tilesets!, 0, 0);
      middleLayer.setCollisionByProperty({ collision: true });      
      this.middleLayers.add(middleLayer);
    }

  }

  private createTiledTopLayers()
  {
    for (let i = 1; i <= 4; i++)
    {
      this.tilemap!.createDynamicLayer(`TopLayer/Level${i}`, this.tilesets!, 0, 0);
    }
  }

  // Characters should be created after bottom layers are added
  // and before top layers are added
  private createCharacters()
  {
    const npcConfig1 = new CharacterConfigBuilder()
      .setHairCharacterAsset(CharacterAsset.BlueBangsMaleHair)
      .setBodyCharacterAsset(CharacterAsset.LightMaleBody)
      .setTorsoCharacterAsset(CharacterAsset.WhiteMaleLongSleeve)
      .setLegsCharacterAsset(CharacterAsset.MagentaMalePants)
      .setFeetCharacterAsset(CharacterAsset.BlackMaleShoes)
      .setShadowCharacterAsset(CharacterAsset.Shadow)
      .setScene(this)
      .build();

  const npc1 = new NonPlayer(npcConfig1).setPosition(400, 400);

  const npcConfig2 = new CharacterConfigBuilder()
    .setHairCharacterAsset(CharacterAsset.BlackLongFemaleHair)
    .setBodyCharacterAsset(CharacterAsset.LightFemaleBody)
    .setTorsoCharacterAsset(CharacterAsset.WhiteFemaleWhitePirate)
    .setLegsCharacterAsset(CharacterAsset.FemaleSkirt)
    .setFeetCharacterAsset(CharacterAsset.BlackFemaleShoes)
    .setShadowCharacterAsset(CharacterAsset.Shadow)
    .setScene(this)
    .build();

  const npc2 = new NonPlayer(npcConfig2).setPosition(500, 400);

  const npcConfig3 = new CharacterConfigBuilder()
    .setHairCharacterAsset(CharacterAsset.BlondeBangslongFemaleHair)
    .setBodyCharacterAsset(CharacterAsset.LightFemaleBody)
    .setTorsoCharacterAsset(CharacterAsset.WhiteFemaleWhitePirate)
    .setLegsCharacterAsset(CharacterAsset.FemaleSkirt)
    .setFeetCharacterAsset(CharacterAsset.BlackFemaleShoes)
    .setShadowCharacterAsset(CharacterAsset.Shadow)
    .setScene(this)
    .build();

  const npc3 = new NonPlayer(npcConfig3).setPosition(500, 200);

  this.npcs = this.add.group([npc1, npc2, npc3]);

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
    .setPosition(this.targetX ? this.targetX - 32 : 400, this.targetY ? this.targetY - 32 : 300)
    .setDirection(this.direction || Direction.Down);
  }

  private createDebugGraphics()
  {
    this.debugGraphics = this.add.graphics().setAlpha(0.28);
    this.middleLayers!.getChildren().forEach((child) => {
      (child as Phaser.Tilemaps.StaticTilemapLayer).renderDebug(this.debugGraphics!, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
      });
    });
  }

  private addCollisionDetection()
  {
    this.physics.world.bounds.width = this.tilemap!.widthInPixels;
    this.physics.world.bounds.height = this.tilemap!.heightInPixels;
  
    this.physics.add.collider(this.player!, this.npcs!);
    this.physics.add.collider(this.player!, this.middleLayers!);
    this.physics.add.collider(this.npcs!, this.middleLayers!);
  }

  private addKeyboardActions()
  {
    this.input.on('pointerdown', () => {

      if (!this.cropMode) return;

      const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

      const pointerTileXY = this.soilLayer!.worldToTileXY(worldPoint.x, worldPoint.y);

      const isSoil = this.soilLayer!.getTileAt(pointerTileXY.x, pointerTileXY.y).properties.isSoil;

      if (isSoil && !this.crops![pointerTileXY.y][pointerTileXY.x])
      {
        const snappedWorldPoint = this.soilLayer!.tileToWorldXY(pointerTileXY.x, pointerTileXY.y);
        this.crops![pointerTileXY.y][pointerTileXY.x] = new Crop(this, snappedWorldPoint.x + 16, snappedWorldPoint.y + 16, 4);  
      }
      else
      {
        console.log("not soil");
      }
      
    });
  }

  private initializeCropDatabase()
  {
    this.crops = new Array(this.soilLayer!.height);
    for (let i = 0; i < this.crops.length; i++) this.crops[i] = new Array(this.soilLayer!.width)
  }

  private addOverlapDetection()
  {
    this.physics.add.overlap(this.player!, this.transitionObjectGroup!, (object1, object2) => {
      if (this.player?.getDirection() === object2.direction)
      {
        this.scene.start(object2.destination, { targetX: object2.targetX, targetY: object2.targetY, direction: object2.direction });
      }
    });
  }
  
  private configureMainCamera()
  {
    this.cameras.main.startFollow(this.player!, false, 1, 1, -16, -16);
    this.cameras.main.setBounds(0, 0, this.tilemap!.widthInPixels, this.tilemap!.heightInPixels);
  }

}

export default GameScene;