import Events from '../events/Events';
import EventDispatcher from '../events/EventDispatcher';
import BaseScene from './BaseScene';
import GrayscalePipeline from '../pipelines/GrayscalePipeline';
import OutlinePipeline from '../pipelines/OutlinePipeline';
import SceneTransitionManager from '../manager/SceneTransitionManager';
import Assets from '../assets/Assets';

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

  // the unique id of this scene
  public static readonly KEY = "PreloadScene";

  // the progress bar to show how much of the assets have been loaded
  private progressBar?: Phaser.GameObjects.Graphics;

  // the percentage of the assets that have been loaded out of all the assets
  private percentText?: Phaser.GameObjects.Text;

  // the text that shows the asset currently loading
  private assetText?: Phaser.GameObjects.Text; 

  // whether all the assets has been loaded and is ready to go to next scene
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
      this.game.renderer.addPipeline(GrayscalePipeline.KEY, new GrayscalePipeline(this.game));
      this.game.renderer.addPipeline(OutlinePipeline.KEY, new OutlinePipeline(this.game));
    }

    SceneTransitionManager.getInstance().init();
  }

  /**
   * Scenes can have a preload method, which is always called before the Scenes 
   * create method, allowing you to preload assets that the Scene may need.
   */
  public preload()
  {
    // setup asset loading progress bar
    this.setUpProgressUI();

    // load the assets
    Object.values(Assets.Asset.UI).forEach(asset => this.load.image(asset));
    Object.values(Assets.Asset.Player).forEach(asset => this.load.atlas(asset));
    Object.values(Assets.Asset.NonPlayerCharacter).forEach(asset => this.load.atlas(asset));
    Object.values(Assets.Asset.Weapon).forEach(asset => this.load.image(asset));
    Object.values(Assets.Asset.Enemy).forEach(asset => this.load.atlas(this.createDefaultAtlasJSONFileConfig(asset)));
    Object.values(Assets.Asset.Audio).forEach(asset => this.load.audio(this.createDefaultAudioFileConfig(asset)));
    Object.values(Assets.Asset.Font).forEach(asset => this.load.bitmapFont(asset));
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

  private setUpProgressUI()
  {
    // constants for ui
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    const spacingBetweenProgressBarAndBox = 10;
    const progressBoxWidth = 320;
    const progressBoxHeight = 50;

    // when the current file's loading progress changes
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
                
    // when the file to load has changed
    this.load.on('fileprogress', (file) => {
      this.assetText?.setText('Loading asset: ' + file.key);
    });
    
    // when all the assets are loaded
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
  }

}

export default PreloadScene;