import Phaser from 'phaser'

import GameScene from './scenes/GameScene'
import GuiScene from './scenes/GuiScene';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 680,
  height: 400,
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
	scene: [GameScene, GuiScene]
}

export default new Phaser.Game(config)
