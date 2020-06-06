import Phaser from 'phaser'
import GameScene from './scenes/GameScene'
import UIScene from './scenes/UIScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 320,
  height: 260,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: 2
  },
	physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
	},
	scene: [GameScene, UIScene]
}

export default new Phaser.Game(config)
