import Phaser from 'phaser';
import Player from "../sprites/Player";

class GameScene extends Phaser.Scene
{

  private player: Player | null;
  private marker;
  private baseLayer;
  
	constructor()
	{
    super("game");
    this.player = null;
	}

	public preload()
	{
    this.load.image("outdoor_summer", "assets/outdoor_summer.png");
    this.load.tilemapTiledJSON("map", "assets/outdoor_summer.json");
    this.load.atlas("player", "assets/player/player.png", "assets/player/player.json");
    this.load.image("down", "assets/player/down.png");
    this.load.audio('summer_day', "assets/audio/summer_day.wav");
    this.load.audio('sandstep1', 'assets/audio/sandstep1.wav');
    this.load.audio('hoe', "assets/audio/hoe.wav");
    this.load.audio('hoeHit', "assets/audio/hoeHit.wav");
	}

	public create()
	{

    this.createAnimations();

    const map = this.make.tilemap({ key: "map" });
    
    const tileset = map.addTilesetImage("outdoor_summer", "outdoor_summer");
    const cropsTileset = map.addTilesetImage("crops", "crops");

    this.baseLayer = map.createDynamicLayer("below", [tileset, cropsTileset], 0, 0);

    const worldLayer = map.createDynamicLayer("world", tileset, 0, 0);
    worldLayer.setCollisionByProperty({ collides: true });

    // Create a simple graphic that can be used to show which tile the mouse is over
    this.marker = this.add.graphics();
    this.marker.lineStyle(5, 0xffffff, 1);
    this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);
    this.marker.lineStyle(3, 0xff4f78, 1);
    this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    worldLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

    this.physics.world.bounds.width = this.baseLayer.width;
    this.physics.world.bounds.height = this.baseLayer.height;
  
    const spawnPoint = map.findObject('object', obj => obj.name === "player");

    this.player = new Player(this, spawnPoint.x, spawnPoint.y);
    const cpus = this.physics.add.staticGroup();
    cpus.create(300, this.baseLayer.height - 400, "down");
    
    this.physics.add.collider(this.player, worldLayer);
    this.physics.add.collider(this.player, cpus);

    const topLayer = map.createDynamicLayer("above", tileset, 0, 0);
    
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    const music = this.sound.add('summer_day');
    
    music.play();

  }
  
  public update()
	{
    this.player?.update();

    // Convert the mouse position to world position within the camera
    const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

    // Place the marker in world space, but snap it to the tile grid. If we convert world -> tile and
    // then tile -> world, we end up with the position of the tile under the pointer
    const pointerTileXY = this.baseLayer.worldToTileXY(worldPoint.x, worldPoint.y);
    const snappedWorldPoint = this.baseLayer.tileToWorldXY(pointerTileXY.x, pointerTileXY.y);
    this.marker.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);
  }

  private createAnimations()
  {

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNames('player', { prefix: 'up_', suffix: '.png', end: 0 }),
      frameRate: 20
    });

    this.anims.create({
			key: 'walk_up',
			frames: this.anims.generateFrameNames('player', { prefix: 'walk_up_', suffix: '.png', end: 1 }),
			frameRate: 5,
			repeat: -1
    });
    
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNames('player', { prefix: 'left_', suffix: '.png', end: 0 }),
        frameRate: 20
    });

		this.anims.create({
			key: 'walk_left',
			frames: this.anims.generateFrameNames('player', { prefix: 'walk_left_', suffix: '.png', end: 1 }),
			frameRate: 5,
			repeat: -1
    });
    
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNames('player', { prefix: 'down_', suffix: '.png', end: 0 }),
        frameRate: 20
    });
		
		this.anims.create({
			key: 'walk_down',
			frames: this.anims.generateFrameNames('player', { prefix: 'walk_down_', suffix: '.png', end: 1 }),
			frameRate: 5,
			repeat: -1
    });

    this.anims.create({
      key: 'turn_soil_up',
      frames: this.anims.generateFrameNames('player', { prefix: 'turn_soil_up_', suffix: '.png', end: 3 }),
      frameRate: 5,
      repeat: 0
    });

    this.anims.create({
      key: 'turn_soil_down',
      frames: this.anims.generateFrameNames('player', { prefix: 'turn_soil_down_', suffix: '.png', end: 3 }),
      frameRate: 5,
      repeat: 0
    });

    this.anims.create({
      key: 'turn_soil_left',
      frames: this.anims.generateFrameNames('player', { prefix: 'turn_soil_left_', suffix: '.png', end: 3 }),
      frameRate: 5,
      repeat: 0
    });
    
  }
  
}

export default GameScene;