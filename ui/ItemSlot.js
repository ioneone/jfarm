"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UIAsset_1 = require("../assets/UIAsset");
const phaser_1 = __importDefault(require("phaser"));
const GrayscalePipeline_1 = __importDefault(require("../pipelines/GrayscalePipeline"));
const EventDispatcher_1 = __importDefault(require("../events/EventDispatcher"));
const Event_1 = require("../events/Event");
/**
 * UI for an item slot.
 * @class
 * @classdesc
 * UI components for {@link Inventory}. An item slot can hold an item.
 */
class ItemSlot extends phaser_1.default.GameObjects.Container {
    /**
     * @param {Phaser.Scene} scene - the scene this object belongs to
     * @param {number} x - the x canvas coordinate in pixels
     * @param {number} y - the y canvas coordinate in pixels
     * @param {WeaponAsset} weaponAsset - the weapon asset this slot is holding
     */
    constructor(scene, x, y, weaponAsset) {
        super(scene, x, y);
        // add the container to the scene
        this.scene.add.existing(this);
        // register a custom pipeline if webGL is enabled
        if (this.scene.game.renderer instanceof phaser_1.default.Renderer.WebGL.WebGLRenderer) {
            this.scene.game.renderer.addPipeline('Grayscale', new GrayscalePipeline_1.default(this.scene.game));
        }
        // initilaize memeber variables
        this.weaponAsset = weaponAsset;
        this.selected = false;
        this.slot = new phaser_1.default.GameObjects.Sprite(this.scene, 0, 0, UIAsset_1.UIAsset.ItemSlotBordered);
        this.add(this.slot);
        if (weaponAsset) {
            const item = new phaser_1.default.GameObjects.Sprite(this.scene, 0, 0, weaponAsset);
            this.add(item);
        }
        this.setScale(2);
        this.setSelected(this.selected);
    }
    /**
     * Updates the ui of this slot. If `selected` is `true`, then it also emits
     * {@link Event#ItemSlotChange} event.
     * @param {boolean} selected - whether the slot is selected or not
     */
    setSelected(selected) {
        this.selected = selected;
        if (selected) {
            this.slot.resetPipeline();
            this.setAlpha(1);
            EventDispatcher_1.default.getInstance().emit(Event_1.Event.ItemSlotChange, { currentWeaponAsset: this.weaponAsset });
        }
        else {
            this.slot.setPipeline('Grayscale');
            this.setAlpha(0.5);
        }
    }
}
exports.default = ItemSlot;
//# sourceMappingURL=ItemSlot.js.map