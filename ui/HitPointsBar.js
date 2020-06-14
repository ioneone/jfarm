"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UIAsset_1 = require("./../assets/UIAsset");
const EventDispatcher_1 = __importDefault(require("../events/EventDispatcher"));
const FontAsset_1 = require("../assets/FontAsset");
const phaser_1 = __importDefault(require("phaser"));
const Event_1 = require("../events/Event");
/**
 * UI for displaying the player's current hit points
 * @class
 * @classdesc
 * This class listens for {@link Event#PlayerHpChange} event and updates the
 * UI accordingly.
 */
class HitPointsBar extends phaser_1.default.GameObjects.Container {
    /**
     * @param {Phaser.Scene} scene - the scene this object belongs to
     * @param {number} x - the x world coordinate in pixels
     * @param {number} y - the y world coordinate in pixels
     */
    constructor(scene, x, y) {
        super(scene, x, y);
        // add this container to the scene
        this.scene.add.existing(this);
        // initialize memeber variables
        this.hpText = new phaser_1.default.GameObjects.BitmapText(this.scene, 0, HitPointsBar.SPACING, FontAsset_1.FontAsset.PressStart2P, "HP", HitPointsBar.HP_TEXT_FONT_SIZE);
        const firstHeart = new phaser_1.default.GameObjects.Sprite(this.scene, this.hpText.width + HitPointsBar.SPACING, 0, UIAsset_1.UIAsset.HeartFull)
            .setOrigin(0, 0).setScale(2);
        const secondHeart = new phaser_1.default.GameObjects.Sprite(this.scene, firstHeart.x + firstHeart.getBounds().width, 0, UIAsset_1.UIAsset.HeartFull)
            .setOrigin(0, 0).setScale(2);
        const thirdHeart = new phaser_1.default.GameObjects.Sprite(this.scene, secondHeart.x + secondHeart.getBounds().width, 0, UIAsset_1.UIAsset.HeartFull)
            .setOrigin(0, 0).setScale(2);
        const fourthHeart = new phaser_1.default.GameObjects.Sprite(this.scene, thirdHeart.x + thirdHeart.getBounds().width, 0, UIAsset_1.UIAsset.HeartFull)
            .setOrigin(0, 0).setScale(2);
        this.heartSprites = [firstHeart, secondHeart, thirdHeart, fourthHeart];
        // add ui components to container
        this.add(this.hpText);
        this.add(this.heartSprites);
        // event handling
        EventDispatcher_1.default.getInstance().on(Event_1.Event.PlayerHpChange, this.handlePlayerHpChangeEvent, this);
        // clean up listeners when removed
        this.scene.events.on(phaser_1.default.Scenes.Events.SHUTDOWN, () => {
            EventDispatcher_1.default.getInstance().off(Event_1.Event.PlayerHpChange, this.handlePlayerHpChangeEvent, this);
        });
    }
    /**
     * Callback for receiving {@link Event#PlayerHpChange} event.
     * @param {DamageEventData} data - the data associated with the event
     */
    handlePlayerHpChangeEvent(data) {
        const currentHitPoints = data.currentHitPoints;
        const numFullHearts = Math.floor(currentHitPoints / 2);
        const hasHalfHeart = currentHitPoints % 2 !== 0;
        for (let i = 0; i < this.heartSprites.length; i++) {
            if (i < numFullHearts) {
                this.heartSprites[i].setTexture(UIAsset_1.UIAsset.HeartFull);
            }
            else {
                if (i === numFullHearts && hasHalfHeart) {
                    this.heartSprites[i].setTexture(UIAsset_1.UIAsset.HeartHalf);
                }
                else {
                    this.heartSprites[i].setTexture(UIAsset_1.UIAsset.HeartEmpty);
                }
            }
        }
        // flash animation
        this.scene.tweens.addCounter({
            duration: 50,
            from: 255,
            to: 0,
            onUpdate: (tween) => {
                const value = Math.floor(tween.getValue());
                const tintColor = phaser_1.default.Display.Color.GetColor(value, value, value);
                this.heartSprites.forEach(heartSprite => heartSprite.setTintFill(tintColor));
                this.hpText.setTint(tintColor);
            },
            onComplete: () => {
                this.heartSprites.forEach(heartSprite => heartSprite.clearTint());
                this.hpText.clearTint();
            },
            loop: 2,
            yoyo: true
        });
    }
}
// the font size of the text "HP"
HitPointsBar.HP_TEXT_FONT_SIZE = 18;
// the spacing used for layout
HitPointsBar.SPACING = 6;
exports.default = HitPointsBar;
//# sourceMappingURL=HitPointsBar.js.map