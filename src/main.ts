import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOverScene';
import UIScene from './scenes/UIScene';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 320,
  height: 260,
  scale: {
    zoom: 2
  },
  parent: "phaser",
  dom: {
    createContainer: true
  },
	physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
	},
	scene: [GameScene, UIScene, GameOverScene]
}

export default new Phaser.Game(config);
