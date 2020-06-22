import DialogScene from './scenes/DialogScene';
import Phaser from 'phaser';
import GameOverScene from './scenes/GameOverScene';
import UIScene from './scenes/UIScene';
import GameStartScene from './scenes/GameStartScene';
import BasecampScene from './scenes/BasecampScene';
import PreloadScene from './scenes/PreloadScene';
import AudioScene from './scenes/AudioScene';
import CombatScene from './scenes/CombatScene';
import PlatformerScene from './scenes/PlatformerScene';
import ForestScene from './scenes/ForestScene';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.WEBGL,
	width: 960,
  height: 640,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
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
      gravity: {
        y: 1600
      },
      debug: true
    }
  },
  // `PreloadScene` is the scene the player sees when the game starts
	scene: [PreloadScene, GameStartScene, ForestScene, AudioScene, UIScene]
}

export default new Phaser.Game(config);
