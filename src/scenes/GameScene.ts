import Phaser from 'phaser';
import Player from "../sprites/Player";
import NonPlayer from "../sprites/NonPlayer";
import CharacterFactory from '../factory/CharacterFactory';

class GameScene extends Phaser.Scene
{

  public static readonly ID = "GameScene";
  private player: Player;
  private marker;
  private bottomLayer;
  private npcs: Phaser.GameObjects.Group;

  private keyZero;
  private debugGraphics;
  
	constructor()
	{
    super(GameScene.ID);
    
	}

	public preload()
	{
    const spritesheetFilePaths = [
      "assets/character/body/male/light.png",
      "assets/character/body/female/light.png",
      "assets/character/hair/male/bedhead/white.png",
      "assets/character/hair/male/bangs/blue.png",
      "assets/character/hair/female/long/black.png",
      "assets/character/hair/female/bangslong/blonde.png",
      "assets/character/legs/pants/male/magenta_pants_male.png",
      "assets/character/legs/skirt/female/robe_skirt_female_incomplete.png",
      "assets/character/torso/shirts/longsleeve/male/white_longsleeve.png",
      "assets/character/torso/shirts/sleeveless/female/white_pirate.png",
      "assets/character/feet/shoes/male/black_shoes_male.png",
      "assets/character/feet/shoes/female/black_shoes_female.png",
      "assets/character/shadow/shadow.png"
    ];

    CharacterFactory.getSingletonInstance().preloadCharacterSpritesheets(this.load, spritesheetFilePaths);

    this.load.image("tiles", "assets/tiles/tiles.png");
    this.load.image("terrain", "assets/tiles/terrain.png");
    this.load.image("house", "assets/tiles/house.png");
    this.load.tilemapTiledJSON("map", "assets/tiles/map.json");

	}

	public create()
	{

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tiles", "tiles");
    const terrainset = map.addTilesetImage("terrain", "terrain");
    const houseset = map.addTilesetImage("house", "house");
    this.bottomLayer = map.createDynamicLayer("BottomLayer", [tileset, terrainset], 0, 0);
    this.bottomLayer.setCollisionByProperty({ collision: true });
    // const middleLayer1 = map.createDynamicLayer("MiddleLayer/Level1", [tileset, houseset], 0, 0);
    // middleLayer1.setCollisionByProperty({ collision: true });

    // const middleLayer2 = map.createDynamicLayer("MiddleLayer/Level2", [tileset, houseset], 0, 0);
    // middleLayer2.setCollisionByProperty({ collision: true });

    // const middleLayer3 = map.createDynamicLayer("MiddleLayer/Level3", [tileset, houseset], 0, 0);
    // middleLayer3.setCollisionByProperty({ collision: true });

    // const middleLayer4 = map.createDynamicLayer("MiddleLayer/Level4", [tileset, houseset], 0, 0);
    // middleLayer4.setCollisionByProperty({ collision: true });

    this.keyZero = this.input.keyboard.addKey('ZERO');

    const npc1 = 
      new NonPlayer(this, 400, 400, CharacterFactory.getSingletonInstance()
        .createCharacterConfig(this.anims, 
          "assets/character/body/male/light.png",
          "assets/character/hair/male/bangs/blue.png",
          "assets/character/legs/pants/male/magenta_pants_male.png",
          "assets/character/torso/shirts/longsleeve/male/white_longsleeve.png",
          "assets/character/feet/shoes/male/black_shoes_male.png",
          "assets/character/shadow/shadow.png"));

    const npc2 = 
    new NonPlayer(this, 500, 400, CharacterFactory.getSingletonInstance()
      .createCharacterConfig(this.anims, 
        "assets/character/body/female/light.png",
        "assets/character/hair/female/long/black.png",
        "assets/character/legs/skirt/female/robe_skirt_female_incomplete.png",
        "assets/character/torso/shirts/sleeveless/female/white_pirate.png",
        "assets/character/feet/shoes/female/black_shoes_female.png",
        "assets/character/shadow/shadow.png"));


    const npc3 = 
    new NonPlayer(this, 500, 200, CharacterFactory.getSingletonInstance()
      .createCharacterConfig(this.anims, 
        "assets/character/body/female/light.png",
        "assets/character/hair/female/bangslong/blonde.png",
        "assets/character/legs/skirt/female/robe_skirt_female_incomplete.png",
        "assets/character/torso/shirts/sleeveless/female/white_pirate.png",
        "assets/character/feet/shoes/female/black_shoes_female.png",
        "assets/character/shadow/shadow.png"));
          
    this.player = 
      new Player(this, 400, 300, CharacterFactory.getSingletonInstance()
        .createCharacterConfig(this.anims, 
          "assets/character/body/male/light.png",
          "assets/character/hair/male/bedhead/white.png",
          "assets/character/legs/pants/male/magenta_pants_male.png",
          "assets/character/torso/shirts/longsleeve/male/white_longsleeve.png",
          "assets/character/feet/shoes/male/black_shoes_male.png",
          "assets/character/shadow/shadow.png"));

    
    this.npcs = this.add.group([npc1, npc2, npc3]);

    

    // const topLayer1 = map.createDynamicLayer("TopLayer/Level1", [tileset, houseset], 0, 0);
    // const topLayer2 = map.createDynamicLayer("TopLayer/Level2", [tileset, houseset], 0, 0);
    // // Create a simple graphic that can be used to show which tile the mouse is over
    // // this.marker = this.add.graphics();
    // // this.marker.lineStyle(5, 0xffffff, 1);
    // // this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);
    // // this.marker.lineStyle(3, 0xff4f78, 1);
    // // this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);

    this.debugGraphics = this.add.graphics().setAlpha(0.5);
    // // middleLayer2.renderDebug(debugGraphics, {
    // //   tileColor: null, // Color of non-colliding tiles
    // //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    // //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // // });


    this.bottomLayer.renderDebug(this.debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });



    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
  
    // // const spawnPoint = map.findObject('object', obj => obj.name === "player");

    
    // // const cpus = this.physics.add.staticGroup();
    // // cpus.create(300, this.baseLayer.height - 400, "down");
    
    this.physics.add.collider(this.player, this.bottomLayer);
    this.physics.add.collider(this.npcs, this.bottomLayer);
    this.physics.add.collider(this.player, this.npcs);
    // this.physics.add.collider(this.player, middleLayer1);
    // this.physics.add.collider(this.player, middleLayer2);
    // this.physics.add.collider(this.player, middleLayer3);
    // this.physics.add.collider(this.player, middleLayer4);
    // // this.physics.add.collider(this.player, cpus);

    // // const topLayer = map.createDynamicLayer("above", tileset, 0, 0);
    
    this.cameras.main.startFollow(this.player, false, 1, 1, -16, -16);
    // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // const music = this.sound.add('summer_day');
    
    // music.play();

  }
  
  public update()
	{

    // toggle debug mode
    if (Phaser.Input.Keyboard.JustDown(this.keyZero)) 
    {
      this.physics.world.debugGraphic.setVisible(!this.physics.world.debugGraphic.visible);
      this.debugGraphics.setVisible(!this.debugGraphics.visible);
    }

    this.player?.update();
    

    Phaser.Actions.Call(this.npcs.getChildren(), function(npc) { npc.update(); }, this);


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