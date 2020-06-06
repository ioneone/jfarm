import SceneTransitionObject, { TiledTransitionObject } from '../objects/SceneTransitionObject';
import Phaser from 'phaser';

/**
 * TilemapScene is responsible for reading tiledmap and
 * rendering the world
 */
class TilemapScene extends Phaser.Scene
{
  // file path to the tilemap of this scene
  protected tilemapFilePath: string;

  // tilemap of this scene
  protected tilemap?: Phaser.Tilemaps.Tilemap;

  // file paths to the tilesets for the tilemap
  protected tilesetFilePaths: string[];

  // tilesets for the tilemap
  protected tilesets?: Phaser.Tilemaps.Tileset[];

  // transition objects
  protected transitionObjectGroup?: Phaser.Physics.Arcade.StaticGroup;

  // bottom layer of the tilemap
  // dynamic layer because we may turn a non-soil tile into a soil tile
  protected bottomLayer?: Phaser.Tilemaps.DynamicTilemapLayer;

  // middle layer of the tilemap
  protected middleLayer?: Phaser.Tilemaps.StaticTilemapLayer;

  // top layer of the tilemap
  protected topLayer?: Phaser.Tilemaps.StaticTilemapLayer;

  // custom graphics for drawing debug info
  protected debugGraphics?: Phaser.GameObjects.Graphics;

  // press 'I' key to toggle debug mode
  protected keyI?: Phaser.Input.Keyboard.Key;

  // data received from previous scene
  protected sceneTransitionObject?: SceneTransitionObject;

  /**
   * The tilemap must have the structure as follows:
   * - TopLayer (non-collidable)
   * - MiddleLayer (collidable)
   * - BottomLayer (collidable)
   * - TransitionLayer
   * The lower layer will be rendered first. Use default name
   * for tileset name. (e.g. path/to/file/foo.png => foo)
   * @param {string} key - The unique id of this scene
   * @param {string} tilemapFilePath - The file path to tilemap in JSON format
   * @param {string[]} tilesetFilePaths - The file paths to tileset images for the tilemap
   */
	constructor(key: string, tilemapFilePath: string, tilesetFilePaths: string[])
	{
    super(key);
    this.tilemapFilePath = tilemapFilePath;
    this.tilesetFilePaths = tilesetFilePaths;
  }

  /**
   * Use init() to pass data from one scene to another
   * @param {{ sceneTransitionObject: SceneTransitionObject }} data - the data received from previous scene
   */
  public init(data: { sceneTransitionObject: SceneTransitionObject })
  {
    this.sceneTransitionObject = data.sceneTransitionObject;
  }
  
  /**
   * preload() is always called before the Scenes create method, 
   * allowing you to preload assets that the Scene may need.
   */
	public preload()
	{
    // load tileset images
    this.tilesetFilePaths.forEach(tilesetFilePath => {
      this.load.image(tilesetFilePath, tilesetFilePath);
    });

    // load tilemap json data
    this.load.tilemapTiledJSON(this.tilemapFilePath, this.tilemapFilePath);
	}

  /**
   * create() is called after preload() is completed.
   * You can safely assume all the resources are declared in preload()
   * are loaded to the memory.
   */
	public create()
	{
    // parse tilemap data
    this.tilemap = this.make.tilemap({ key: this.tilemapFilePath });

    // parse tileset images
    this.tilesets = [];
    this.tilesetFilePaths.forEach(tilesetFilePath => {
      const tilesetNameInTilemapData = tilesetFilePath.slice(tilesetFilePath.lastIndexOf("/") + 1, tilesetFilePath.lastIndexOf("."));
      this.tilesets!.push(this.tilemap!.addTilesetImage(tilesetNameInTilemapData, tilesetFilePath));
    });

    // create transition layer
    this.transitionObjectGroup = this.physics.add.staticGroup();
    const tiledTransitionObjects = this.tilemap!.getObjectLayer("TransitionLayer").objects as TiledTransitionObject[];
    tiledTransitionObjects.forEach(tiledTransitionObject => {
      const transitionObject = new SceneTransitionObject(this, tiledTransitionObject); 
      this.transitionObjectGroup!.add(transitionObject);
    });

    // create bottom layer
    this.bottomLayer = this.tilemap!.createDynamicLayer("BottomLayer", this.tilesets!, 0, 0);
    this.bottomLayer.setCollisionByProperty({ collision: true });   

    // create middle layer
    this.middleLayer = this.tilemap!.createStaticLayer("MiddleLayer", this.tilesets!, 0, 0);
    this.middleLayer.setCollisionByProperty({ collision: true });     
    
    // create top layer
    this.topLayer = this.tilemap!.createStaticLayer("TopLayer", this.tilesets!, 0, 0);

    // get reference to the keyboard key
    this.keyI = this.input.keyboard.addKey('I');

    // setup debug mode
    this.debugGraphics = this.add.graphics().setAlpha(0.5);
    this.bottomLayer.renderDebug(this.debugGraphics!, {
      // Color of non-colliding tiles
      tileColor: null, 
      // Color of colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), 
      // Color of colliding face edges
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) 
    });

    this.middleLayer.renderDebug(this.debugGraphics!, {
      // Color of non-colliding tiles
      tileColor: null, 
      // Color of colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), 
      // Color of colliding face edges
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) 
    });

    // set world bounds
    this.physics.world.bounds.width = this.tilemap!.widthInPixels;
    this.physics.world.bounds.height = this.tilemap!.heightInPixels;

    // configure camera
    this.cameras.main.setBounds(0, 0, this.tilemap!.widthInPixels, this.tilemap!.heightInPixels);

  }
  
  /**
   * update() is called after create() is completed.
   * This method is called every frame and updates the state
   * of the scene.
   */
  public update()
	{
    // toggle debug mode
    if (Phaser.Input.Keyboard.JustDown(this.keyI!)) 
    {
      // built in debug display
      this.physics.world.debugGraphic.setVisible(!this.physics.world.debugGraphic.visible);

      // custom debug display
      this.debugGraphics!.setVisible(!this.debugGraphics!.visible);
    }
  }

}

export default TilemapScene;