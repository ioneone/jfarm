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
    thrustUpAnimationId: string;
    thrustLeftAnimationId: string;
    thrustDownAnimationId: string;
    thrustRightAnimationId: string;
  },

  hair: {
    spritesheetId: string;
    walkUpAnimationId: string;
    walkLeftAnimationId: string;
    walkDownAnimationId: string;
    walkRightAnimationId: string;
    thrustUpAnimationId: string;
    thrustLeftAnimationId: string;
    thrustDownAnimationId: string;
    thrustRightAnimationId: string;
  },

  legs: {
    spritesheetId: string;
    walkUpAnimationId: string;
    walkLeftAnimationId: string;
    walkDownAnimationId: string;
    walkRightAnimationId: string;
    thrustUpAnimationId: string;
    thrustLeftAnimationId: string;
    thrustDownAnimationId: string;
    thrustRightAnimationId: string;
  },

  torso: {
    spritesheetId: string;
    walkUpAnimationId: string;
    walkLeftAnimationId: string;
    walkDownAnimationId: string;
    walkRightAnimationId: string;
    thrustUpAnimationId: string;
    thrustLeftAnimationId: string;
    thrustDownAnimationId: string;
    thrustRightAnimationId: string;
  },

  feet: {
    spritesheetId: string;
    walkUpAnimationId: string;
    walkLeftAnimationId: string;
    walkDownAnimationId: string;
    walkRightAnimationId: string;
    thrustUpAnimationId: string;
    thrustLeftAnimationId: string;
    thrustDownAnimationId: string;
    thrustRightAnimationId: string;
  },

  shadow: {
    spritesheetId: string;
    walkUpAnimationId: string;
    walkLeftAnimationId: string;
    walkDownAnimationId: string;
    walkRightAnimationId: string;
    thrustUpAnimationId: string;
    thrustLeftAnimationId: string;
    thrustDownAnimationId: string;
    thrustRightAnimationId: string;
  },

  weapon: {
    spritesheetId: string;
    walkUpAnimationId: string;
    walkLeftAnimationId: string;
    walkDownAnimationId: string;
    walkRightAnimationId: string;
    thrustUpAnimationId: string;
    thrustLeftAnimationId: string;
    thrustDownAnimationId: string;
    thrustRightAnimationId: string;
  }

}

export default CharacterConfig;