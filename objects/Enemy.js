"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyUpdateState = void 0;
const EnemyAsset_1 = require("./../assets/EnemyAsset");
const phaser_1 = __importDefault(require("phaser"));
const EventDispatcher_1 = __importDefault(require("../events/EventDispatcher"));
const Event_1 = require("../events/Event");
/**
 * State machine of the enemy. This affects the behavior of {@link Enemy#update}.
 * @readonly
 * @enum {number}
 */
var EnemyUpdateState;
(function (EnemyUpdateState) {
    EnemyUpdateState[EnemyUpdateState["Default"] = 0] = "Default";
    EnemyUpdateState[EnemyUpdateState["FoundPlayer"] = 1] = "FoundPlayer";
    EnemyUpdateState[EnemyUpdateState["ChasePlayer"] = 2] = "ChasePlayer";
    EnemyUpdateState[EnemyUpdateState["KnockBack"] = 3] = "KnockBack";
    EnemyUpdateState[EnemyUpdateState["AttackPlayer"] = 4] = "AttackPlayer";
})(EnemyUpdateState = exports.EnemyUpdateState || (exports.EnemyUpdateState = {}));
/**
 * The enemy sprite.
 * @class
 * @classdesc
 * Player can attack enemies and vice versa.
 */
class Enemy extends phaser_1.default.GameObjects.Sprite {
    /**
     * @param {Phaser.Scene} scene - the sceen this object belongs to
     * @param {number} x - x world coordinate of this object in pixels
     * @param {number} y - y world cooridnate of this object in pixels
     * @param {EnemyAsset} asset - the spritesheet file path of this object
     */
    constructor(scene, x, y, config) {
        super(scene, x, y, config.asset);
        // initialize member variables
        this.asset = config.asset;
        this.updateState = EnemyUpdateState.Default;
        this.elapsedTime = 0;
        this.hitPoints = config.hitPoints;
        this.knockBackDuration = config.knockBackDuration;
        this.attackInterval = config.attackInterval;
        this.attackDamage = config.attackDamage;
        this.vision = config.vision;
        // add enemy to the scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.getBody().setCollideWorldBounds(true);
        // register animations
        this.scene.anims.create({
            key: this.getIdleAnimationKey(),
            frames: this.scene.anims.generateFrameNames(this.asset, {
                prefix: EnemyAsset_1.EnemyAssetData.IdleAnimationPrefix,
                end: EnemyAsset_1.EnemyAssetData.IdleAnimationFrameEnd,
            }),
            frameRate: 8
        });
        this.scene.anims.create({
            key: this.getRunAnimationKey(),
            frames: this.scene.anims.generateFrameNames(this.asset, {
                prefix: EnemyAsset_1.EnemyAssetData.RunAnimationPrefix,
                end: EnemyAsset_1.EnemyAssetData.RunAnimationFrameEnd,
            }),
            frameRate: 8
        });
        this.setPipeline('Light2D');
    }
    /**
     * Deals some damage to the player
     * @param {Player} player - the player this enemy deals the damage to
     */
    attackPlayer(player) {
        player.receiveDamage(this.attackDamage);
    }
    /**
     * Receive some damage from the player
     * @param {number} damage - the amount of damage this enemy receives
     */
    receiveDamage(damage) {
        this.hitPoints = Math.max(0, this.hitPoints - damage);
        const canvasViewPosition = this.computeCanvasViewPosition();
        EventDispatcher_1.default.getInstance().emit(Event_1.Event.Damage, { damage: damage, x: canvasViewPosition.x, y: canvasViewPosition.y });
        // enemey flash effect
        this.scene.tweens.add({
            targets: this,
            duration: 60,
            repeat: 4,
            alpha: { from: 0, to: 1 }
        });
        // die
        if (this.hitPoints === 0) {
            this.destroy();
        }
    }
    /**
     * Kock this enemy back with given direction and magnitude. Use this effect
     * when the enemy receives damage from the player.
     * @param {Phaser.Math.Vector2} velocity - the direction and magnitude to be knocked back
     */
    knockBack(velocity) {
        this.updateState = EnemyUpdateState.KnockBack;
        this.elapsedTime = 0;
        this.getBody().setVelocity(velocity.x, velocity.y);
    }
    /**
     * Update the enemy. This should be called every frame.
     * @param {Player} player - the reference to the player
     * @param {number} delta - the time elapsed since last frame
     */
    update(player, delta) {
        if (this.updateState === EnemyUpdateState.Default) {
            const distanceToPlayer = this.getCenter().distance(player.getCenter());
            if (distanceToPlayer < this.vision) {
                this.updateState = EnemyUpdateState.FoundPlayer;
                this.elapsedTime = 0;
            }
            else {
                this.moveRandomly();
            }
        }
        else if (this.updateState === EnemyUpdateState.FoundPlayer) {
            const canvasViewPosition = this.computeCanvasViewPosition();
            EventDispatcher_1.default.getInstance().emit(Event_1.Event.EnemyFoundPlayer, { x: canvasViewPosition.x, y: canvasViewPosition.y, height: this.height });
            this.updateState = EnemyUpdateState.ChasePlayer;
            this.elapsedTime = 0;
        }
        else if (this.updateState === EnemyUpdateState.ChasePlayer) {
            const distanceToPlayer = this.getCenter().distance(player.getCenter());
            if (distanceToPlayer < this.vision) {
                this.chasePlayer(player);
            }
            else {
                this.updateState = EnemyUpdateState.Default;
                this.elapsedTime = 0;
                this.getBody().setVelocity(0, 0);
            }
        }
        else if (this.updateState === EnemyUpdateState.KnockBack) {
            if (this.elapsedTime > this.knockBackDuration) {
                const distanceToPlayer = this.getCenter().distance(player.getCenter());
                if (distanceToPlayer < this.vision) {
                    this.updateState = EnemyUpdateState.ChasePlayer;
                }
                else {
                    this.updateState = EnemyUpdateState.Default;
                }
                this.elapsedTime = 0;
                this.getBody().setVelocity(0, 0);
            }
        }
        else if (this.updateState === EnemyUpdateState.AttackPlayer) {
            if (this.elapsedTime > this.attackInterval) {
                const distanceToPlayer = this.getCenter().distance(player.getBodyCenter());
                // max distance between player and enemy when they touch each other
                const attackRadius = Math.sqrt(Math.pow((player.getBody().width + this.getBody().width) / 2, 2) +
                    Math.pow((player.getBody().height + this.getBody().height) / 2, 2));
                if (distanceToPlayer < attackRadius) {
                    this.attackPlayer(player);
                    this.updateState = EnemyUpdateState.AttackPlayer;
                }
                else if (distanceToPlayer < this.vision) {
                    this.updateState = EnemyUpdateState.ChasePlayer;
                }
                else {
                    this.updateState = EnemyUpdateState.Default;
                }
                this.elapsedTime = 0;
            }
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
        if (this.getBody().velocity.x > 0) {
            this.setFlipX(false);
        }
        else if (this.getBody().velocity.x < 0) {
            this.setFlipX(true);
        }
        this.elapsedTime += delta;
    }
    /**
     * Get current update state of the enemy.
     * @return {EnemyUpdateState} - the current update state
     */
    getUpdateState() {
        return this.updateState;
    }
    /**
     * Set the current update state of the enemy.
     * @param {EnemyUpdateState} state - the state to update to
     */
    setUpdateState(state) {
        this.updateState = state;
    }
    /**
     * Update the velocity to approach the player
     * @param player - the player to approach
     */
    chasePlayer(player) {
        const playerLocation = player.getCenter();
        this.getBody().setVelocity(playerLocation.x - this.x, playerLocation.y - this.y);
        this.getBody().velocity.normalize().scale(Enemy.MOVE_SPEED);
    }
    /**
     * Move in random direction.
     */
    moveRandomly() {
        const takeActionProbability = 0.01;
        const shouldTakeAction = Math.random() < takeActionProbability;
        if (shouldTakeAction) {
            // idle
            if (this.getBody().velocity.x === 0 && this.getBody().velocity.y === 0) {
                const choice = Math.random();
                // move up
                if (choice < 0.25) {
                    this.getBody().setVelocity(0, -Enemy.MOVE_SPEED);
                }
                // move left
                else if (choice < 0.5) {
                    this.getBody().setVelocity(-Enemy.MOVE_SPEED, 0);
                    this.setFlipX(true);
                }
                // move down
                else if (choice < 0.75) {
                    this.getBody().setVelocity(0, Enemy.MOVE_SPEED);
                }
                // move right
                else {
                    this.getBody().setVelocity(Enemy.MOVE_SPEED, 0);
                    this.setFlipX(false);
                }
            }
            else {
                this.getBody().setVelocity(0, 0);
            }
        }
    }
    /**
     * Get the physics body.
     * @return {Phaser.Physics.Arcade.Body} - the physics body
     */
    getBody() {
        return this.body;
    }
    /**
     * Compute the position in pixels of this object in canvas coordinate system
     * @return {Phaser.Math.Vector2} - the position in pixels relative to canvas coordinate system
     */
    computeCanvasViewPosition() {
        const cameraTopLeftX = this.scene.cameras.main.worldView.x;
        const cameraTopLeftY = this.scene.cameras.main.worldView.y;
        const ratioX = (this.x - cameraTopLeftX) / this.scene.cameras.main.width;
        const ratioY = (this.y - cameraTopLeftY) / this.scene.cameras.main.height;
        const canvasWidth = this.scene.cameras.main.width * this.scene.cameras.main.zoom;
        const canvasHeight = this.scene.cameras.main.height * this.scene.cameras.main.zoom;
        return new phaser_1.default.Math.Vector2(ratioX * canvasWidth, ratioY * canvasHeight);
    }
    /**
     * Get the key for idle animation.
     */
    getIdleAnimationKey() {
        return `${this.asset}:${EnemyAsset_1.EnemyAssetData.IdleAnimationPrefix}`;
    }
    /**
     * Get the key for running animation.
     */
    getRunAnimationKey() {
        return `${this.asset}:${EnemyAsset_1.EnemyAssetData.RunAnimationPrefix}`;
    }
}
// how fast the enemy moves
Enemy.MOVE_SPEED = 48;
exports.default = Enemy;
//# sourceMappingURL=Enemy.js.map