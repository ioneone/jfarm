import Phaser from 'phaser';

interface CharacterConfig
{

  scene: Phaser.Scene;

  faceUpFrameNumber: number;
  faceLeftFrameNumber: number;
  faceDownFrameNumber: number;
  faceRightFrameNumber: number;

  body: {
    spritesheetId: string;
    walkUpAnimationId: string;
    walkLeftAnimationId: string;
    walkDownAnimationId: string;
    walkRightAnimationId: string;
  },

  hair: {
    spritesheetId: string;
    walkUpAnimationId: string;
    walkLeftAnimationId: string;
    walkDownAnimationId: string;
    walkRightAnimationId: string;
  },

  legs: {
    spritesheetId: string;
    walkUpAnimationId: string;
    walkLeftAnimationId: string;
    walkDownAnimationId: string;
    walkRightAnimationId: string;
  },

  torso: {
    spritesheetId: string;
    walkUpAnimationId: string;
    walkLeftAnimationId: string;
    walkDownAnimationId: string;
    walkRightAnimationId: string;
  },

  feet: {
    spritesheetId: string;
    walkUpAnimationId: string;
    walkLeftAnimationId: string;
    walkDownAnimationId: string;
    walkRightAnimationId: string;
  },

  shadow: {
    spritesheetId: string;
    walkUpAnimationId: string;
    walkLeftAnimationId: string;
    walkDownAnimationId: string;
    walkRightAnimationId: string;
  }

}

export default CharacterConfig;