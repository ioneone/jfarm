import Phaser from 'phaser';
import Enemy from './Enemy';
import { EnemyAsset } from '../assets/EnemyAsset';

class OrcWarrior extends Enemy
{
  constructor(scene: Phaser.Scene, x: number, y: number)
  {
    super(scene, x, y, EnemyAsset.OrcWarrior);
  }
}

export default OrcWarrior;