"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WeaponAsset_1 = require("./../assets/WeaponAsset");
const AudioAsset_1 = require("../assets/AudioAsset");
const PlayerAsset_1 = require("../assets/PlayerAsset");
const phaser_1 = __importDefault(require("phaser"));
const EventDispatcher_1 = __importDefault(require("../events/EventDispatcher"));
const Event_1 = require("../events/Event");
const Weapon_1 = __importDefault(require("./Weapon"));
const UIScene_1 = __importDefault(require("../scenes/UIScene"));
const GameOverScene_1 = __importDefault(require("../scenes/GameOverScene"));
const WeaponModelFactory_1 = __importDefault(require("../factory/WeaponModelFactory"));
/**
 * The player to control.
 * @class
 */
class Player extends phaser_1.default.GameObjects.Sprite {
    constructor(scene, x, y, config) {
        super(scene, x, y, config.asset);
        // initialize memeber variables
        this.asset = config.asset;
        this.hitPoints = Player.MAX_HIT_POINTS;
        this.weapon = new Weapon_1.default(this.scene, WeaponModelFactory_1.default.create(WeaponAsset_1.WeaponAsset.RegularSword));
        this.attackEnabled = true;
        // add player to the scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.getBody().setCollideWorldBounds(true);
        // get references to the keyboard
        this.keyW = this.scene.input.keyboard.addKey('W');
        this.keyA = this.scene.input.keyboard.addKey('A');
        this.keyS = this.scene.input.keyboard.addKey('S');
        this.keyD = this.scene.input.keyboard.addKey('D');
        this.keyJ = this.scene.input.keyboard.addKey('J');
        // register animations
        this.scene.anims.create({
            key: this.getIdleAnimationKey(),
            frames: this.scene.anims.generateFrameNames(this.asset, {
                prefix: PlayerAsset_1.PlayerAssetData.IdleAnimationPrefix,
                end: PlayerAsset_1.PlayerAssetData.IdleAnimationFrameEnd,
            }),
            frameRate: 8
        });
        this.scene.anims.create({
            key: this.getRunAnimationKey(),
            frames: this.scene.anims.generateFrameNames(this.asset, {
                prefix: PlayerAsset_1.PlayerAssetData.RunAnimationPrefix,
                end: PlayerAsset_1.PlayerAssetData.RunAnimationFrameEnd,
            }),
            frameRate: 8
        });
        // set collision bounds
        this.getBody().setSize(config.bodyWidth, config.bodyHeight);
        this.getBody().setOffset(config.bodyOffsetX, config.bodyOffsetY);
        // initialize event handlings
        EventDispatcher_1.default.getInstance().on(Event_1.Event.ItemSlotChange, this.handleItemSlotChange, this);
        // remove event listener when the scene is removed
        this.scene.events.on(phaser_1.default.Scenes.Events.SHUTDOWN, () => {
            EventDispatcher_1.default.getInstance().off(Event_1.Event.ItemSlotChange, this.handleItemSlotChange, this);
        });
    }
    /**
     * This method is called by enemies when they attack the player.
     * @param {number} damage - the amount of damage to receive
     */
    receiveDamage(damage) {
        this.setFrame(this.asset + PlayerAsset_1.PlayerAssetData.HitFrameKey);
        this.hitPoints = Math.max(0, this.hitPoints - damage);
        this.scene.sound.play(AudioAsset_1.AudioAsset.DamagePlayer);
        // game over
        if (this.hitPoints === 0) {
            this.scene.scene.stop(UIScene_1.default.KEY);
            this.scene.scene.start(GameOverScene_1.default.KEY);
        }
        const cameraTopLeftX = this.scene.cameras.main.worldView.x;
        const cameraTopLeftY = this.scene.cameras.main.worldView.y;
        const ratioX = (this.x - cameraTopLeftX) / this.scene.cameras.main.width;
        const ratioY = (this.y - cameraTopLeftY) / this.scene.cameras.main.height;
        const canvasWidth = this.scene.cameras.main.width * this.scene.cameras.main.zoom;
        const canvasHeight = this.scene.cameras.main.height * this.scene.cameras.main.zoom;
        EventDispatcher_1.default.getInstance().emit(Event_1.Event.Damage, { damage: damage, x: ratioX * canvasWidth, y: ratioY * canvasHeight, color: 0xff0000 });
        EventDispatcher_1.default.getInstance().emit(Event_1.Event.PlayerHpChange, { currentHitPoints: this.hitPoints });
    }
    /**
     * This should be called every frame.
     */
    update() {
        // update velocity
        if (this.keyW.isDown && this.keyA.isDown) {
            this.getBody().setVelocity(-1, -1);
            this.getBody().velocity.normalize().scale(Player.MOVE_SPEED);
        }
        else if (this.keyS.isDown && this.keyA.isDown) {
            this.getBody().setVelocity(-1, 1);
            this.getBody().velocity.normalize().scale(Player.MOVE_SPEED);
        }
        else if (this.keyS.isDown && this.keyD.isDown) {
            this.getBody().setVelocity(1, 1);
            this.getBody().velocity.normalize().scale(Player.MOVE_SPEED);
        }
        else if (this.keyW.isDown && this.keyD.isDown) {
            this.getBody().setVelocity(1, -1);
            this.getBody().velocity.normalize().scale(Player.MOVE_SPEED);
        }
        else if (this.keyW.isDown) {
            this.getBody().setVelocity(0, -Player.MOVE_SPEED);
        }
        else if (this.keyA.isDown) {
            this.getBody().setVelocity(-Player.MOVE_SPEED, 0);
        }
        else if (this.keyS.isDown) {
            this.getBody().setVelocity(0, Player.MOVE_SPEED);
        }
        else if (this.keyD.isDown) {
            this.getBody().setVelocity(Player.MOVE_SPEED, 0);
        }
        else {
            this.getBody().setVelocity(0, 0);
        }
        // update flip x
        if (this.getBody().velocity.x > 0) {
            this.setFlipX(false);
            this.weapon.setFlipX(false);
        }
        else if (this.getBody().velocity.x < 0) {
            this.setFlipX(true);
            this.weapon.setFlipX(true);
        }
        // update frame and physics body
        if (this.getBody().velocity.x === 0 && this.getBody().velocity.y === 0) {
            this.anims.play(this.getIdleAnimationKey(), true);
            this.getBody().setImmovable(true);
        }
        else {
            this.anims.play(this.getRunAnimationKey(), true);
            this.getBody().setImmovable(false);
        }
        if (this.weapon.active) {
            this.weapon.update(this);
        }
    }
    /**
     * Return whether the player is trying to attack regardless of whether the
     * player is already attacking. If this returns `true`, the weapon will
     * start to rotate.
     * @see Weapon#update
     * @return {boolean} - whether the player is trying to attack
     */
    isActivatingWeapon() {
        return this.attackEnabled && phaser_1.default.Input.Keyboard.JustDown(this.keyJ);
    }
    /**
     * Get the physics body
     * @return {Phaser.Physics.Arcade.Body} - the physics body
     */
    getBody() {
        return this.body;
    }
    /**
     * Get the weapon the player is holding
     * @return {Weapon} - the weapon player is holding
     */
    getWeapon() {
        return this.weapon;
    }
    /**
     * Get the center of the physics body
     * @return {Phaser.Math.Vector2} - the center of the physics body
     */
    getBodyCenter() {
        return new phaser_1.default.Math.Vector2(this.getBody().x + this.getBody().width / 2, this.getBody().y + this.getBody().height / 2);
    }
    setAttackEnabled(enabled) {
        this.attackEnabled = enabled;
    }
    /**
     * Get the key for idle animation.
     */
    getIdleAnimationKey() {
        return `${this.asset}:${PlayerAsset_1.PlayerAssetData.IdleAnimationPrefix}`;
    }
    /**
     * Get the key for running animation.
     */
    getRunAnimationKey() {
        return `${this.asset}:${PlayerAsset_1.PlayerAssetData.RunAnimationPrefix}`;
    }
    /**
     * Callback for {@link Event#ItemSlotChange} event.
     * @param {ItemSlotChangeEventData} data - the data associated with this event
     */
    handleItemSlotChange(data) {
        if (data.currentWeaponAsset) {
            this.weapon.setModel(WeaponModelFactory_1.default.create(data.currentWeaponAsset));
            this.weapon.getBody().setEnable(true);
            this.weapon.setVisible(true);
            this.weapon.setActive(true);
        }
        else {
            this.weapon.setVisible(false);
            this.weapon.getBody().setEnable(false);
            this.weapon.setActive(false);
        }
    }
}
// the maximum hit points of the player
Player.MAX_HIT_POINTS = 8;
// how fast the player moves
Player.MOVE_SPEED = 64;
// the offsets from origin to player's hands
Player.HANDS_OFFSET_X = 8;
Player.HANDS_OFFSET_Y = 8;
exports.default = Player;
//# sourceMappingURL=Player.js.map