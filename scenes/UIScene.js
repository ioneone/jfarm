"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UIAsset_1 = require("../assets/UIAsset");
const AudioAsset_1 = require("../assets/AudioAsset");
const WeaponAsset_1 = require("../assets/WeaponAsset");
const FontAsset_1 = require("../assets/FontAsset");
const phaser_1 = __importDefault(require("phaser"));
const EventDispatcher_1 = __importDefault(require("../events/EventDispatcher"));
const Event_1 = require("../events/Event");
const HitPointsBar_1 = __importDefault(require("../ui/HitPointsBar"));
const Inventory_1 = __importDefault(require("../ui/Inventory"));
const BaseScene_1 = __importDefault(require("./BaseScene"));
/**
 * The user interface scene.
 * @class
 * @classdesc
 * This scene should always be active except when
 * {@link GameStartScene} or {@link GameOverScene} is active. This scene
 * should be rendered on top of any other scene, and thus should be placed
 * as the last item of the scene list in the game config.
 */
class UIScene extends BaseScene_1.default {
    constructor() {
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
    init(data) {
        super.init(data);
    }
    /**
     * Scenes can have a preload method, which is always called before the Scenes
     * create method, allowing you to preload assets that the Scene may need.
     */
    preload() {
        super.preload();
        this.load.image(UIAsset_1.UIAsset.ItemSlotBordered);
        this.load.image(UIAsset_1.UIAsset.HeartEmpty);
        this.load.image(UIAsset_1.UIAsset.HeartFull);
        this.load.image(UIAsset_1.UIAsset.HeartHalf);
        this.load.image(WeaponAsset_1.WeaponAsset.RegularSword);
        this.load.image(WeaponAsset_1.WeaponAsset.Axe);
        this.load.image(WeaponAsset_1.WeaponAsset.Hammer);
        this.load.bitmapFont(FontAsset_1.FontAsset.PressStart2P);
        this.load.audio(this.createDefaultAudioFileConfig(AudioAsset_1.AudioAsset.EnemyFoundPlayer));
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
    create(data) {
        super.create(data);
        // create hit points bar ui
        this.hitPointsBar = new HitPointsBar_1.default(this, UIScene.HIT_POINTS_BAR_OFFSET_X, UIScene.HIT_POINTS_BAR_OFFSET_Y);
        // create inventoey ui
        this.inventory = new Inventory_1.default(this, this.cameras.main.centerX, this.cameras.main.height);
        const inventoryBounds = this.inventory.getBounds();
        this.inventory.setPosition(this.inventory.x - inventoryBounds.width / 2, this.inventory.y - inventoryBounds.height - UIScene.INVENTORY_BOTTOM_SPACING);
        // listen for custom events
        EventDispatcher_1.default.getInstance().on(Event_1.Event.Damage, this.handleDamageEvent, this);
        EventDispatcher_1.default.getInstance().on(Event_1.Event.EnemyFoundPlayer, this.handleEnemyFoundPlayer, this);
        // clean up listeners when the scene is removed
        this.events.on(phaser_1.default.Scenes.Events.SHUTDOWN, () => {
            EventDispatcher_1.default.getInstance().off(Event_1.Event.Damage, this.handleDamageEvent, this);
            EventDispatcher_1.default.getInstance().off(Event_1.Event.EnemyFoundPlayer, this.handleEnemyFoundPlayer, this);
        });
    }
    /**
     * This method is called once per game step while the scene is running.
     * @param {number} time - the current time
     * @param {number} delta - the delta time in ms since the last frame
     */
    update(time, delta) {
        var _a;
        super.update(time, delta);
        (_a = this.inventory) === null || _a === void 0 ? void 0 : _a.update();
    }
    /**
     * Callback for receiving {@link Event#Damage} event.
     * @param {DamageEventData} data - the data associated with the event
     */
    handleDamageEvent(data) {
        const damageText = this.add.bitmapText(data.x, data.y, FontAsset_1.FontAsset.PressStart2P, data.damage.toString(), UIScene.DAMAGE_FONT_SIZE);
        if (data.color) {
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
            y: '-=' + randomY.toString(),
            alpha: 0,
            duration: UIScene.DAMAGE_LIFE_DURATION_IN_MS,
            onComplete: () => {
                damageText.destroy();
            }
        });
    }
    /**
     * Callback for receiving {@link Event#EnemyFoundPlayer} event.
     * @param {EnemyFoundPlayerEventData} data - the data associated with the event
     */
    handleEnemyFoundPlayer(data) {
        const notificationText = this.add.bitmapText(data.x, data.y - data.height, FontAsset_1.FontAsset.PressStart2P, "!", UIScene.DAMAGE_FONT_SIZE);
        notificationText.setTint(0xfccba3);
        this.tweens.add({
            targets: notificationText,
            alpha: 0,
            duration: 400,
            onComplete: () => {
                notificationText.destroy();
            }
        });
        this.sound.play(AudioAsset_1.AudioAsset.EnemyFoundPlayer, { volume: 0.5 });
    }
}
// the unique id of this scene
UIScene.KEY = "UIScene";
// font size for the damage text
UIScene.DAMAGE_FONT_SIZE = 12;
// maximum pixels to move per frame for damage text
UIScene.DAMAGE_MAX_OFFSET_PER_FRAME = 8;
// duration for showing the damage text in ms
UIScene.DAMAGE_LIFE_DURATION_IN_MS = 400;
// spacing between bottom of the canvas and the inventory ui in pixels
UIScene.INVENTORY_BOTTOM_SPACING = 16;
// the offsets of the hit points bar from the canvas's top left corner
UIScene.HIT_POINTS_BAR_OFFSET_X = 16;
UIScene.HIT_POINTS_BAR_OFFSET_Y = 8;
exports.default = UIScene;
//# sourceMappingURL=UIScene.js.map