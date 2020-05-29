import Phaser from 'phaser';

/**
 * BackgroundAudioScene is responsible for playing
 * background music of the scene. This is the base 
 * class for all the game scenes.
 */
class BackgroundAudioScene extends Phaser.Scene
{
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
  }

  update()
  {
  }
}

export default BackgroundAudioScene;