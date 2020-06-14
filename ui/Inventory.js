"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WeaponAsset_1 = require("../assets/WeaponAsset");
const phaser_1 = __importDefault(require("phaser"));
const ItemSlot_1 = __importDefault(require("./ItemSlot"));
/**
 * UI for the player's inventory displayed at the bottom of {@link UIScene}.
 * @class
 * @classdesc
 * This class emits {@link Event#ItemSlotChange} event when the current item
 * slot changes.
 */
class Inventory extends phaser_1.default.GameObjects.Container {
    /**
     * @param {Phaser.Scene} scene - the scene this object belongs to
     * @param {number} x - the x canvas coordinate in pixels
     * @param {number} y - the y canvas coordinate in pixels
     */
    constructor(scene, x, y) {
        super(scene, x, y);
        // add this container to the scene
        this.scene.add.existing(this);
        // initialize member variables
        this.activeSlotIndex = 0;
        this.keySpace = this.scene.input.keyboard.addKey('SPACE');
        this.itemSlots = [];
        // create item slots
        this.itemSlots.push(new ItemSlot_1.default(this.scene, 0, 0, WeaponAsset_1.WeaponAsset.RegularSword));
        this.itemSlots.push(new ItemSlot_1.default(this.scene, this.itemSlots[0].x + this.itemSlots[0].getBounds().width, 0, WeaponAsset_1.WeaponAsset.Hammer));
        this.itemSlots.push(new ItemSlot_1.default(this.scene, this.itemSlots[1].x + this.itemSlots[1].getBounds().width, 0, WeaponAsset_1.WeaponAsset.Axe));
        this.itemSlots.push(new ItemSlot_1.default(this.scene, this.itemSlots[2].x + this.itemSlots[2].getBounds().width, 0));
        this.itemSlots.push(new ItemSlot_1.default(this.scene, this.itemSlots[3].x + this.itemSlots[3].getBounds().width, 0));
        this.itemSlots.push(new ItemSlot_1.default(this.scene, this.itemSlots[4].x + this.itemSlots[4].getBounds().width, 0));
        this.itemSlots.push(new ItemSlot_1.default(this.scene, this.itemSlots[5].x + this.itemSlots[5].getBounds().width, 0));
        this.itemSlots.push(new ItemSlot_1.default(this.scene, this.itemSlots[6].x + this.itemSlots[6].getBounds().width, 0));
        this.add(this.itemSlots);
        this.itemSlots[this.activeSlotIndex].setSelected(true);
    }
    /**
     * Update the selected item slot if necessary. This method should be called
     * every frame.
     */
    update() {
        if (phaser_1.default.Input.Keyboard.JustDown(this.keySpace)) {
            this.itemSlots[this.activeSlotIndex].setSelected(false);
            this.activeSlotIndex += 1;
            this.activeSlotIndex %= 8;
            this.itemSlots[this.activeSlotIndex].setSelected(true);
        }
    }
}
exports.default = Inventory;
//# sourceMappingURL=Inventory.js.map