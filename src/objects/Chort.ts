import Phaser from 'phaser';
import Enemy from './Enemy';
import { EnemyAsset } from '~/assets/EnemyAsset';

class Chort extends Enemy
{
  constructor(scene: Phaser.Scene, x: number, y: number)
  {
    super(scene, x, y, EnemyAsset.Chort);
  }
}

export default Chort;