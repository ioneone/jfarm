import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOverScene';
import UIScene from './scenes/UIScene';
import GameStartScene from './scenes/GameStartScene';
import LevelScene from './scenes/LevelScene';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 640,
  height: 520,
  parent: "phaser",
  render: {
    antialiasGL: false,
    pixelArt: true
  },
  dom: {
    createContainer: true
  },
	physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
	},
	scene: [GameStartScene, GameOverScene, GameScene, LevelScene, UIScene]
}

export default new Phaser.Game(config);
