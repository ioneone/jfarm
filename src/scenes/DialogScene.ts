import { Events } from '../events/Events';
import { FontAsset } from './../assets/FontAsset';
import BaseScene from "./BaseScene";
import { AudioAsset } from '../assets/AudioAsset';
import EventDispatcher from '../events/EventDispatcher';
import Player, { PlayerState } from '../objects/Player';
import NonPlayerCharacter, { NonPlayerCharacterState } from '../objects/NonPlayerCharacter';

/**
 * The data this scene receives for initialization.
 */
export interface DialogSceneData
{
  // reference to the player so we can update its state when this scene ends
  player: Player;
  // reference to the npc so we can get what text to show
  npc: NonPlayerCharacter;
}

/**
 * This scene handles the player-npc dialog stytem.
 * @class
 * @classdesc
 * This class assumes the array of messages the NPC has are short enough to fit 
 * in two lines. When this scene starts, the player and NPC's state should be set 
 * to `Talking`. When this scene ends, it sets NPC's state to `Default` and 
 * the player's state to `FinishTalking`, which adds a little delay before 
 * the player's state is set to `Default`. Otherwise, the player will immediately 
 * initiates a conversation again because the same key is registered for starting 
 * a dialog scene and exiting a dialog scene.
 */
class DialogScene extends BaseScene
{

  // the id of this scene
  public static readonly KEY = "DialogScene";

  // the raw text to display
  private paragraphs?: string[];

  // the raw text to display now
  private currentText?: string;

  // current index of the paragraph to show
  private currentPage?: number;

  // the actual game object representing `currentText`
  private currentBitmapText?: Phaser.GameObjects.BitmapText;

  // the referenece to the timer event for animating the text
  private timerEvent?: Phaser.Time.TimerEvent;

  // press J to display all texts of current page or exit current page
  private keyJ?: Phaser.Input.Keyboard.Key;
  
  // reference to the player to update its state when this scene dies
  private player?: Player;

  // referene to the npc to update its state when this scene dies
  private npc?: NonPlayerCharacter;

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
   * @param {DialogSceneData} data - the data being passed when the scene manager starts this scene
   */
  public init(data: DialogSceneData): void
  {
    this.npc = data.npc;
    this.player = data.player;
    this.paragraphs = this.npc.getParagraphs(); 
    this.currentText = "";
    this.currentPage = 0;
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
   * @param {DialogSceneData} data - the data being passed when the scene manager starts this scene
   */
  public create(data: DialogSceneData)
  {
    this.keyJ = this.input.keyboard.addKey('J');

    // constants for dialog
    const dialogSpacing = 24;
    const textBoxSpacing = 16;
    const dialogWidth = this.cameras.main.width - dialogSpacing * 2;
    const dialogHeight = 96;
    
    const dialogBox = this.add.rectangle(
      dialogSpacing, 
      this.cameras.main.height - dialogHeight - dialogSpacing,
      dialogWidth, 
      dialogHeight, 
      0x000000
    ).setStrokeStyle(1, 0xffffff)
     .setOrigin(0, 0);

    this.currentBitmapText = this.add.bitmapText(0, 0, FontAsset.PressStart2P, this.currentText, 18)
      .setMaxWidth(dialogBox.width - 32)
      .setPosition(dialogBox.x + textBoxSpacing, dialogBox.y + textBoxSpacing);

    // animate the text
    this.timerEvent = this.time.addEvent({
      delay: 40,
      callback: this.updateCurrentText,
      callbackScope: this,
      loop: true
    });

    
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

      // is the text still animating?
      if (this.currentText?.length !== this.paragraphs![this.currentPage!].length)
      {
        this.currentText = this.paragraphs![this.currentPage!];
        this.currentBitmapText!.setText(this.currentText!);
        this.timerEvent!.remove();
        EventDispatcher.getInstance().emit(Events.Event.NPCStopsTalking);
        return; 
      }

      // is there next page?
      if (this.currentPage === this.paragraphs!.length - 1)
      {
        this.player!.setCurrentState(PlayerState.FinishTalking);
        this.npc!.setCurrentState(NonPlayerCharacterState.Default);
        EventDispatcher.getInstance().emit(Events.Event.DialogEnds, { scene: this });
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

  /**
   * Timer callback for animating the text
   */
  private updateCurrentText(): void
  {
    this.currentText += this.paragraphs![this.currentPage!][this.currentText!.length];
    this.currentBitmapText!.setText(this.currentText!);
    EventDispatcher.getInstance().emit(Events.Event.NPCTalking);

    // no more text to show from current page
    if (this.currentText?.length === this.paragraphs![this.currentPage!].length)
    {
      this.timerEvent!.remove();
      EventDispatcher.getInstance().emit(Events.Event.NPCStopsTalking);  
    }
  }
}

export default DialogScene;