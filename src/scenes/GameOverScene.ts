import Phaser from 'phaser';

class GameOverScene extends Phaser.Scene
{

  private fontFamily: string;

  private keyEnter?: Phaser.Input.Keyboard.Key;

  constructor()
  {
    super("GameOverScene");
    this.fontFamily = 'PressStart2P';
  }

  public preload()
  {
    this.load.bitmapFont(this.fontFamily, 'assets/font/font.png', 'assets/font/font.fnt');
  }

  public create()
  {
    this.keyEnter = this.input.keyboard.addKey('ENTER');
    this.add.bitmapText(this.cameras.main.centerX, this.cameras.main.centerY, this.fontFamily, "GAME OVER", 24).setOrigin(0.5, 0.5);
    this.add.bitmapText(this.cameras.main.centerX, this.cameras.main.centerY + 36, this.fontFamily, "Press Enter to Restart", 12).setOrigin(0.5, 0.5)
  }

  public update()
  {
    if (Phaser.Input.Keyboard.JustDown(this.keyEnter!))
    {
      this.scene.launch("GameScene");
      this.scene.start("UIScene");
    }
  }
}

export default GameOverScene;