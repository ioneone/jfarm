import Phaser from 'phaser'
import CharacterConfig from '../configs/CharacterConfig';
import Character, { Direction } from './Character';

class NonPlayer extends Character
{
  
  constructor(config: CharacterConfig, x?: number, y?: number)
  {
    super(config, x, y);

    // prevent it from being pushed 
    this.getBody().setImmovable();
  }

  public update()
  {

    const probability = 0.01;
    const shouldTakeAction = Math.random() < probability;
    
    if (shouldTakeAction)
    {
      // idle
      if (!this.getBody().velocity.x && !this.getBody().velocity.y)
      {
        const choice = Math.random();

        if (choice < 0.25)
        {
          this.move(Direction.Up);
        }
        else if (choice < 0.5)
        {
          this.move(Direction.Left);
        }
        else if (choice < 0.75)
        {
          this.move(Direction.Down);
        }
        else 
        {
          this.move(Direction.Right);
        }

      }
      // moving
      else 
      {
        this.stopMoving();
      }
    }

    // prevent it from pushing other objects
    if (!this.getBody().touching.none)
    {
      this.stopMoving();
    }

    this.updateFrame();
    
  }

}

export default NonPlayer;