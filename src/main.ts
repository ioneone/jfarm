import Phaser from 'phaser'
import GameScene from './scenes/GameScene'
import RoomScene from './scenes/RoomScene'
import UIScene from './scenes/UIScene'
import OutdoorScene from "./scenes/OurdoorScene";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
  height: 500,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: 1.25
  },
	physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
	},
	scene: [OutdoorScene, RoomScene, UIScene]
}

export default new Phaser.Game(config)
