import Phaser from 'phaser'

import GameScene from './scenes/GameScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 512,
  height: 380,
  zoom: 1.5,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
	physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
	},
	scene: [GameScene]
}

export default new Phaser.Game(config)
