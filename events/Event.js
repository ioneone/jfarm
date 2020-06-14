"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
/**
 * Collection of custom events of the game. Events are useful when you want to
 * pass data from one scene to another. See {@link EventDispatcher} to learn
 * more about how to fire and listen for events.
 * @readonly
 * @enum {string}
 */
var Event;
(function (Event) {
    // the hit points of the player has changed
    Event["PlayerHpChange"] = "playerhpchange";
    // someone has lost hit points
    Event["Damage"] = "damage";
    // enemy sees player in its vision range
    Event["EnemyFoundPlayer"] = "EnemyFoundPlayer";
    // the selected item solot has changed
    Event["ItemSlotChange"] = "itemslotchange";
})(Event = exports.Event || (exports.Event = {}));
//# sourceMappingURL=Event.js.map