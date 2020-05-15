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
  private spritesheetFilePathToSpritesheetIdMap: {[filePath: string]: string};
  private spritesheetFilePathToWalkUpAnimationIdMap: {[filePath: string]: string};
  private spritesheetFilePathToWalkLeftAnimationIdMap: {[filePath: string]: string};
  private spritesheetFilePathToWalkDownAnimationIdMap: {[filePath: string]: string};
  private spritesheetFilePathToWalkRightAnimationIdMap: {[filePath: string]: string};

  private constructor()
  {
    this.spritesheetFilePathToSpritesheetIdMap = {};
    this.spritesheetFilePathToWalkUpAnimationIdMap = {};
    this.spritesheetFilePathToWalkLeftAnimationIdMap = {};
    this.spritesheetFilePathToWalkDownAnimationIdMap = {};
    this.spritesheetFilePathToWalkRightAnimationIdMap = {};
  }

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
        // already loaded
        if (this.spritesheetFilePathToSpritesheetIdMap[spritesheetFilePath]) return;

        const spritesheetId = uniqid();

        // the textures are accessible from all scenes
        loader.spritesheet(spritesheetId, spritesheetFilePath, option);
        this.spritesheetFilePathToSpritesheetIdMap[spritesheetFilePath] = spritesheetId;
      });
  }

  public createCharacterAnimations(animationManager: Phaser.Animations.AnimationManager, spritesheetFilePaths: CharacterAsset[]): void
  {
    spritesheetFilePaths.forEach(spritesheetFilePath => {
      this.createCharacterAnimation(animationManager, spritesheetFilePath);
    });
  }

  public createCharacterConfig(
    hairSpritesheetFilePath: CharacterAsset,
    bodySpritesheetFilePath: CharacterAsset,
    torsoSpritesheetFilePath: CharacterAsset,
    legsSpritesheetFilePath: CharacterAsset,
    feetSpritesheetFilePath: CharacterAsset,
    shadowSpritesheetFilePath: CharacterAsset
    ) : CharacterConfig
  {

    return {

      faceUpFrameNumber: CharacterConfigFactory.ROW_UP * CharacterConfigFactory.NUM_COL,
      faceLeftFrameNumber: CharacterConfigFactory.ROW_LEFT * CharacterConfigFactory.NUM_COL,
      faceDownFrameNumber: CharacterConfigFactory.ROW_DOWN * CharacterConfigFactory.NUM_COL,
      faceRightFrameNumber: CharacterConfigFactory.ROW_RIGHT * CharacterConfigFactory.NUM_COL,

      body: {
        spritesheetId: this.spritesheetFilePathToSpritesheetIdMap[bodySpritesheetFilePath],
        walkUpAnimationId: this.spritesheetFilePathToWalkUpAnimationIdMap[bodySpritesheetFilePath],
        walkLeftAnimationId: this.spritesheetFilePathToWalkLeftAnimationIdMap[bodySpritesheetFilePath],
        walkDownAnimationId: this.spritesheetFilePathToWalkDownAnimationIdMap[bodySpritesheetFilePath],
        walkRightAnimationId: this.spritesheetFilePathToWalkRightAnimationIdMap[bodySpritesheetFilePath]
      },
    
      hair: {
        spritesheetId: this.spritesheetFilePathToSpritesheetIdMap[hairSpritesheetFilePath],
        walkUpAnimationId: this.spritesheetFilePathToWalkUpAnimationIdMap[hairSpritesheetFilePath],
        walkLeftAnimationId: this.spritesheetFilePathToWalkLeftAnimationIdMap[hairSpritesheetFilePath],
        walkDownAnimationId: this.spritesheetFilePathToWalkDownAnimationIdMap[hairSpritesheetFilePath],
        walkRightAnimationId: this.spritesheetFilePathToWalkRightAnimationIdMap[hairSpritesheetFilePath]
      },
    
      legs: {
        spritesheetId: this.spritesheetFilePathToSpritesheetIdMap[legsSpritesheetFilePath],
        walkUpAnimationId: this.spritesheetFilePathToWalkUpAnimationIdMap[legsSpritesheetFilePath],
        walkLeftAnimationId: this.spritesheetFilePathToWalkLeftAnimationIdMap[legsSpritesheetFilePath],
        walkDownAnimationId: this.spritesheetFilePathToWalkDownAnimationIdMap[legsSpritesheetFilePath],
        walkRightAnimationId: this.spritesheetFilePathToWalkRightAnimationIdMap[legsSpritesheetFilePath]
      },
    
      torso: {
        spritesheetId: this.spritesheetFilePathToSpritesheetIdMap[torsoSpritesheetFilePath],
        walkUpAnimationId: this.spritesheetFilePathToWalkUpAnimationIdMap[torsoSpritesheetFilePath],
        walkLeftAnimationId: this.spritesheetFilePathToWalkLeftAnimationIdMap[torsoSpritesheetFilePath],
        walkDownAnimationId: this.spritesheetFilePathToWalkDownAnimationIdMap[torsoSpritesheetFilePath],
        walkRightAnimationId: this.spritesheetFilePathToWalkRightAnimationIdMap[torsoSpritesheetFilePath]
      },
    
      feet: {
        spritesheetId: this.spritesheetFilePathToSpritesheetIdMap[feetSpritesheetFilePath],
        walkUpAnimationId: this.spritesheetFilePathToWalkUpAnimationIdMap[feetSpritesheetFilePath],
        walkLeftAnimationId: this.spritesheetFilePathToWalkLeftAnimationIdMap[feetSpritesheetFilePath],
        walkDownAnimationId: this.spritesheetFilePathToWalkDownAnimationIdMap[feetSpritesheetFilePath],
        walkRightAnimationId: this.spritesheetFilePathToWalkRightAnimationIdMap[feetSpritesheetFilePath]
      },
    
      shadow: {
        spritesheetId: this.spritesheetFilePathToSpritesheetIdMap[shadowSpritesheetFilePath],
        walkUpAnimationId: this.spritesheetFilePathToWalkUpAnimationIdMap[shadowSpritesheetFilePath],
        walkLeftAnimationId: this.spritesheetFilePathToWalkLeftAnimationIdMap[shadowSpritesheetFilePath],
        walkDownAnimationId: this.spritesheetFilePathToWalkDownAnimationIdMap[shadowSpritesheetFilePath],
        walkRightAnimationId: this.spritesheetFilePathToWalkRightAnimationIdMap[shadowSpritesheetFilePath]
      }

    };
  }

  private createCharacterAnimation(animationManager: Phaser.Animations.AnimationManager, spritesheetFilePath: CharacterAsset)
  {
    const spritesheetId = this.spritesheetFilePathToSpritesheetIdMap[spritesheetFilePath];

    if (!this.spritesheetFilePathToWalkUpAnimationIdMap[spritesheetFilePath])
    {
      const walkUpAnimationId = uniqid();
      animationManager.create({
        key: walkUpAnimationId,
        frames: animationManager.generateFrameNumbers(spritesheetId, 
          { start: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_UP + 1, 
            end: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_UP + 8 }),
        frameRate: 12,
        repeat: -1
      });
      this.spritesheetFilePathToWalkUpAnimationIdMap[spritesheetFilePath] = walkUpAnimationId;
    }

    if (!this.spritesheetFilePathToWalkLeftAnimationIdMap[spritesheetFilePath])
    {
      const walkLeftAnimationId = uniqid();
      animationManager.create({
        key: walkLeftAnimationId,
        frames: animationManager.generateFrameNumbers(spritesheetId, 
          { start: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_LEFT + 1, 
            end: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_LEFT + 8 }),
        frameRate: 12,
        repeat: -1
      });
      this.spritesheetFilePathToWalkLeftAnimationIdMap[spritesheetFilePath] = walkLeftAnimationId;
    }

    if (!this.spritesheetFilePathToWalkDownAnimationIdMap[spritesheetFilePath])
    {
      const walkDownAnimationId = uniqid();
      animationManager.create({
        key: walkDownAnimationId,
        frames: animationManager.generateFrameNumbers(spritesheetId, 
          { start: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_DOWN + 1, 
            end: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_DOWN + 8 }),
        frameRate: 12,
        repeat: -1
      });
      this.spritesheetFilePathToWalkDownAnimationIdMap[spritesheetFilePath] = walkDownAnimationId;
    }

    if (!this.spritesheetFilePathToWalkRightAnimationIdMap[spritesheetFilePath])
    {
      const walkRightAnimationId = uniqid();
      animationManager.create({
        key: walkRightAnimationId,
        frames: animationManager.generateFrameNumbers(spritesheetId, 
          { start: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_RIGHT + 1, 
            end: CharacterConfigFactory.NUM_COL * CharacterConfigFactory.ROW_RIGHT + 8 }),
        frameRate: 12,
        repeat: -1
      });
      this.spritesheetFilePathToWalkRightAnimationIdMap[spritesheetFilePath] = walkRightAnimationId;
    }
    
  }

}

export default CharacterConfigFactory;