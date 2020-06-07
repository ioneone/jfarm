import Phaser from 'phaser';

class GameOverScene extends Phaser.Scene
{
  constructor()
  {
    super("GameOverScene");
  }

  public preload()
  {
  }

  public create()
  {
    this.add.text(0, 0, "Game Over", { fontSize: '12px' });
    this.add.text(0, 100, "Press Enter to Restart", { fontSize: '12px' });
  }

  public update()
  {
  }
}

export default GameOverScene;