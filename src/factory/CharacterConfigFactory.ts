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
    shadowSpritesheetFilePath: CharacterAsset
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
        walkRightAnimationId: this.getWalkRightAnimationId(bodySpritesheetFilePath)
      },
    
      hair: {
        spritesheetId: hairSpritesheetFilePath,
        walkUpAnimationId: this.getWalkUpAnimationId(hairSpritesheetFilePath),
        walkLeftAnimationId: this.getWalkLeftAnimationId(hairSpritesheetFilePath),
        walkDownAnimationId: this.getWalkDownAnimationId(hairSpritesheetFilePath),
        walkRightAnimationId: this.getWalkRightAnimationId(hairSpritesheetFilePath)
      },
    
      legs: {
        spritesheetId: legsSpritesheetFilePath,
        walkUpAnimationId: this.getWalkUpAnimationId(legsSpritesheetFilePath),
        walkLeftAnimationId: this.getWalkLeftAnimationId(legsSpritesheetFilePath),
        walkDownAnimationId: this.getWalkDownAnimationId(legsSpritesheetFilePath),
        walkRightAnimationId: this.getWalkRightAnimationId(legsSpritesheetFilePath)
      },
    
      torso: {
        spritesheetId: torsoSpritesheetFilePath,
        walkUpAnimationId: this.getWalkUpAnimationId(torsoSpritesheetFilePath),
        walkLeftAnimationId: this.getWalkLeftAnimationId(torsoSpritesheetFilePath),
        walkDownAnimationId: this.getWalkDownAnimationId(torsoSpritesheetFilePath),
        walkRightAnimationId: this.getWalkRightAnimationId(torsoSpritesheetFilePath)
      },
    
      feet: {
        spritesheetId: feetSpritesheetFilePath,
        walkUpAnimationId: this.getWalkUpAnimationId(feetSpritesheetFilePath),
        walkLeftAnimationId: this.getWalkLeftAnimationId(feetSpritesheetFilePath),
        walkDownAnimationId: this.getWalkDownAnimationId(feetSpritesheetFilePath),
        walkRightAnimationId: this.getWalkRightAnimationId(feetSpritesheetFilePath)
      },
    
      shadow: {
        spritesheetId: shadowSpritesheetFilePath,
        walkUpAnimationId: this.getWalkUpAnimationId(shadowSpritesheetFilePath),
        walkLeftAnimationId: this.getWalkLeftAnimationId(shadowSpritesheetFilePath),
        walkDownAnimationId: this.getWalkDownAnimationId(shadowSpritesheetFilePath),
        walkRightAnimationId: this.getWalkRightAnimationId(shadowSpritesheetFilePath)
      }

    };
  }

  private createCharacterAnimation(animationManager: Phaser.Animations.AnimationManager, spritesheetFilePath: CharacterAsset)
  {

    // animation is global
    // If the existing key is provided, then it just returns the corresponding animation.
    // walk up animation
    animationManager.create({
      key: this.getWalkUpAnimationId(spritesheetFilePath),
      frames: animationManager.generateFrameNumbers(spritesheetFilePath, 
        { start: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_UP + 1, 
          end: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_UP + 8 }),
      frameRate: 12,
      repeat: -1
    });

    // walk left animation
    animationManager.create({
      key: this.getWalkLeftAnimationId(spritesheetFilePath),
      frames: animationManager.generateFrameNumbers(spritesheetFilePath, 
        { start: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_LEFT + 1, 
          end: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_LEFT + 8 }),
      frameRate: 12,
      repeat: -1
    });

    // walk down animation
    animationManager.create({
      key: this.getWalkDownAnimationId(spritesheetFilePath),
      frames: animationManager.generateFrameNumbers(spritesheetFilePath, 
        { start: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_DOWN + 1, 
          end: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_DOWN + 8 }),
      frameRate: 12,
      repeat: -1
    });

    // walk right animation
    animationManager.create({
      key: this.getWalkRightAnimationId(spritesheetFilePath),
      frames: animationManager.generateFrameNumbers(spritesheetFilePath, 
        { start: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_RIGHT + 1, 
          end: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_RIGHT + 8 }),
      frameRate: 12,
      repeat: -1
    });
    
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