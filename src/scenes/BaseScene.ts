import Phaser from 'phaser';

/**
 * The base class for all the scenes.
 * @class
 * @clasdesc
 * This class includes helper functions needed for most of the scenes.
 */
class BaseScene extends Phaser.Scene
{

  // press 'I' key to toggle debug mode
  protected keyI?: Phaser.Input.Keyboard.Key;

  /**
   * This is called only once when you start the game. Every time a scene is 
   * created using methods like `scene.start()`, `constructor()` will not be 
   * called (`init()` will still be called though).
   * @param {string} key - the unique id of the scene
   */
	constructor(key: string)
	{
    super(key);
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
  public preload()
  {
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
  public create(data: any)
  {
    // get reference to the keyboard key
    this.keyI = this.input.keyboard.addKey('I');

    // by default don't show debug graphics
    this.physics.world.debugGraphic.setVisible(false);
  }

  /**
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time
   * @param {number} delta - the delta time in ms since the last frame
   */
  public update(time: number, delta: number)
  {
    if (Phaser.Input.Keyboard.JustDown(this.keyI!)) 
    {
      this.toggleDebugMode(); 
    }
  }

  /**
   * The graphics shows useful information for debugging when the debug mode 
   * is turned on. In `update()`, it checks whether a debug key (assigned in 
   * {@link BaseScene}) is pressed, and if it is, call this function.
   */
  protected toggleDebugMode(): void
  {
    // toggle built in debug display
    this.physics.world.debugGraphic.setVisible(!this.physics.world.debugGraphic.visible);
  }

  /**
   * If the key is `foo`, it assumes the file path to the image is `foo.png` 
   * and the file path to the normal map is `foo_n.png`.
   * @param {string} key - the unique id of the resource
   */
  protected createDefaultImageFileConfig(key: string): Phaser.Types.Loader.FileTypes.ImageFileConfig
  {
    return {
      key: key,
      url: `${key}.png`,
      normalMap: `${key}_n.png`
    };
  }

  /**
   * If the key is `foo`, it assumes the file path to the texture image is 
   * `foo.png`, the file path to normal map is `foo_n.png`, and the file path 
   * to the atlas is `foo.json`.
   * @param {string} key - the unique id of the resource
   */
  protected createDefaultAtlasJSONFileConfig(key: string): Phaser.Types.Loader.FileTypes.AtlasJSONFileConfig
  {
    return {
      key: key,
      textureURL: `${key}.png`,
      normalMap: `${key}_n.png`,
      atlasURL: `${key}.json`
    };
  }

  /**
   * If the key is `foo`, it assumes the file path to the audio file is 
   * `foo.wav`.
   * @param {string} key - the unique id of the resource
   */
  protected createDefaultAudioFileConfig(key: string): Phaser.Types.Loader.FileTypes.AudioFileConfig
  {
    return {
      key: key,
      url: `${key}.wav`
    };
  } 

}

export default BaseScene;