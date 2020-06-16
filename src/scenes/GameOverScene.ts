import { FontAsset } from '../assets/FontAsset';
import Phaser from 'phaser';
import LevelScene from './LevelScene';
import UIScene from './UIScene';
import BaseScene from './BaseScene';
import LevelSceneTransitionObject, { LevelSceneTransitionData } from '../objects/LevelSceneTransitionObject';

/**
 * The scene the player sees when died. 
 * @class
 * @classdesc
 * Prompts the player to restart the game.
 */
class GameOverScene extends BaseScene
{

  // the unique id of this scene
  public static readonly KEY = "GameOverScene";

  // reference to the ENTER key for restarting the game
  private keyEnter?: Phaser.Input.Keyboard.Key;

  constructor()
  {
    super(GameOverScene.KEY);
  }

  /**
   * Scenes can have a init method, which is always called before the Scenes
   * preload method, allowing you to initialize data that the Scene may need.
   * 
   * The data is passed when the scene is started/launched by the scene manager.
   * 
   * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
   * @param {any} data - the data being passed when the scene manager starts this scene
   */
  public init(data: any): void
  {
  }

  /**
   * Scenes can have a preload method, which is always called before the Scenes 
   * create method, allowing you to preload assets that the Scene may need.
   */
  public preload(): void
  {
    // load font
    this.load.bitmapFont(FontAsset.PressStart2P);
  }

  /**
   * Scenes can have a create method, which is always called after the Scenes 
   * init and preload methods, allowing you to create assets that the Scene may need.
   * 
   * The data is passed when the scene is started/launched by the scene manager.
   * 
   * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
   * @param {any} data - the data being passed when the scene manager starts this scene
   */
  public create(data: any): void
  {
    this.keyEnter = this.input.keyboard.addKey('ENTER');

    const title = "GAME OVER";
    const titleFontSize = 24;

    const helperText = "Press Enter to Restart";
    const helperTextFontSize = 12;

    const spacingBetweenTitleAndHelperText = 24;

    // add texts in the center of the screen
    const titleBitmapText = this.add.bitmapText(this.cameras.main.centerX, this.cameras.main.centerY, FontAsset.PressStart2P, title, titleFontSize).setOrigin(0.5, 0.5);
    this.add.bitmapText(this.cameras.main.centerX, titleBitmapText.y + titleBitmapText.height / 2 + spacingBetweenTitleAndHelperText, FontAsset.PressStart2P, helperText, helperTextFontSize).setOrigin(0.5, 0.5)
  }

  /**
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time
   * @param {number} delta - the delta time in ms since the last frame
   */
  public update(time: number, delta: number): void
  {
    if (Phaser.Input.Keyboard.JustDown(this.keyEnter!))
    {
      const levelSceneTranstionData: LevelSceneTransitionData = {
        destinationScene: LevelScene.KEY,
        destinationX: 168,
        destinationY: 263,
        destinationLevel: 1,
        tilemapFileNamePrefix: "level",
        tilesetFileName: "tiles",
        isDark: true
      };
      this.scene.start(LevelScene.KEY, levelSceneTranstionData);
      this.scene.start(UIScene.KEY);
    }
  }
}

export default GameOverScene;