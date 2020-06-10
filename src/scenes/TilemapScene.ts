import { SceneTransitionData } from './../objects/SceneTransitionObject';
import SceneTransitionObject from '../objects/SceneTransitionObject';
import Phaser from 'phaser';
import AnimatedTile, { TilesetTileData } from '~/objects/AnimatedTile';

/**
 * The name of tile layers of the tilemap exported from Tiled program.
 * @see TilemapScene
 * @readonly
 * @enum {string}
 */
export enum TileLayer
{
  Top = "TopLayer",
  Middle = "MiddleLayer",
  Bottom = "BottomLayer",
  Transition = "TransitionLayer"
}

/**
 * Data type of raw Tiled transition object. These are data provided by Tiled
 * program by default. Custom data will be stored in `properties`.
 * @interface
 */
export interface TiledTransitionObject
{
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  properties: Array<{
    name: string,
    type: string,
    value: string | number
  }>;
}

/**
 * Responsible for reading tiledmap and rendering the world.
 * @class
 * @classdesc
 * The tilemap must have the structure as follows:
 * - TopLayer (non-collidable)
 * - MiddleLayer (collidable)
 * - BottomLayer (collidable)
 * - TransitionLayer
 * The lower layer will be rendered first. Use default name for tileset name. 
 * (e.g. `path/to/file/foo.png` => `foo`)
 */
abstract class TilemapScene extends Phaser.Scene
{

  // the style config for debug mode
  private static readonly RENDER_DEBUG_CONFIG = {
    // Color of non-colliding tiles
    tileColor: null, 
    // Color of colliding tiles
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), 
    // Color of colliding face edges
    faceColor: new Phaser.Display.Color(40, 39, 37, 255) 
  }

  // the tilemap of the scene
  protected tilemap?: Phaser.Tilemaps.Tilemap;

  // tileset for the tilemap
  protected tileset?: Phaser.Tilemaps.Tileset;

  // transition objects
  protected transitionObjectGroup?: Phaser.Physics.Arcade.StaticGroup;

  // bottom layer of the tilemap
  protected bottomLayer?: Phaser.Tilemaps.DynamicTilemapLayer;

  // middle layer of the tilemap
  protected middleLayer?: Phaser.Tilemaps.DynamicTilemapLayer;

  // top layer of the tilemap
  protected topLayer?: Phaser.Tilemaps.DynamicTilemapLayer;

  // custom graphics for drawing debug info
  protected debugGraphics?: Phaser.GameObjects.Graphics;

  // press 'I' key to toggle debug mode
  protected keyI?: Phaser.Input.Keyboard.Key;

  // referene to animatable tiles
  protected animatedTiles: AnimatedTile[];

  protected sceneTransitionData?: SceneTransitionData;

  /**
   * @param {string} key - the unique id of the scene
   */
	constructor(key: string)
	{
    super(key);
    this.animatedTiles = [];
  }

  /**
   * Scenes can have a init method, which is always called before the Scenes
   * preload method, allowing you to initialize data that the Scene may need.
   * 
   * The data is passed when the scene is started/launched by the scene manager.
   * 
   * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
   * @param {SceneTransitionData} data - the data being passed when the scene manager starts this scene
   */
  public init(data: SceneTransitionData): void
  {
    this.animatedTiles = [];
    this.sceneTransitionData = data;
  }
  
  /**
   * Scenes can have a preload method, which is always called before the Scenes 
   * create method, allowing you to preload assets that the Scene may need.
   */
	public preload(): void
	{
    // load tileset image
    this.load.image(this.getTilesetFilePath(this.sceneTransitionData!), this.getTilesetFilePath(this.sceneTransitionData!));
    // load tilemap json data
    this.load.tilemapTiledJSON(this.getTilemapFilePath(this.sceneTransitionData!), this.getTilemapFilePath(this.sceneTransitionData!));
	}

  /**
   * Scenes can have a create method, which is always called after the Scenes 
   * init and preload methods, allowing you to create assets that the Scene may need.
   * 
   * The data is passed when the scene is started/launched by the scene manager.
   * 
   * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
   * @param {SceneTransitionData} data - the data being passed when the scene manager starts this scene
   */
	public create(data: SceneTransitionData): void
	{
    // parse tilemap json data to phaser tile map object
    this.tilemap = this.make.tilemap({ key: this.getTilemapFilePath(this.sceneTransitionData!) });

    // parse tileset image
    const tilesetNameInTilemapData = this.getTilesetFilePath(this.sceneTransitionData!).slice(
      this.getTilesetFilePath(this.sceneTransitionData!).lastIndexOf("/") + 1, this.getTilesetFilePath(this.sceneTransitionData!).lastIndexOf("."));
    this.tileset = this.tilemap.addTilesetImage(tilesetNameInTilemapData, this.getTilesetFilePath(this.sceneTransitionData!));

    // create transition layer
    this.transitionObjectGroup = this.physics.add.staticGroup();
    const tiledTransitionObjects = this.tilemap.getObjectLayer(TileLayer.Transition).objects as TiledTransitionObject[];
    tiledTransitionObjects.forEach(tiledTransitionObject => {
      this.transitionObjectGroup?.add(new SceneTransitionObject(this, tiledTransitionObject));
    });

    // create bottom layer
    this.bottomLayer = this.tilemap.createDynamicLayer(TileLayer.Bottom, this.tileset, 0, 0);
    this.bottomLayer.setCollisionByProperty({ collision: true });   

    // create middle layer
    this.middleLayer = this.tilemap.createDynamicLayer(TileLayer.Middle, this.tileset, 0, 0);
    this.middleLayer.setCollisionByProperty({ collision: true });     
    
    // create top layer
    this.topLayer = this.tilemap.createDynamicLayer(TileLayer.Top, this.tileset, 0, 0);

    // create animated tiles
    for (let key in this.tileset.tileData as TilesetTileData)
    {
      this.tilemap.layers.forEach(layer => {
        if (layer.tilemapLayer.type === "DynamicTilemapLayer") 
        {
          layer.data.forEach(tileRow => {
            tileRow.forEach(tile => {
              if ((tile.index - this.tileset!.firstgid) === parseInt(key)) 
              {
                this.animatedTiles.push(new AnimatedTile(tile, (this.tileset!.tileData as TilesetTileData)[key].animation!, this.tileset!.firstgid));
              }
            });
          });
        }
      })
    }

    // get reference to the keyboard key
    this.keyI = this.input.keyboard.addKey('I');

    // setup debug mode
    this.debugGraphics = this.add.graphics().setAlpha(0.5);
    this.bottomLayer.renderDebug(this.debugGraphics!, TilemapScene.RENDER_DEBUG_CONFIG);
    this.middleLayer.renderDebug(this.debugGraphics!, TilemapScene.RENDER_DEBUG_CONFIG);

    // set world bounds
    this.physics.world.bounds.width = this.tilemap.widthInPixels;
    this.physics.world.bounds.height = this.tilemap.heightInPixels;

    // configure camera
    this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
    this.cameras.main.setZoom(2);

    // hide debug graphics
    this.physics.world.debugGraphic.setVisible(false);
    this.debugGraphics.setVisible(false);

  }
  
  /**
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time
   * @param {number} delta - the delta time in ms since the last frame
   */
  public update(time: number, delta: number): void
	{
    // toggle debug mode
    if (Phaser.Input.Keyboard.JustDown(this.keyI!)) 
    {
      // built in debug display
      this.physics.world.debugGraphic.setVisible(!this.physics.world.debugGraphic.visible);

      // custom debug display
      this.debugGraphics!.setVisible(!this.debugGraphics!.visible);
    }

    this.animatedTiles.forEach(tile => tile.update(delta));

  }

  /**
   * file path to the tilemap of this scene
   * @param {SceneTransitionData} data - the data the scene received for initialization
   * @return {string} - tile map file path
   */
  public abstract getTilemapFilePath(data: SceneTransitionData): string;

  /**
   * file path to the tileset for the tilemap
   * @param {SceneTransitionData} data - the data the scene received for initialization
   * @return {string} - tile set file path
   */
  public abstract getTilesetFilePath(data: SceneTransitionData): string;

}

export default TilemapScene;