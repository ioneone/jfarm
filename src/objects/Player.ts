import Phaser from 'phaser'
import CharacterConfig from '../configs/CharacterConfig';
import Character, { Direction } from './Character';
import CharacterConfigFactory from '../factory/CharacterConfigFactory';

class Player extends Character
{

  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
    
  constructor(config: CharacterConfig, x?: number, y?: number)
  {
    super(config, x, y);

    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyS = this.scene.input.keyboard.addKey('S');
    this.keyD = this.scene.input.keyboard.addKey('D');

  }

  public update()
  {

    if (this.keyW.isDown && this.keyA.isDown)
    {
      this.move(Direction.UpLeft);
    }
    else if (this.keyS.isDown && this.keyA.isDown)
    {
      this.move(Direction.DownLeft);
    }
    else if (this.keyS.isDown && this.keyD.isDown)
    {
      this.move(Direction.DownRight);
    }
    else if (this.keyW.isDown && this.keyD.isDown)
    {
      this.move(Direction.UpRight);
    }
    else if (this.keyW.isDown)
    {
      this.move(Direction.Up);
    }
    else if (this.keyA.isDown)
    {
      this.move(Direction.Left);
    }
    else if (this.keyS.isDown)
    {
      this.move(Direction.Down);
    }
    else if (this.keyD.isDown)
    {
      this.move(Direction.Right);
    }
    else 
    {
      this.stopMoving();
    }

    this.updateFrame();

  }

}

export default Player;