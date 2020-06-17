import { FontAsset } from './../assets/FontAsset';
import BaseScene from "./BaseScene";
import { AudioAsset } from '~/assets/AudioAsset';
import EventDispatcher from '~/events/EventDispatcher';
import Player, { PlayerState } from '~/objects/Player';
import NonPlayerCharacter, { NonPlayerCharacterState } from '~/objects/NonPlayerCharacter';

/**
 * This scene handles the player-npc dialog stytem.
 * @class
 * @classdesc
 * ...
 */
class DialogScene extends BaseScene
{

  public static readonly KEY = "DialogScene";

  private texts?: string[];

  private currentText?: string;

  private currentPage?: number;

  private currentBitmapText?: Phaser.GameObjects.BitmapText;

  private timerEvent?: Phaser.Time.TimerEvent;

  private textAudio?: Phaser.Sound.BaseSound;

  private keyJ?: Phaser.Input.Keyboard.Key;
  

  /**
   * This is called only once when you start the game. Every time a scene is 
   * created using methods like `scene.start()`, `constructor()` will not be 
   * called (`init()` will still be called though).
   */
	constructor()
	{
    super(DialogScene.KEY);
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
    this.texts = [
      "Hey there! How is the life going? I'm doing pretty well...",
      "You can walk down and enter the dungeon:)"
    ];
    this.currentText = "";
    this.currentPage = 0;
    this.player = data.player;
    this.npc = data.npc;
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

    this.keyJ = this.input.keyboard.addKey('J');

    const dialogWidth = this.cameras.main.width - 48;
    const dialogHeight = 96;
    const dialogBox = this.add.rectangle(
      24, 
      this.cameras.main.height - dialogHeight - 24,
      dialogWidth, 
      dialogHeight, 
      0x000000
    ).setStrokeStyle(1, 0xffffff)
     .setOrigin(0, 0);

    this.currentBitmapText = this.add.bitmapText(0, 0, FontAsset.PressStart2P, this.currentText, 18)
      .setMaxWidth(dialogBox.width - 32)
      .setPosition(dialogBox.x + 16, dialogBox.y + 16);

    // animate the text
    this.timerEvent = this.time.addEvent({
      delay: 40,
      callback: this.updateCurrentText,
      callbackScope: this,
      loop: true
    });

    this.textAudio = this.sound.add(AudioAsset.Text);
  }

  /**
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time
   * @param {number} delta - the delta time in ms since the last frame
   */
  public update(time: number, delta: number)
  {

    if (Phaser.Input.Keyboard.JustDown(this.keyJ!))
    {

      // finish current page
      if (this.currentText?.length !== this.texts![this.currentPage!].length)
      {
        this.currentText = this.texts![this.currentPage!];
        this.currentBitmapText!.setText(this.currentText!);
        this.timerEvent!.remove();
        this.textAudio!.stop();  
        return; 
      }

      // is there next page?
      if (this.currentPage === this.texts!.length - 1)
      {
        EventDispatcher.getInstance().emit('dialogends', { scene: this, player: this.player, npc: this.npc });
      }
      else
      {
        this.currentPage! += 1;
        this.currentText = "";

        // animate the text
        this.timerEvent = this.time.addEvent({
          delay: 40,
          callback: this.updateCurrentText,
          callbackScope: this,
          loop: true
        });
      }
    }
    
  }

  private updateCurrentText()
  {
    this.currentText += this.texts![this.currentPage!][this.currentText!.length];
    this.currentBitmapText!.setText(this.currentText!);
    if (!this.textAudio?.isPlaying)
    {
      this.textAudio!.play();
    }

    // finish current page
    if (this.currentText?.length === this.texts![this.currentPage!].length)
    {
      this.timerEvent!.remove();
      this.textAudio!.stop();      
    }
  }
}

export default DialogScene;