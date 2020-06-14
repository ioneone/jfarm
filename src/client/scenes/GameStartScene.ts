import { SceneTransitionData } from '../objects/SceneTransitionObject';
import { FontAsset } from '../assets/FontAsset';
import Phaser from 'phaser';
import LevelScene from './LevelScene';
import UIScene from './UIScene';
import BaseScene from './BaseScene';
import Connection from '../socket/Connection';

/**
 * The first scene the player sees when they start the game.
 * @class
 * @classdesc
 * It displays the title of the game. This should be the first item in the 
 * game config's scene list.
 */
class GameStartScene extends BaseScene
{

  // the unique id of this scene
  public static readonly KEY = "GameStartScene";

  // reference to the ENTER key for starting the game
  private keyEnter?: Phaser.Input.Keyboard.Key;

  constructor()
  {
    super(GameStartScene.KEY);
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

    const title = "SHINING SOUL J";
    const titleFontSize = 24;

    const helperText = "Press W/A/S/D to move\nPress J to attack\n\n\nPress SPACE to change weapon";
    const helperTextFontSize = 12;
    const spacingBetweenTitleAndHelperText = 24;

    // draw texts on the center of the screen
    const titleBitmapText = this.add.bitmapText(this.cameras.main.centerX, 
      this.cameras.main.centerY, FontAsset.PressStart2P, title, titleFontSize).setOrigin(0.5, 0.5);
    this.add.bitmapText(this.cameras.main.centerX, 
      titleBitmapText.y + titleBitmapText.height + spacingBetweenTitleAndHelperText, 
      FontAsset.PressStart2P, helperText, helperTextFontSize).setOrigin(0.5, 0);

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
      this.scene.start(LevelScene.KEY, {
        destinationScene: LevelScene.KEY,
        destinationXInTiles: 9,
        destinationYInTiles: 16,
        destinationLevel: 1,
        tilemapFileNamePrefix: "level",
        tilesetFileName: "tiles"
      } as SceneTransitionData);
      this.scene.start(UIScene.KEY);
    }
  }

}

export default GameStartScene;