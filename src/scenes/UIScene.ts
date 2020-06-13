import { FontAsset, FontAssetData } from './../assets/FontAsset';
import Phaser from 'phaser';
import EventDispatcher from '../events/EventDispatcher';
import { Event, PlayerHpChangeEventData, DamageEventData, EnemyFoundPlayerEventData } from '../events/Event';
import HitPointsBar from '~/ui/HitPointsBar';
import Inventory from '~/ui/Inventory';

/**
 * The user interface scene.
 * @class
 * @classdesc
 * This scene should always be active except when 
 * {@link GameStartScene} or {@link GameOverScene} is active. This scene 
 * should be rendered on top of any other scene, and thus should be placed 
 * as the last item of the scene list in the game config.
 */
class UIScene extends Phaser.Scene
{

  // the unique id of this scene
  public static readonly KEY = "UIScene";

  // font size for the damage text
  private static readonly DAMAGE_FONT_SIZE = 12;

  // maximum pixels to move per frame for damage text
  private static readonly DAMAGE_MAX_OFFSET_PER_FRAME = 8;

  // duration for showing the damage text in ms
  private static readonly DAMAGE_LIFE_DURATION_IN_MS = 400;

  // the visualization of the player's current hit points
  private hitPointsBar?: HitPointsBar;

  private inventory?: Inventory;

  constructor()
  {
    super(UIScene.KEY);
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
    // load image
    this.load.image("assets/ui/item_slot.png", "assets/ui/item_slot.png");
    this.load.spritesheet("assets/ui/ui_heart.png", "assets/ui/ui_heart.png", { frameWidth: 16, frameHeight: 16 });

    // load font
    this.load.bitmapFont(FontAsset.PressStart2P, 
      `${FontAssetData.FilePathPrefix}/${FontAsset.PressStart2P}/${FontAsset.PressStart2P}.png`, 
      `${FontAssetData.FilePathPrefix}/${FontAsset.PressStart2P}/${FontAsset.PressStart2P}.fnt`);

    // load audio
    this.load.audio("assets/audio/enemy_found_player.wav", "assets/audio/enemy_found_player.wav");
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
    this.hitPointsBar = new HitPointsBar(this, 0, 0);

    this.inventory = new Inventory(this, 200, 460);

    EventDispatcher.getInstance().on(Event.Damage, this.handleDamageEvent, this);
    EventDispatcher.getInstance().on(Event.EnemyFoundPlayer, this.handleEnemyFoundPlayer, this);
 
    // clean up listeners when removed
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      EventDispatcher.getInstance().off(Event.Damage, this.handleDamageEvent, this);
      EventDispatcher.getInstance().off(Event.EnemyFoundPlayer, this.handleEnemyFoundPlayer, this);
    });
  
  }

  /**
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time
   * @param {number} delta - the delta time in ms since the last frame
   */
  public update(time: number, delta: number): void
  {
    this.inventory?.update();
  }

  /**
   * Callback for receiving {@link Event#Damage} event.
   * @param {DamageEventData} data - the data associated with the event
   */
  private handleDamageEvent(data: DamageEventData): void
  {
    const damageText = this.add.bitmapText(data.x, data.y, FontAsset.PressStart2P, data.damage.toString(), UIScene.DAMAGE_FONT_SIZE);
    
    if (data.color)
    {
      damageText.setTint(data.color);
    }

    const max = UIScene.DAMAGE_MAX_OFFSET_PER_FRAME;
    const min = -UIScene.DAMAGE_MAX_OFFSET_PER_FRAME;

    // -UIScene.DAMAGE_MAX_OFFSET_PER_FRAME to UIScene.DAMAGE_MAX_OFFSET_PER_FRAME
    const randomX = Math.random() * (max - min) + min;

    // 0 to UIScene.DAMAGE_MAX_OFFSET_PER_FRAME
    const randomY = Math.random() * max;
    
    this.tweens.add({
      targets: damageText,
      x: '+=' + randomX.toString(),
      y: '-=' + randomY.toString(), // the text should always go up
      alpha: 0,
      duration: UIScene.DAMAGE_LIFE_DURATION_IN_MS,
      onComplete: () => {
        damageText.destroy();
      }
    });

  }

  private handleEnemyFoundPlayer(data: EnemyFoundPlayerEventData)
  {
    const notificationText = this.add.bitmapText(data.x, data.y - data.height, 
      FontAsset.PressStart2P, "!", UIScene.DAMAGE_FONT_SIZE);
    notificationText.setTint(0xfccba3);
    this.tweens.add({
      targets: notificationText,
      alpha: 0,
      duration: 400,
      onComplete: () => {
        notificationText.destroy();
      }
    });

    this.sound.play("assets/audio/enemy_found_player.wav", { volume: 0.5 });
  }

  private handlePlayerHpChange(data: PlayerHpChangeEventData)
  {
    this.cameras.main.shake(200, 0.005);
  }

}

export default UIScene;