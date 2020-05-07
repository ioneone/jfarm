import Phaser from 'phaser'

import GameScene from './scenes/GameScene'
import GuiScene from './scenes/GuiScene';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
  height: 500,
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
