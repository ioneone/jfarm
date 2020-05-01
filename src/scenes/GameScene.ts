import Phaser from 'phaser'

class GameScene extends Phaser.Scene
{

  public static KEY = "GameScene";
  public static JACK_WALK_KEY = "jack-walk";
  
  private player: Phaser.Physics.Arcade.Sprite | null;
  private cursor;
  private currentPlayerDirection = 0;
  
	constructor()
	{
    super(GameScene.KEY);
    this.player = null;
	}

	preload()
	{
    this.load.spritesheet(GameScene.JACK_WALK_KEY, 
			'assets/jack-walk.png', 
			{ frameWidth: 16, frameHeight: 24 }
		);
	}

	create()
	{
    this.player = this.createPlayer();
    this.cursor = this.input.keyboard.createCursorKeys();
  }
  
  update()
	{

    this.player.setVelocity(0, 0);

    if (this.cursor.up.isDown)
    {
      this.player.setVelocityY(-160);
      this.player.anims.play('up', true);
      this.currentPlayerDirection = 0;
    }
    else if (this.cursor.left.isDown)
    {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
      this.currentPlayerDirection = 1;
      this.player.flipX = false;
    }
    else if (this.cursor.down.isDown)
    {
      this.player.setVelocityY(160);
      this.player.anims.play('down', true);
      this.currentPlayerDirection = 2;
    }
    else if (this.cursor.right.isDown)
    {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
      this.currentPlayerDirection = 3;
      this.player.flipX = true;
    }
    else 
    {

      if (this.currentPlayerDirection === 0) 
      {
        this.player.anims.play('up-still', true);
      }
      else if (this.currentPlayerDirection === 1)
      {
        this.player.anims.play('left-still', true);
      }
      else if (this.currentPlayerDirection === 2) 
      {
        this.player.anims.play('down-still', true);
      }
      else
      {
        this.player.anims.play('right-still', true);
      }

    }

	}

  private createPlayer()
	{
		const player = this.physics.add.sprite(100, 450, GameScene.JACK_WALK_KEY)
    
    player.setCollideWorldBounds(true)

    this.anims.create({
        key: 'up-still',
        frames: [ { key: GameScene.JACK_WALK_KEY, frame: 6 } ],
        frameRate: 20
    });

    this.anims.create({
			key: 'up',
			frames: this.anims.generateFrameNumbers(GameScene.JACK_WALK_KEY, { start: 7, end: 8 }),
			frameRate: 5,
			repeat: -1
    })
    
    
    this.anims.create({
        key: 'left-still',
        frames: [ { key: GameScene.JACK_WALK_KEY, frame: 3 } ],
        frameRate: 20
    });

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers(GameScene.JACK_WALK_KEY, { start: 4, end: 5 }),
			frameRate: 5,
			repeat: -1
    })
    


    this.anims.create({
        key: 'down-still',
        frames: [ { key: GameScene.JACK_WALK_KEY, frame: 0 } ],
        frameRate: 20
    });
		
		this.anims.create({
			key: 'down',
			frames: this.anims.generateFrameNumbers(GameScene.JACK_WALK_KEY, { start: 0, end: 2 }),
			frameRate: 5,
			repeat: -1
    })
    

    this.anims.create({
        key: 'right-still',
        frames: [ { key: GameScene.JACK_WALK_KEY, frame: 3 } ],
        frameRate: 20
    });
		
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers(GameScene.JACK_WALK_KEY, { start: 4, end: 5 }),
			frameRate: 5,
			repeat: -1
		})

		return player
    
	}
  
}

export default GameScene;