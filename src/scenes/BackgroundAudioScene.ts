import Phaser from 'phaser';

/**
 * BackgroundAudioScene is responsible for playing
 * background music of the scene. This is the base 
 * class for all the game scenes.
 */
class BackgroundAudioScene extends Phaser.Scene
{

  protected keyM?: Phaser.Input.Keyboard.Key;

  /**
   * @param {string} key - The unique id of this scene 
   */
  constructor(key: string)
  {
    super(key);
  }

  preload()
  {
    this.load.audio("assets/audio/summer_day.wav", ["assets/audio/summer_day.wav"]);
  }
  
  create()
  {
    this.sound.play("assets/audio/summer_day.wav");
    this.keyM = this.input.keyboard.addKey('M');
  }

  update()
  {
    if (Phaser.Input.Keyboard.JustDown(this.keyM!))
    {
      this.sound.stopByKey("assets/audio/summer_day.wav");
    }
  }
}

export default BackgroundAudioScene;