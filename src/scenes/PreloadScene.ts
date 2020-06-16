import { EnemyAsset } from './../assets/EnemyAsset';
import { PlayerAsset } from './../assets/PlayerAsset';
import { AudioAsset } from './../assets/AudioAsset';
import { FontAsset } from './../assets/FontAsset';
import { WeaponAsset } from './../assets/WeaponAsset';
import { UIAsset } from './../assets/UIAsset';
import BaseScene from './BaseScene';
import GameStartScene from './GameStartScene';

/**
 * This scenes preloads all the static assets needed for the game.
 * @class
 * @classdesc
 * Preloading assets in every scene is confusing and you get easily forget to 
 * preload an asset when you create a new scene class. Use this class to 
 * preload all the assets when the game starts to avoid missing assets. Remember 
 * to update this file when you add a new asset to this project. 
 */
class PreloadScene extends BaseScene
{

  public static readonly KEY = "PreloadScene";

  private progressBar?: Phaser.GameObjects.Graphics;

  private percentText?: Phaser.GameObjects.Text;

  private assetText?: Phaser.GameObjects.Text; 

  /**
   * This is called only once when you start the game. Every time a scene is 
   * created using methods like `scene.start()`, `constructor()` will not be 
   * called (`init()` will still be called though).
   */
	constructor()
	{
    super(PreloadScene.KEY);
  }

  /**
   * Scenes can have a init method, which is always called before the Scenes
   * preload method, allowing you to initialize data that the Scene may need.
   * 
   * The data is passed when the scene is started/launched by the scene manager.
   * 
   * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
   * @param {any} data - the data being passed when the scene manager starts this scene
   */
  public init(data: any): void
  {
  }

  /**
   * Scenes can have a preload method, which is always called before the Scenes 
   * create method, allowing you to preload assets that the Scene may need.
   */
  public preload()
  {

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.load.on('progress', (value) => {
      this.progressBar?.clear();
      this.progressBar?.fillStyle(0xffffff, 1);
      this.progressBar?.fillRect(centerX + 10 - 160, centerY + 10, 300 * value, 30);
      this.percentText?.setText(parseInt(value) * 100 + '%');
    });
                
    this.load.on('fileprogress', (file) => {
      this.assetText?.setText('Loading asset: ' + file.key);
    });
    
    this.load.on('complete', () => {
      this.scene.start(GameStartScene.KEY);
    });

    this.progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(centerX - 160, centerY, 320, 50);
    
    const loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
          font: '20px monospace',
          fill: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);

    this.percentText = this.make.text({
      x: width / 2,
      y: height / 2 + 25,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    this.percentText.setOrigin(0.5, 0.5);

    this.assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 75,
        text: '',
        style: {
          font: '18px monospace',
          fill: '#ffffff'
        }
    });
    this.assetText.setOrigin(0.5, 0.5);

    // load ui asset
    this.load.image(UIAsset.ItemSlotBordered);
    this.load.image(UIAsset.HeartEmpty);
    this.load.image(UIAsset.HeartFull);
    this.load.image(UIAsset.HeartHalf);
    
    // load player asset
    this.load.atlas(PlayerAsset.ElfFemale);
    this.load.atlas(PlayerAsset.ElfMale);

    // load weapon asset
    this.load.image(WeaponAsset.RegularSword);
    this.load.image(WeaponAsset.Axe);
    this.load.image(WeaponAsset.Hammer);

    // load enemy asset
    this.load.atlas(this.createDefaultAtlasJSONFileConfig(EnemyAsset.OrcWarrior));
    this.load.atlas(this.createDefaultAtlasJSONFileConfig(EnemyAsset.IceZombie));
    this.load.atlas(this.createDefaultAtlasJSONFileConfig(EnemyAsset.Chort));

    // load audio asset
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.DamagePlayer));
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.Swing));
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.ThreeFootSteps));
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.EnemyHit));
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.EnemyFoundPlayer));

    // load font asset
    this.load.bitmapFont(FontAsset.PressStart2P);
  }

  /**
   * Scenes can have a create method, which is always called after the Scenes 
   * init and preload methods, allowing you to create assets that the Scene may need.
   * 
   * The data is passed when the scene is started/launched by the scene manager.
   * 
   * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
   * @param {any} data - the data being passed when the scene manager starts this scene
   */
  public create(data: any)
  {
  }

  /**
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time
   * @param {number} delta - the delta time in ms since the last frame
   */
  public update(time: number, delta: number)
  {
  }

}

export default PreloadScene;