import { FontAsset } from './../assets/FontAsset';
import { Events } from '../events/Events';
import EventDispatcher from '../events/EventDispatcher';
import { AudioAsset } from './../assets/AudioAsset';
import { EnemyAsset } from '../assets/EnemyAsset';
import { PlayerAsset } from '../assets/PlayerAsset';
import { FontAsset } from '../assets/FontAsset';
import { WeaponAsset } from '../assets/WeaponAsset';
import { UIAsset } from '../assets/UIAsset';
import BaseScene from './BaseScene';
import { NonPlayerCharacterAsset } from '../assets/NonPlayerCharacterAsset';
import GrayscalePipeline from '../pipelines/GrayscalePipeline';
import OutlinePipeline from '../pipelines/OutlinePipeline';
import SceneManager from '../manager/SceneManager';

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

  private ready: boolean;

  /**
   * This is called only once when you start the game. Every time a scene is 
   * created using methods like `scene.start()`, `constructor()` will not be 
   * called (`init()` will still be called though).
   */
	constructor()
	{
    super(PreloadScene.KEY);
    this.ready = false;
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
    this.ready = false;

    // register custom pipelines if webGL is enabled
    if (this.game.renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer)
    {
      this.game.renderer.addPipeline('Grayscale', new GrayscalePipeline(this.game));
      this.game.renderer.addPipeline('Outline', new OutlinePipeline(this.game));
    }

    SceneManager.getInstance().init();
  }

  /**
   * Scenes can have a preload method, which is always called before the Scenes 
   * create method, allowing you to preload assets that the Scene may need.
   */
  public preload()
  {
    // setup loading ui
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    const spacingBetweenProgressBarAndBox = 10;
    const progressBoxWidth = 320;
    const progressBoxHeight = 50;

    this.load.on('progress', (value) => {
      this.progressBar?.clear();
      this.progressBar?.fillStyle(0xffffff, 1);
      this.progressBar?.fillRect(
        centerX + spacingBetweenProgressBarAndBox - progressBoxWidth / 2, 
        centerY + spacingBetweenProgressBarAndBox, 
        (progressBoxWidth - spacingBetweenProgressBarAndBox * 2) * value, 
        progressBoxHeight - spacingBetweenProgressBarAndBox * 2
      );
      this.percentText?.setText(Math.floor(value * 100).toString() + '%');
    });
                
    this.load.on('fileprogress', (file) => {
      this.assetText?.setText('Loading asset: ' + file.key);
    });
    
    this.load.on('complete', () => {
      this.ready = true;
    });

    this.progressBar = this.add.graphics();
    const progressBox = this.add.graphics();

    // Draw progress box roughly around the center.
    // Top left corner of the box is located at center vertically.
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(centerX - progressBoxWidth / 2, centerY, 
      progressBoxWidth, progressBoxHeight);
    
    // draw loading text just above progress box
    const loadingText = this.make.text({
      x: width / 2,
      y: 0,
      text: 'Loading...'
    }).setOrigin(0.5, 0.5);
    loadingText.setY(centerY - loadingText.height);

    // draw percent text at the center of the progress box
    this.percentText = this.make.text({
      x: width / 2,
      y: height / 2 + progressBoxHeight / 2,
      text: '0%'
    }).setOrigin(0.5, 0.5);

    // draw asset text just below progress box
    this.assetText = this.make.text({
      x: width / 2,
      y: 0,
      text: ''
    }).setOrigin(0.5, 0.5);
    this.assetText.setY(centerY + progressBoxHeight + this.assetText.height);

    // load ui asset
    this.load.image(UIAsset.ItemSlotBordered);
    this.load.image(UIAsset.HeartEmpty);
    this.load.image(UIAsset.HeartFull);
    this.load.image(UIAsset.HeartHalf);
    
    // load player asset
    this.load.atlas(PlayerAsset.ElfFemale);
    this.load.atlas(PlayerAsset.ElfMale);

    // load npc asset
    this.load.atlas(NonPlayerCharacterAsset.TownsfolkMale);

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
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.FieldsOfIce));
    this.load.audio(this.createDefaultAudioFileConfig(AudioAsset.Text));

    // load font asset
    this.load.bitmapFont(FontAsset.PressStart2P);
    // this.game.cache.bitmapFont.get(FontAsset.PressStart2P).font.lineHeight = 10;
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
    if (this.ready)
    {
      EventDispatcher.getInstance().emit(Events.Event.PreloadComplete, { scene: this });
    }
  }

}

export default PreloadScene;