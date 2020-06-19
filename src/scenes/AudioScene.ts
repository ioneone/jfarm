import Events from '../events/Events';
import EventDispatcher from '../events/EventDispatcher';
import BaseScene from "./BaseScene";
import Assets from '~/assets/Assets';

/**
 * A scene that takes care of playing audio files for the game.
 * @class
 * @classdesc
 * This class listens for {@link Events.Event} and play appropriate audio 
 * for that event. This scene acts as the central hub handling game audio so 
 * no other scene needs to worry about what sound effect to player or when to 
 * switch background music.
 */
class AudioScene extends BaseScene
{

  // the unique id of this scene
  public static readonly KEY = "AudioScene";

  /**
   * This is called only once when you start the game. Every time a scene is 
   * created using methods like `scene.start()`, `constructor()` will not be 
   * called (`init()` will still be called though).
   */
	constructor()
	{
    super(AudioScene.KEY);
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
    const music = this.sound.add(Assets.Asset.Audio.FieldsOfIce, { volume: 0.4, loop: true });
    const textAudio = this.sound.add(Assets.Asset.Audio.Text, { volume: 0.2 });
    
    EventDispatcher.getInstance().on(Events.Event.StartGame, () => {
      music.play();
    });

    EventDispatcher.getInstance().on(Events.Event.PlayerDies, () => {
      music.stop();
    });
    
    EventDispatcher.getInstance().on(Events.Event.NPCTalking, () => {
      if (!textAudio.isPlaying)
      {
        textAudio.play();
      }
    });

    EventDispatcher.getInstance().on(Events.Event.NPCStopsTalking, () => {
      textAudio.stop();
    });

  }

  /**
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time
   * @param {number} delta - the delta time in ms since the last frame
   */
  public update(time: number, delta: number)
  {
  }

}

export default AudioScene;