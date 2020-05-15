import CharacterAsset from '../assets/CharacterAsset';
import Phaser from 'phaser';
import Player from "../objects/Player";
import NonPlayer from "../objects/NonPlayer";
import CharacterConfigBuilder from '../builder/CharacterConfigBuilder';
import CharacterConfigFactory from '../factory/CharacterConfigFactory';

class GameScene extends Phaser.Scene
{

  private static readonly ID = "GameScene";

  private player?: Player;
  private npcs?: Phaser.GameObjects.Group;
  private keyZero?: Phaser.Input.Keyboard.Key;
  private debugGraphics?: Phaser.GameObjects.Graphics;
  
	constructor()
	{
    super(GameScene.ID);
	}

	public preload()
	{
    
    CharacterConfigFactory.getSingletonInstance().preloadCharacterSpritesheets(
      this.load, Object.keys(CharacterAsset).map(key => CharacterAsset[key]));

    this.load.image("outdoor", "assets/tileset/outdoor/outdoor.png");
    this.load.image("house", "assets/tileset/building-exterior/house.png");
    this.load.tilemapTiledJSON("simple", "assets/map/simple.json");

	}

	public create()
	{

    CharacterConfigFactory.getSingletonInstance().createCharacterAnimations(
      this.anims, Object.keys(CharacterAsset).map(key => CharacterAsset[key]));

    const tilemap = this.make.tilemap({ key: "simple" });
    const outdoorTileset = tilemap.addTilesetImage("outdoor", "outdoor");
    const houseTileset = tilemap.addTilesetImage("house", "house");

    const bottomLayer1 = tilemap.createDynamicLayer("BottomLayer/Level1", [outdoorTileset, houseTileset], 0, 0);
    const bottomLayer2 = tilemap.createDynamicLayer("BottomLayer/Level2", [outdoorTileset, houseTileset], 0, 0);
    const bottomLayer3 = tilemap.createDynamicLayer("BottomLayer/Level3", [outdoorTileset, houseTileset], 0, 0);
    const bottomLayer4 = tilemap.createDynamicLayer("BottomLayer/Level4", [outdoorTileset, houseTileset], 0, 0);

    const middleLayer1 = tilemap.createDynamicLayer("MiddleLayer/Level1", [outdoorTileset, houseTileset], 0, 0);
    const middleLayer2 = tilemap.createDynamicLayer("MiddleLayer/Level2", [outdoorTileset, houseTileset], 0, 0);
    const middleLayer3 = tilemap.createDynamicLayer("MiddleLayer/Level3", [outdoorTileset, houseTileset], 0, 0);
    const middleLayer4 = tilemap.createDynamicLayer("MiddleLayer/Level4", [outdoorTileset, houseTileset], 0, 0);

    middleLayer1.setCollisionByProperty({ collision: true });
    middleLayer2.setCollisionByProperty({ collision: true });
    middleLayer3.setCollisionByProperty({ collision: true });
    middleLayer4.setCollisionByProperty({ collision: true });

    const middleLayers = this.add.group([middleLayer1, middleLayer2, middleLayer3, middleLayer4]);

    const npcConfig1 = new CharacterConfigBuilder()
      .setHairCharacterAsset(CharacterAsset.BlueBangsMaleHair)
      .setBodyCharacterAsset(CharacterAsset.LightMaleBody)
      .setTorsoCharacterAsset(CharacterAsset.WhiteMaleLongSleeve)
      .setLegsCharacterAsset(CharacterAsset.MagentaMalePants)
      .setFeetCharacterAsset(CharacterAsset.BlackMaleShoes)
      .setShadowCharacterAsset(CharacterAsset.Shadow)
      .build();

    const npc1 = new NonPlayer(this, 400, 400, npcConfig1);

    const npcConfig2 = new CharacterConfigBuilder()
      .setHairCharacterAsset(CharacterAsset.BlackLongFemaleHair)
      .setBodyCharacterAsset(CharacterAsset.LightFemaleBody)
      .setTorsoCharacterAsset(CharacterAsset.WhiteFemaleWhitePirate)
      .setLegsCharacterAsset(CharacterAsset.FemaleSkirt)
      .setFeetCharacterAsset(CharacterAsset.BlackFemaleShoes)
      .setShadowCharacterAsset(CharacterAsset.Shadow)
      .build();

    const npc2 = new NonPlayer(this, 500, 400, npcConfig2);

    const npcConfig3 = new CharacterConfigBuilder()
      .setHairCharacterAsset(CharacterAsset.BlondeBangslongFemaleHair)
      .setBodyCharacterAsset(CharacterAsset.LightFemaleBody)
      .setTorsoCharacterAsset(CharacterAsset.WhiteFemaleWhitePirate)
      .setLegsCharacterAsset(CharacterAsset.FemaleSkirt)
      .setFeetCharacterAsset(CharacterAsset.BlackFemaleShoes)
      .setShadowCharacterAsset(CharacterAsset.Shadow)
      .build();

    const npc3 = new NonPlayer(this, 500, 200, npcConfig3);

    const playerConfig = new CharacterConfigBuilder()
      .setHairCharacterAsset(CharacterAsset.WhiteBedheadMaleHair)
      .setBodyCharacterAsset(CharacterAsset.LightMaleBody)
      .setTorsoCharacterAsset(CharacterAsset.WhiteMaleLongSleeve)
      .setLegsCharacterAsset(CharacterAsset.MagentaMalePants)
      .setFeetCharacterAsset(CharacterAsset.BlackMaleShoes)
      .setShadowCharacterAsset(CharacterAsset.Shadow)
      .build();
          
    this.player = new Player(this, 400, 300, playerConfig);

    const topLayer1 = tilemap.createDynamicLayer("TopLayer/Level1", [outdoorTileset, houseTileset], 0, 0);
    const topLayer2 = tilemap.createDynamicLayer("TopLayer/Level2", [outdoorTileset, houseTileset], 0, 0);
    const topLayer3 = tilemap.createDynamicLayer("TopLayer/Level3", [outdoorTileset, houseTileset], 0, 0);
    const topLayer4 = tilemap.createDynamicLayer("TopLayer/Level4", [outdoorTileset, houseTileset], 0, 0);

    this.keyZero = this.input.keyboard.addKey('ZERO');

    this.npcs = this.add.group([npc1, npc2, npc3]);

    // Create a simple graphic that can be used to show which tile the mouse is over
    // this.marker = this.add.graphics();
    // this.marker.lineStyle(5, 0xffffff, 1);
    // this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);
    // this.marker.lineStyle(3, 0xff4f78, 1);
    // this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);

    this.debugGraphics = this.add.graphics().setAlpha(0.5);
    middleLayer1.renderDebug(this.debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
    middleLayer2.renderDebug(this.debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
    middleLayer3.renderDebug(this.debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

    this.physics.world.bounds.width = tilemap.widthInPixels;
    this.physics.world.bounds.height = tilemap.heightInPixels;
  
    // // const spawnPoint = map.findObject('object', obj => obj.name === "player");

    // // const cpus = this.physics.add.staticGroup();
    // // cpus.create(300, this.baseLayer.height - 400, "down");
    

    this.physics.add.collider(this.player, this.npcs);
    this.physics.add.collider(this.player, middleLayers);
    this.physics.add.collider(this.npcs, middleLayers);
      
    this.cameras.main.startFollow(this.player, false, 1, 1, -16, -16);
    this.cameras.main.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);

    // const music = this.sound.add('summer_day');
    
    // music.play();

  }
  
  public update()
	{

    // toggle debug mode
    if (Phaser.Input.Keyboard.JustDown(this.keyZero!)) 
    {
      this.physics.world.debugGraphic.setVisible(!this.physics.world.debugGraphic.visible);
      this.debugGraphics!.setVisible(!this.debugGraphics!.visible);
    }

    this.player!.update();
    

    Phaser.Actions.Call(this.npcs!.getChildren(), function(npc) { npc.update(); }, this);


    // Convert the mouse position to world position within the camera
    // const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

    // // Place the marker in world space, but snap it to the tile grid. If we convert world -> tile and
    // // then tile -> world, we end up with the position of the tile under the pointer
    // const pointerTileXY = this.baseLayer.worldToTileXY(worldPoint.x, worldPoint.y);
    // const snappedWorldPoint = this.baseLayer.tileToWorldXY(pointerTileXY.x, pointerTileXY.y);
    // this.marker.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);
  }
  
}

export default GameScene;