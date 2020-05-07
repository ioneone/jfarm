import Phaser from 'phaser';
import Player from "../sprites/Player";
import AnimationFactory from "../factory/AnimationFactory";

class GameScene extends Phaser.Scene
{

  private player: Player | null;
  private marker;
  private bottomLayer;
  
	constructor()
	{
    super("game");
    this.player = null;
	}

	public preload()
	{
    AnimationFactory.preload(this);

    this.load.image("tiles", "assets/tiles/tiles.png");
    this.load.image("terrain", "assets/tiles/terrain.png");
    this.load.tilemapTiledJSON("map", "assets/tiles/map.json");
	}

	public create()
	{

    AnimationFactory.create(this);

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tiles", "tiles");
    const terrainset = map.addTilesetImage("terrain", "terrain");
    
    this.bottomLayer = map.createDynamicLayer("BottomLayer", [tileset, terrainset], 0, 0);
    this.bottomLayer.setCollisionByProperty({ collision: true });
    const middleLayer = map.createDynamicLayer("MiddleLayer", tileset, 0, 0);
    middleLayer.setCollisionByProperty({ collision: true });

    this.player = new Player(this, 320, 300);

    const topLayer = map.createDynamicLayer("TopLayer", tileset, 0, 0);

    // Create a simple graphic that can be used to show which tile the mouse is over
    // this.marker = this.add.graphics();
    // this.marker.lineStyle(5, 0xffffff, 1);
    // this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);
    // this.marker.lineStyle(3, 0xff4f78, 1);
    // this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);

    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // middleLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });

    // this.bottomLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });

    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
  
    // const spawnPoint = map.findObject('object', obj => obj.name === "player");

    
    // const cpus = this.physics.add.staticGroup();
    // cpus.create(300, this.baseLayer.height - 400, "down");
    
    this.physics.add.collider(this.player, this.bottomLayer);
    this.physics.add.collider(this.player, middleLayer);
    // this.physics.add.collider(this.player, cpus);

    // const topLayer = map.createDynamicLayer("above", tileset, 0, 0);
    
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // const music = this.sound.add('summer_day');
    
    // music.play();

  }
  
  public update()
	{
    this.player?.update();

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