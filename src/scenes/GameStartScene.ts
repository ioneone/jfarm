import { LevelSceneModel } from './../objects/SceneTransitionObject';
import Phaser from 'phaser';

class GameStartScene extends Phaser.Scene
{

  private keyEnter?: Phaser.Input.Keyboard.Key;

  constructor()
  {
    super("GameStartScene");
  }

  public preload()
  {
    this.load.bitmapFont('PressStart2P', 'assets/font/font.png', 'assets/font/font.fnt');
  }

  public create()
  {
    this.keyEnter = this.input.keyboard.addKey('ENTER');
    this.add.bitmapText(this.cameras.main.centerX, this.cameras.main.centerY, 'PressStart2P', "SHINING SOUL J", 24).setOrigin(0.5, 0.5);
    this.add.bitmapText(this.cameras.main.centerX, this.cameras.main.centerY + 36, 'PressStart2P', "Press Enter to Start", 12).setOrigin(0.5, 0.5)
  }

  public update()
  {
    if (Phaser.Input.Keyboard.JustDown(this.keyEnter!))
    {

      this.scene.start("LevelScene", {
        destinationScene: "LevelScene",
        destinationXInTiles: 9,
        destinationYInTiles: 16,
        destinationLevel: 1,
        tilemapFileNamePrefix: "level",
        tilesetFileName: "tiles.png"
      } as LevelSceneModel);
      this.scene.start("UIScene");
      
    }
  }

}

export default GameStartScene;