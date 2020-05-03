import Phaser from 'phaser';
import Player from "../sprites/Player";

class GameScene extends Phaser.Scene
{

  public static KEY = "GameScene";

  private player: Player | null;
  private cursor: Phaser.Types.Input.Keyboard.CursorKeys | null;
  
	constructor()
	{
    super(GameScene.KEY);
    this.player = null;
    this.cursor = null;
	}

	public preload()
	{
    this.load.spritesheet(Player.TEXTURE_KEY, 
			'assets/jack.png', 
			{ frameWidth: 16, frameHeight: 24 }
    );
    this.load.image("outdoor_summer", "assets/outdoor_summer.png");
    this.load.image("crops", "assets/crops.png");
    this.load.tilemapTiledJSON("map", "assets/outdoor_summer.json");
    this.load.atlas("player", "assets/player/player.png", "assets/player/player.json");
	}

	public create()
	{

    const map = this.make.tilemap({ key: "map" });
    
    const tileset = map.addTilesetImage("outdoor_summer", "outdoor_summer");
    const cropsTileset = map.addTilesetImage("crops", "crops");

    const baseLayer = map.createStaticLayer("base", [tileset, cropsTileset], 0, 0);

    const objectLayer = map.createStaticLayer("object", tileset, 0, 0);
    objectLayer.setCollisionByProperty({ collides: true });

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    objectLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

    this.physics.world.bounds.width = baseLayer.width;
    this.physics.world.bounds.height = baseLayer.height;
  
    this.createAnimations();

    this.player = new Player(this, 300, baseLayer.height - 300);
    
    this.physics.add.collider(this.player, objectLayer);

    const topLayer = map.createStaticLayer("top", tileset, 0, 0);
    
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // this.player.play("turn_soil_up");

  }
  
  public update()
	{
    this.player?.update();
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