import Phaser from 'phaser';
import Enemy from './Enemy';
import Assets from '../assets/Assets';

class OrcWarrior extends Enemy
{
  constructor(scene: Phaser.Scene, x: number, y: number)
  {
    super(scene, x, y, {
      asset: Assets.Asset.Enemy.OrcWarrior,
      attackDamage: 1,
      knockBackDuration: 200,
      attackInterval: 800,
      vision: 64,
      maxHitPoints: 100
    });
  }
}

export default OrcWarrior;