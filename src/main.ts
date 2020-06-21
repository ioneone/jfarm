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

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.WEBGL,
	width: 1024,
  height: 768,
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
	scene: [PreloadScene, GameStartScene, PlatformerScene, AudioScene, UIScene]
}

export default new Phaser.Game(config);
