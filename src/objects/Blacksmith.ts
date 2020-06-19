import NonPlayerCharacter, { NonPlayerCharacterState } from "./NonPlayerCharacter";

import Phaser from 'phaser';
import Assets from '~/assets/Assets';

class Blacksmith extends NonPlayerCharacter
{

  constructor(scene: Phaser.Scene, x: number, y: number)
  {
    super(scene, x, y, {
      asset: Assets.Asset.NonPlayerCharacter.Blacksmith,
      paragraph1: "I'm the Blacksmith. I haven't been implemented yet."
    });
  }

  public update()
  {
    if (this.currentState === NonPlayerCharacterState.Default)
    {
      
    }
    else if (this.currentState === NonPlayerCharacterState.Talking)
    {
      this.getBody().setVelocity(0, 0);
    }

    if (this.getBody().velocity.x === 0 && this.getBody().velocity.y === 0)
    {
      this.anims.play(this.getIdleAnimationKey(), true);
    }
    else
    {
      this.anims.play(this.getRunAnimationKey(), true);
    }

    if (this.getBody().velocity.x > 0)
    {
      this.setFlipX(false);
    }
    else if (this.getBody().velocity.x < 0)
    {
      this.setFlipX(true);
    }
  }

}

export default Blacksmith;