import Phaser from 'phaser'

import GameScene from './scenes/GameScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
  height: 600,
  zoom: 1.5,
	physics: {
		default: 'arcade'
	},
	scene: [GameScene]
}

export default new Phaser.Game(config)