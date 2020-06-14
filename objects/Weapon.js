"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AudioAsset_1 = require("../assets/AudioAsset");
const phaser_1 = __importDefault(require("phaser"));
const Player_1 = __importDefault(require("./Player"));
/**
 * The weapon the player holds.
 * @class
 * @classdesc
 * If there is a collision between the weapon and an enemy, the enemy will
 * rececive a damage. The weapon is lethal only when it has angular velocity.
 * It won't deal any damage when it's still.
 */
class Weapon extends phaser_1.default.GameObjects.Sprite {
    /**
     * @param {Phaser.Scene} scene - the scene this object belongs to
     * @param {WeaponModel} model - the weapon image file path
     */
    constructor(scene, model) {
        super(scene, 0, 0, model.asset);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.model = model;
        // the origin of the rotation is where you grab the weapon
        this.setOrigin(0.5, 1);
        // use circle for collision body because arcade physics does not support collision body rotation
        this.getBody().setCircle(Weapon.COLLISON_CIRCLE_RADIUS);
        // prevent the enemy from push the weapon
        this.getBody().setImmovable(true);
        this.prevAngle = 0;
        this.prevFlipX = false;
    }
    /**
     * This should be called every frame. The weapon follows the player.
     * @param {Player} player
     */
    update(player) {
        this.flipX = player.flipX;
        if (this.getBody().angularVelocity === 0) {
            this.angle = 0;
            if (player.isActivatingWeapon()) {
                this.scene.sound.play(AudioAsset_1.AudioAsset.Swing);
                if (this.flipX) {
                    this.getBody().setAngularVelocity(-Weapon.ANGULAR_VELOCITY);
                }
                else {
                    this.getBody().setAngularVelocity(Weapon.ANGULAR_VELOCITY);
                }
            }
        }
        else {
            if (this.prevAngle * this.angle < 0) {
                this.getBody().setAngularVelocity(0);
            }
        }
        if (this.flipX !== this.prevFlipX) {
            this.setAngle(-this.angle);
            this.getBody().setAngularVelocity(-this.getBody().angularVelocity);
        }
        if (this.flipX) {
            this.setPosition(player.x - Player_1.default.HANDS_OFFSET_X, player.y + Player_1.default.HANDS_OFFSET_Y);
        }
        else {
            this.setPosition(player.x + Player_1.default.HANDS_OFFSET_X, player.y + Player_1.default.HANDS_OFFSET_Y);
        }
        // distance from center of rotation of the weapon (origin) to center of the weapon physics body (circle)
        const rotationRadius = this.height - Weapon.COLLISON_CIRCLE_RADIUS;
        this.getBody().setOffset(rotationRadius * Math.sin(this.angle * Math.PI / 180), rotationRadius - rotationRadius * Math.cos(this.angle * Math.PI / 180));
        this.prevAngle = this.angle;
        this.prevFlipX = this.flipX;
    }
    /**
     * Get the physics body
     * @return {Phaser.Physics.Arcade.Body} - the physics body
     */
    getBody() {
        return this.body;
    }
    /**
     * Update the model. It also updates the texture based on the model.
     * @param {WeaponModel} model - the model of the weapon
     */
    setModel(model) {
        this.model = model;
        this.setTexture(model.asset);
    }
    /**
     * Get the model of this weapon.
     * @return {WeaponModel}
     */
    getModel() {
        return this.model;
    }
}
// the speed the weapon moves in degree per second
Weapon.ANGULAR_VELOCITY = 1600;
// the raidus of the collision circle
Weapon.COLLISON_CIRCLE_RADIUS = 5;
exports.default = Weapon;
//# sourceMappingURL=Weapon.js.map