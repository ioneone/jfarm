import Phaser from 'phaser';
import GameOverScene from './scenes/GameOverScene';
import UIScene from './scenes/UIScene';
import GameStartScene from './scenes/GameStartScene';
import LevelScene from './scenes/LevelScene';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.WEBGL,
	width: 640,
  height: 520,
  // create canvas in div with id "phaser"
  parent: "phaser",
  render: {
    // prevent tile bleeding
    antialiasGL: false,
    // prevent pixel art from becoming blurre when scaled
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
  // GameStartScene is the scene the player sees when the game starts. 
  // UIScene should be on top of LevelScene.
	scene: [GameStartScene, GameOverScene, LevelScene, UIScene]
}

export default new Phaser.Game(config);
