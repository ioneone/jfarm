import Phaser from 'phaser';
import uniqid from 'uniqid';
import CharacterConfig from "../configs/CharacterConfig";

/**
 * The character spritesheet must follow the 
 * Liberated Pixel Cup (LPC) standard.
 */
class CharacterFactory
{

  // LPC standard
  public static readonly NUM_COL = 13;
  public static readonly ROW_UP = 8;
  public static readonly ROW_LEFT = 9;
  public static readonly ROW_DOWN = 10;
  public static readonly ROW_RIGHT = 11;
  public static readonly FRAME_WIDTH = 64;
  public static readonly FRAME_HEIGHT = 64;

  private static singleton: CharacterFactory;
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

  public static getSingletonInstance(): CharacterFactory
  {
    if (!CharacterFactory.singleton)
    {
      CharacterFactory.singleton = new CharacterFactory();
    }
    return CharacterFactory.singleton;
  }
  
  /**
   * Load the assets we need to create all the characters needed
   * for the scene. Call this function in scene's preload.
   * @param {Phaser.Loader.LoaderPlugin} loader - loader to load a file
   * @param {string[]} spritesheetFilePaths - the file paths to spritesheets to load
   */
  public preloadCharacterSpritesheets(loader: Phaser.Loader.LoaderPlugin, spritesheetFilePaths: string[])
  {
    const option = { frameWidth: CharacterFactory.FRAME_WIDTH, frameHeight: CharacterFactory.FRAME_HEIGHT };
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

  public createCharacterConfig(
    animationManager: Phaser.Animations.AnimationManager, 
    bodySpritesheetFilePath: string,
    hairSpritesheetFilePath: string,
    legsSpritesheetFilePath: string,
    torsoSpritesheetFilePath: string,
    feetSpritesheetFilePath: string,
    shadowSpritesheetFilePath: string
    ) : CharacterConfig
  {

    this.registerCharacterAnimations(animationManager, bodySpritesheetFilePath);
    this.registerCharacterAnimations(animationManager, hairSpritesheetFilePath);
    this.registerCharacterAnimations(animationManager, legsSpritesheetFilePath);
    this.registerCharacterAnimations(animationManager, torsoSpritesheetFilePath);
    this.registerCharacterAnimations(animationManager, feetSpritesheetFilePath);
    this.registerCharacterAnimations(animationManager, shadowSpritesheetFilePath);

    return {

      faceUpFrameNumber: CharacterFactory.ROW_UP * CharacterFactory.NUM_COL,
      faceLeftFrameNumber: CharacterFactory.ROW_LEFT * CharacterFactory.NUM_COL,
      faceDownFrameNumber: CharacterFactory.ROW_DOWN * CharacterFactory.NUM_COL,
      faceRightFrameNumber: CharacterFactory.ROW_RIGHT * CharacterFactory.NUM_COL,

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

  private registerCharacterAnimations(animationManager: Phaser.Animations.AnimationManager, spritesheetFilePath: string)
  {
    const spritesheetId = this.spritesheetFilePathToSpritesheetIdMap[spritesheetFilePath];

    if (!this.spritesheetFilePathToWalkUpAnimationIdMap[spritesheetFilePath])
    {
      const walkUpAnimationId = uniqid();
      animationManager.create({
        key: walkUpAnimationId,
        frames: animationManager.generateFrameNumbers(spritesheetId, 
          { start: CharacterFactory.NUM_COL * CharacterFactory.ROW_UP + 1, 
            end: CharacterFactory.NUM_COL * CharacterFactory.ROW_UP + 8 }),
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
          { start: CharacterFactory.NUM_COL * CharacterFactory.ROW_LEFT + 1, 
            end: CharacterFactory.NUM_COL * CharacterFactory.ROW_LEFT + 8 }),
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
          { start: CharacterFactory.NUM_COL * CharacterFactory.ROW_DOWN + 1, 
            end: CharacterFactory.NUM_COL * CharacterFactory.ROW_DOWN + 8 }),
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
          { start: CharacterFactory.NUM_COL * CharacterFactory.ROW_RIGHT + 1, 
            end: CharacterFactory.NUM_COL * CharacterFactory.ROW_RIGHT + 8 }),
        frameRate: 12,
        repeat: -1
      });
      this.spritesheetFilePathToWalkRightAnimationIdMap[spritesheetFilePath] = walkRightAnimationId;
    }
    
  }

}

export default CharacterFactory;