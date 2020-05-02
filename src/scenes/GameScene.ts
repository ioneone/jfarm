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
    this.load.image('empty_dry_plot', 'assets/empty_dry_plot.png');

    this.load.image("outdoor_summer", "assets/outdoor_summer.png");
    this.load.tilemapTiledJSON("map", "assets/example_level.json");
	}

	public create()
	{

    const map = this.make.tilemap({ key: "map" });
    
    const tileset = map.addTilesetImage("outdoor_summer", "outdoor_summer");

    const baseLayer = map.createStaticLayer("base", tileset, 0, 0);
    const objectLayer = map.createStaticLayer("object", tileset, 0, 0);

    this.physics.world.bounds.width = baseLayer.width;
    this.physics.world.bounds.height = baseLayer.height;
  
    this.createAnimations();
    this.cursor = this.input.keyboard.createCursorKeys();

    this.player = new Player(this, this.cursor, 200, baseLayer.height - 200);
    
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    var FKey = this.input.keyboard.addKey('F');

    FKey.on('down', () => {
      if (this.scale.isFullscreen)
        this.scale.stopFullscreen();
      else
        this.scale.startFullscreen();
    }, this);
  }
  
  public update()
	{
    this.player?.update();
  }

  private createAnimations()
  {
    this.anims.create({
        key: 'up',
        frames: [ { key: Player.TEXTURE_KEY, frame: 6 } ],
        frameRate: 20
    });

    this.anims.create({
			key: 'walk_up',
			frames: this.anims.generateFrameNumbers(Player.TEXTURE_KEY, { start: 7, end: 8 }),
			frameRate: 5,
			repeat: -1
    });
    
    this.anims.create({
        key: 'left',
        frames: [ { key: Player.TEXTURE_KEY, frame: 3 } ],
        frameRate: 20
    });

		this.anims.create({
			key: 'walk_left',
			frames: this.anims.generateFrameNumbers(Player.TEXTURE_KEY, { start: 4, end: 5 }),
			frameRate: 5,
			repeat: -1
    });
    
    this.anims.create({
        key: 'down',
        frames: [ { key: Player.TEXTURE_KEY, frame: 0 } ],
        frameRate: 20
    });
		
		this.anims.create({
			key: 'walk_down',
			frames: this.anims.generateFrameNumbers(Player.TEXTURE_KEY, { start: 1, end: 2 }),
			frameRate: 5,
			repeat: -1
    });
    
  }
  
}

export default GameScene;