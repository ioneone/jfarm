import { Events } from './../events/Events';
import { FontAsset } from '../assets/FontAsset';
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import EventDispatcher from '../events/EventDispatcher';

/**
 * The scene that shows game title.
 * @class
 * @classdesc
 * This scene promps the player to start the game.
 */
class GameStartScene extends BaseScene
{

  // the unique id of this scene
  public static readonly KEY = "GameStartScene";

  // how often the helper text `press Enter to start` blinks in ms
  private static readonly BLINK_INTERVAL_IN_MS = 600;

  // reference to the ENTER key for starting the game
  private keyEnter?: Phaser.Input.Keyboard.Key;

  // Elapsed time since the helper text's visibility changed.
  // This is used to check when to blink the helper text.
  private elapsedTime: number;

  // the helper text that prompts the user to press enter to start the game
  private helperText?: Phaser.GameObjects.BitmapText;

  constructor()
  {
    super(GameStartScene.KEY);
    this.elapsedTime = 0;
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
    super.init(data);
    this.elapsedTime = 0;
  }

  /**
   * Scenes can have a preload method, which is always called before the Scenes 
   * create method, allowing you to preload assets that the Scene may need.
   */
  public preload(): void
  {
    super.preload();
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
    super.create(data);

    this.keyEnter = this.input.keyboard.addKey('ENTER');

    const title = "SHINING SOUL J";
    const titleFontSize = 24;

    const helperTextContent = "press ENTER to start";
    const helperTextFontSize = 12;

    const spacingBetweenTitleAndHelperText = 24;

    // draw texts on the center of the screen
    const titleText = this.add.bitmapText(this.cameras.main.centerX, 
      this.cameras.main.centerY, FontAsset.PressStart2P, title, titleFontSize).setOrigin(0.5, 0.5);
    this.helperText = this.add.bitmapText(this.cameras.main.centerX, 
      this.cameras.main.centerY + titleText.height / 2 + spacingBetweenTitleAndHelperText, 
      FontAsset.PressStart2P, helperTextContent, helperTextFontSize).setOrigin(0.5, 0);

  }

  /**
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time
   * @param {number} delta - the delta time in ms since the last frame
   */
  public update(time: number, delta: number): void
  {
    this.elapsedTime += delta;
    if (this.elapsedTime > GameStartScene.BLINK_INTERVAL_IN_MS)
    {
      this.elapsedTime %= GameStartScene.BLINK_INTERVAL_IN_MS;
      this.helperText?.setVisible(!this.helperText.visible);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyEnter!))
    {
      EventDispatcher.getInstance().emit(Events.Event.StartGame, { scene: this });
    }
  }

}

export default GameStartScene;