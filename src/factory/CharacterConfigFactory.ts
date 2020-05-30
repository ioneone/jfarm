import Phaser from 'phaser';
import uniqid from 'uniqid';
import CharacterConfig from "../configs/CharacterConfig";
import CharacterAsset from '../assets/CharacterAsset';

/**
 * The character spritesheet must follow the 
 * Liberated Pixel Cup (LPC) standard.
 */
class CharacterConfigFactory
{

  // LPC standard
  public static readonly NUM_COL = 13;
  public static readonly ROW_THRUST_UP = 4;
  public static readonly ROW_THRUST_LEFT = 5;
  public static readonly ROW_THRUST_DONW = 6;
  public static readonly ROW_THRUST_RIGHT = 7;
  public static readonly ROW_UP = 8;
  public static readonly ROW_LEFT = 9;
  public static readonly ROW_DOWN = 10;
  public static readonly ROW_RIGHT = 11;
  public static readonly FRAME_WIDTH = 64;
  public static readonly FRAME_HEIGHT = 64;

  private static singleton: CharacterConfigFactory;
  
  public static getSingletonInstance(): CharacterConfigFactory
  {
    if (!CharacterConfigFactory.singleton)
    {
      CharacterConfigFactory.singleton = new CharacterConfigFactory();
    }
    return CharacterConfigFactory.singleton;
  }
  
  /**
   * Load the assets we need to create all the characters needed
   * for the scene. Call this function in scene's preload.
   * @param {Phaser.Loader.LoaderPlugin} loader - loader to load a file
   * @param {string[]} spritesheetFilePaths - the file paths to spritesheets to load
   */
  public preloadCharacterSpritesheets(loader: Phaser.Loader.LoaderPlugin, spritesheetFilePaths: CharacterAsset[]): void
  {
    const option = { frameWidth: CharacterConfigFactory.FRAME_WIDTH, frameHeight: CharacterConfigFactory.FRAME_HEIGHT };
    spritesheetFilePaths.forEach(spritesheetFilePath => 
      {
        // The textures are accessible from all scenes.
        // If already loaded, Phaser will just ignore this call.
        loader.spritesheet(spritesheetFilePath, spritesheetFilePath, option);
      });
  }

  public createCharacterAnimations(animationManager: Phaser.Animations.AnimationManager, spritesheetFilePaths: CharacterAsset[]): void
  {
    spritesheetFilePaths.forEach(spritesheetFilePath => {
      this.createCharacterAnimation(animationManager, spritesheetFilePath);
    });
  }

  public createCharacterConfig(
    scene: Phaser.Scene,
    hairSpritesheetFilePath: CharacterAsset,
    bodySpritesheetFilePath: CharacterAsset,
    torsoSpritesheetFilePath: CharacterAsset,
    legsSpritesheetFilePath: CharacterAsset,
    feetSpritesheetFilePath: CharacterAsset,
    shadowSpritesheetFilePath: CharacterAsset,
    weaponSpritesheetFilePath: CharacterAsset
    ) : CharacterConfig
  {

    return {

      scene,
      
      faceUpFrameNumber: CharacterConfigFactory.ROW_UP * CharacterConfigFactory.NUM_COL,
      faceLeftFrameNumber: CharacterConfigFactory.ROW_LEFT * CharacterConfigFactory.NUM_COL,
      faceDownFrameNumber: CharacterConfigFactory.ROW_DOWN * CharacterConfigFactory.NUM_COL,
      faceRightFrameNumber: CharacterConfigFactory.ROW_RIGHT * CharacterConfigFactory.NUM_COL,

      body: {
        spritesheetId: bodySpritesheetFilePath,
        walkUpAnimationId: this.getWalkUpAnimationId(bodySpritesheetFilePath),
        walkLeftAnimationId: this.getWalkLeftAnimationId(bodySpritesheetFilePath),
        walkDownAnimationId: this.getWalkDownAnimationId(bodySpritesheetFilePath),
        walkRightAnimationId: this.getWalkRightAnimationId(bodySpritesheetFilePath),
        thrustUpAnimationId: this.getThrustUpAnimationId(bodySpritesheetFilePath),
        thrustLeftAnimationId: this.getThrustLeftAnimationId(bodySpritesheetFilePath),
        thrustDownAnimationId: this.getThrustDownAnimationId(bodySpritesheetFilePath),
        thrustRightAnimationId: this.getThrustRightAnimationId(bodySpritesheetFilePath)
      },
    
      hair: {
        spritesheetId: hairSpritesheetFilePath,
        walkUpAnimationId: this.getWalkUpAnimationId(hairSpritesheetFilePath),
        walkLeftAnimationId: this.getWalkLeftAnimationId(hairSpritesheetFilePath),
        walkDownAnimationId: this.getWalkDownAnimationId(hairSpritesheetFilePath),
        walkRightAnimationId: this.getWalkRightAnimationId(hairSpritesheetFilePath),
        thrustUpAnimationId: this.getThrustUpAnimationId(hairSpritesheetFilePath),
        thrustLeftAnimationId: this.getThrustLeftAnimationId(hairSpritesheetFilePath),
        thrustDownAnimationId: this.getThrustDownAnimationId(hairSpritesheetFilePath),
        thrustRightAnimationId: this.getThrustRightAnimationId(hairSpritesheetFilePath)
      },
    
      legs: {
        spritesheetId: legsSpritesheetFilePath,
        walkUpAnimationId: this.getWalkUpAnimationId(legsSpritesheetFilePath),
        walkLeftAnimationId: this.getWalkLeftAnimationId(legsSpritesheetFilePath),
        walkDownAnimationId: this.getWalkDownAnimationId(legsSpritesheetFilePath),
        walkRightAnimationId: this.getWalkRightAnimationId(legsSpritesheetFilePath),
        thrustUpAnimationId: this.getThrustUpAnimationId(legsSpritesheetFilePath),
        thrustLeftAnimationId: this.getThrustLeftAnimationId(legsSpritesheetFilePath),
        thrustDownAnimationId: this.getThrustDownAnimationId(legsSpritesheetFilePath),
        thrustRightAnimationId: this.getThrustRightAnimationId(legsSpritesheetFilePath)
      },
    
      torso: {
        spritesheetId: torsoSpritesheetFilePath,
        walkUpAnimationId: this.getWalkUpAnimationId(torsoSpritesheetFilePath),
        walkLeftAnimationId: this.getWalkLeftAnimationId(torsoSpritesheetFilePath),
        walkDownAnimationId: this.getWalkDownAnimationId(torsoSpritesheetFilePath),
        walkRightAnimationId: this.getWalkRightAnimationId(torsoSpritesheetFilePath),
        thrustUpAnimationId: this.getThrustUpAnimationId(torsoSpritesheetFilePath),
        thrustLeftAnimationId: this.getThrustLeftAnimationId(torsoSpritesheetFilePath),
        thrustDownAnimationId: this.getThrustDownAnimationId(torsoSpritesheetFilePath),
        thrustRightAnimationId: this.getThrustRightAnimationId(torsoSpritesheetFilePath)
      },
    
      feet: {
        spritesheetId: feetSpritesheetFilePath,
        walkUpAnimationId: this.getWalkUpAnimationId(feetSpritesheetFilePath),
        walkLeftAnimationId: this.getWalkLeftAnimationId(feetSpritesheetFilePath),
        walkDownAnimationId: this.getWalkDownAnimationId(feetSpritesheetFilePath),
        walkRightAnimationId: this.getWalkRightAnimationId(feetSpritesheetFilePath),
        thrustUpAnimationId: this.getThrustUpAnimationId(feetSpritesheetFilePath),
        thrustLeftAnimationId: this.getThrustLeftAnimationId(feetSpritesheetFilePath),
        thrustDownAnimationId: this.getThrustDownAnimationId(feetSpritesheetFilePath),
        thrustRightAnimationId: this.getThrustRightAnimationId(feetSpritesheetFilePath)
      },
    
      shadow: {
        spritesheetId: shadowSpritesheetFilePath,
        walkUpAnimationId: this.getWalkUpAnimationId(shadowSpritesheetFilePath),
        walkLeftAnimationId: this.getWalkLeftAnimationId(shadowSpritesheetFilePath),
        walkDownAnimationId: this.getWalkDownAnimationId(shadowSpritesheetFilePath),
        walkRightAnimationId: this.getWalkRightAnimationId(shadowSpritesheetFilePath),
        thrustUpAnimationId: this.getThrustUpAnimationId(shadowSpritesheetFilePath),
        thrustLeftAnimationId: this.getThrustLeftAnimationId(shadowSpritesheetFilePath),
        thrustDownAnimationId: this.getThrustDownAnimationId(shadowSpritesheetFilePath),
        thrustRightAnimationId: this.getThrustRightAnimationId(shadowSpritesheetFilePath)
      },

      weapon: {
        spritesheetId: weaponSpritesheetFilePath,
        walkUpAnimationId: this.getWalkUpAnimationId(weaponSpritesheetFilePath),
        walkLeftAnimationId: this.getWalkLeftAnimationId(weaponSpritesheetFilePath),
        walkDownAnimationId: this.getWalkDownAnimationId(weaponSpritesheetFilePath),
        walkRightAnimationId: this.getWalkRightAnimationId(weaponSpritesheetFilePath),
        thrustUpAnimationId: this.getThrustUpAnimationId(weaponSpritesheetFilePath),
        thrustLeftAnimationId: this.getThrustLeftAnimationId(weaponSpritesheetFilePath),
        thrustDownAnimationId: this.getThrustDownAnimationId(weaponSpritesheetFilePath),
        thrustRightAnimationId: this.getThrustRightAnimationId(weaponSpritesheetFilePath)
      }

    };
  }

  private createCharacterAnimation(animationManager: Phaser.Animations.AnimationManager, spritesheetFilePath: CharacterAsset)
  {

    // animation is global
    // If the existing key is provided, then it just returns the corresponding animation.

    // thrust up animation
    animationManager.create({
      key: this.getThrustUpAnimationId(spritesheetFilePath),
      frames: animationManager.generateFrameNumbers(spritesheetFilePath, 
        { start: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_THRUST_UP + 1, 
          end: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_THRUST_UP + 7 }),
      frameRate: 7,
      repeat: 0
    });

    // thrust left animation
    animationManager.create({
      key: this.getThrustLeftAnimationId(spritesheetFilePath),
      frames: animationManager.generateFrameNumbers(spritesheetFilePath, 
        { start: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_THRUST_LEFT + 1, 
          end: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_THRUST_LEFT + 7 }),
      frameRate: 7,
      repeat: 0
    });

    // thrust down animation
    animationManager.create({
      key: this.getThrustDownAnimationId(spritesheetFilePath),
      frames: animationManager.generateFrameNumbers(spritesheetFilePath, 
        { start: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_THRUST_DONW + 1, 
          end: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_THRUST_DONW + 7 }),
      frameRate: 7,
      repeat: 0
    });

    // thrust right animation
    animationManager.create({
      key: this.getThrustRightAnimationId(spritesheetFilePath),
      frames: animationManager.generateFrameNumbers(spritesheetFilePath, 
        { start: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_THRUST_RIGHT + 1, 
          end: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_THRUST_RIGHT + 7 }),
      frameRate: 7,
      repeat: 0
    });

    // walk up animation
    animationManager.create({
      key: this.getWalkUpAnimationId(spritesheetFilePath),
      frames: animationManager.generateFrameNumbers(spritesheetFilePath, 
        { start: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_UP + 1, 
          end: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_UP + 8 }),
      frameRate: 7,
      repeat: -1
    });

    // walk left animation
    animationManager.create({
      key: this.getWalkLeftAnimationId(spritesheetFilePath),
      frames: animationManager.generateFrameNumbers(spritesheetFilePath, 
        { start: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_LEFT + 1, 
          end: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_LEFT + 8 }),
      frameRate: 7,
      repeat: -1
    });

    // walk down animation
    animationManager.create({
      key: this.getWalkDownAnimationId(spritesheetFilePath),
      frames: animationManager.generateFrameNumbers(spritesheetFilePath, 
        { start: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_DOWN + 1, 
          end: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_DOWN + 8 }),
      frameRate: 7,
      repeat: -1
    });

    // walk right animation
    animationManager.create({
      key: this.getWalkRightAnimationId(spritesheetFilePath),
      frames: animationManager.generateFrameNumbers(spritesheetFilePath, 
        { start: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_RIGHT + 1, 
          end: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_RIGHT + 8 }),
      frameRate: 7,
      repeat: -1
    });
    
  }

  private getThrustUpAnimationId(spritesheetFilePath: CharacterAsset)
  {
    return spritesheetFilePath + ":thrust_up";
  }

  private getThrustLeftAnimationId(spritesheetFilePath: CharacterAsset)
  {
    return spritesheetFilePath + ":thrust_left";
  }

  private getThrustDownAnimationId(spritesheetFilePath: CharacterAsset)
  {
    return spritesheetFilePath + ":thrust_down";
  }

  private getThrustRightAnimationId(spritesheetFilePath: CharacterAsset)
  {
    return spritesheetFilePath + ":thrust_right";
  }

  private getWalkUpAnimationId(spritesheetFilePath: CharacterAsset)
  {
    return spritesheetFilePath + ":walk_up";
  }

  private getWalkLeftAnimationId(spritesheetFilePath: CharacterAsset)
  {
    return spritesheetFilePath + ":walk_left";
  }

  private getWalkDownAnimationId(spritesheetFilePath: CharacterAsset)
  {
    return spritesheetFilePath + ":walk_down";
  }

  private getWalkRightAnimationId(spritesheetFilePath: CharacterAsset)
  {
    return spritesheetFilePath + ":walk_right";
  }

}

export default CharacterConfigFactory;