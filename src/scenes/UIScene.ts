import { UIAsset } from '../assets/UIAsset';
import { AudioAsset } from '../assets/AudioAsset';
import { WeaponAsset } from '../assets/WeaponAsset';
import { FontAsset } from '../assets/FontAsset';
import Phaser from 'phaser';
import EventDispatcher from '../events/EventDispatcher';
import HitPointsBar from '../ui/HitPointsBar';
import Inventory from '../ui/Inventory';
import BaseScene from './BaseScene';
import { Events } from '../events/Events';

/**
 * The user interface scene.
 * @class
 * @classdesc
 * This scene should always be active except when 
 * {@link GameStartScene} or {@link GameOverScene} is active. This scene 
 * should be rendered on top of any other scene, and thus should be placed 
 * as the last item of the scene list in the game config.
 */
class UIScene extends BaseScene
{

  // the unique id of this scene
  public static readonly KEY = "UIScene";

  // font size for the damage text
  private static readonly DAMAGE_FONT_SIZE = 12;

  // maximum pixels to move per frame for damage text
  private static readonly DAMAGE_MAX_OFFSET_PER_FRAME = 8;

  // duration for showing the damage text in ms
  private static readonly DAMAGE_LIFE_DURATION_IN_MS = 400;

  // spacing between bottom of the canvas and the inventory ui in pixels
  private static readonly INVENTORY_BOTTOM_SPACING = 16;

  // the offsets of the hit points bar from the canvas's top left corner
  private static readonly HIT_POINTS_BAR_OFFSET_X = 16;
  private static readonly HIT_POINTS_BAR_OFFSET_Y = 8;

  // the ui of the player's current hit points
  private hitPointsBar?: HitPointsBar;

  // the ui of the player's inventory
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
    super.init(data);
  }

  /**
   * Scenes can have a preload method, which is always called before the Scenes 
   * create method, allowing you to preload assets that the Scene may need.
   */
  public preload(): void
  {
    super.preload();
    this.load.image(UIAsset.ItemSlotBordered);
    this.load.image(UIAsset.HeartEmpty);
    this.load.image(UIAsset.HeartFull);
    this.load.image(UIAsset.HeartHalf);
    this.load.image(WeaponAsset.RegularSword);
    this.load.image(WeaponAsset.Axe);
    this.load.image(WeaponAsset.Hammer);
    this.load.bitmapFont(FontAsset.PressStart2P);
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.EnemyFoundPlayer));
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

    // create hit points bar ui
    this.hitPointsBar = new HitPointsBar(this, 
      UIScene.HIT_POINTS_BAR_OFFSET_X, UIScene.HIT_POINTS_BAR_OFFSET_Y);

    // create inventoey ui
    this.inventory = new Inventory(this, this.cameras.main.centerX, this.cameras.main.height);
    const inventoryBounds = this.inventory.getBounds();
    this.inventory.setPosition(
      this.inventory.x - inventoryBounds.width / 2,
      this.inventory.y - inventoryBounds.height - UIScene.INVENTORY_BOTTOM_SPACING
    );

    // listen for custom events
    EventDispatcher.getInstance().on(Events.Event.Damage, this.handleDamageEvent, this);
    EventDispatcher.getInstance().on(Events.Event.EnemyFoundPlayer, this.handleEnemyFoundPlayer, this);
 
    // clean up listeners when the scene is removed
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      EventDispatcher.getInstance().off(Events.Event.Damage, this.handleDamageEvent, this);
      EventDispatcher.getInstance().off(Events.Event.EnemyFoundPlayer, this.handleEnemyFoundPlayer, this);
    });
  }

  /**
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time
   * @param {number} delta - the delta time in ms since the last frame
   */
  public update(time: number, delta: number): void
  {
    super.update(time, delta);
    this.inventory?.update();
  }

  /**
   * Callback for receiving {@link Event#Damage} event.
   * @param {Events.Data.Damage} data - the data associated with the event
   */
  private handleDamageEvent(data: Events.Data.Damage): void
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

  /**
   * Callback for receiving {@link Event#EnemyFoundPlayer} event.
   * @param {Events.Data.EnemyFoundPlayer} data - the data associated with the event
   */
  private handleEnemyFoundPlayer(data: Events.Data.EnemyFoundPlayer)
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

    this.sound.play(AudioAsset.EnemyFoundPlayer, { volume: 0.5 });
  }
}

export default UIScene;