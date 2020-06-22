import SceneTransitionObject, { SceneTransitionData } from '../objects/SceneTransitionObject';
import Phaser from 'phaser';
import AnimatedTile, { TilesetTileData } from '../objects/AnimatedTile';
import BaseScene from './BaseScene';
import ParallaxScene from './ParallaxScene';

/**
 * The name of tile layers of the tilemap exported from Tiled program.
 * @see PlatformScene
 * @readonly
 * @enum {string}
 */
export enum TileLayer
{
  Top = "TopLayer",
  Object = "ObjectLayer",
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
 * Responsible for parsing and rendering of a tilemap.  
 * @class
 * @classdesc
 * Base class for {@link PlayerScene}.
 * 
 * The tilemap must have the structure as follows:
 * - TopLayer (non-collidable)
 * - ObjectLayer
 * - MiddleLayer (collidable)
 * - BottomLayer (collidable)
 * - TransitionLayer
 * 
 * The lower layer will be rendered first. Use default name for tileset name 
 * (e.g. `path/to/file/foo.png` => `foo`). This scene expects to receive data 
 * with key `tilemapKey` and `tilesetKey`. The depths of the layers are 0 by 
 * default except the TopLayer whose depth is set to `Infinity` so it appears 
 * on top of every game object with any depth.
 * 
 * BottomLayer should have ground tiles to prevent the player from falling the 
 * world. By default, BottomLayer is not visible.
 * 
 * MiddleLayer should have platform tiles that player can jump on. By default, 
 * platform tiles are collidable from top only, which means the player can jump 
 * through those tiles from bottom, but can't fall from top.
 */
class PlatformScene extends ParallaxScene
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

  // referene to animatable tiles
  protected animatedTiles: AnimatedTile[];

  // temporary storage for tile map key extracted from init() method
  protected tilemapKey?: string;

  // temporary storage for tile set key extracted from init() method
  protected tilesetKey?: string;

  // press 'I' key to toggle debug mode
  protected keyI?: Phaser.Input.Keyboard.Key;

  /**
   * This is called only once when you start the game. Every time a scene is 
   * created using methods like `scene.start()`, `constructor()` will not be 
   * called (`init()` will still be called though).
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
   * @override
   */
  public init(data: SceneTransitionData): void
  {
    super.init(data);
    this.animatedTiles = [];
    this.tilemapKey = data.tilemapKey;
    this.tilesetKey = data.tilesetKey;
  }
  
  /**
   * Scenes can have a preload method, which is always called before the Scenes 
   * create method, allowing you to preload assets that the Scene may need.
   * @override
   */
	public preload(): void
	{
    super.preload();

    this.load.image(this.createDefaultImageFileConfig(this.tilesetKey!));
    this.load.tilemapTiledJSON(this.tilemapKey!);
	}

  /**
   * Scenes can have a create method, which is always called after the Scenes 
   * init and preload methods, allowing you to create assets that the Scene may need.
   * 
   * The data is passed when the scene is started/launched by the scene manager.
   * 
   * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
   * @param {any} data - the data being passed when the scene manager starts this scene
   * @override
   */
	public create(data: any): void
	{
    super.create(data);

    // parse tilemap json data to phaser tile map object
    this.tilemap = this.make.tilemap({ key: this.tilemapKey! });
    
    // parse tileset image
    const tilesetName = this.getDefaultTilesetName(this.tilesetKey!);
    this.tileset = this.tilemap.addTilesetImage(tilesetName, this.tilesetKey!);

    // create transition layer
    this.transitionObjectGroup = this.physics.add.staticGroup();
    const tiledTransitionObjects = this.tilemap.getObjectLayer(TileLayer.Transition).objects as TiledTransitionObject[];
    tiledTransitionObjects.forEach(tiledTransitionObject => {
      this.transitionObjectGroup?.add(new SceneTransitionObject(this, tiledTransitionObject));
    });

    // create bottom layer
    this.bottomLayer = this.tilemap.createDynamicLayer(TileLayer.Bottom, this.tileset, 0, 0);
    this.bottomLayer.setCollisionByProperty({ collision: true });

    // bottom layer is not visible by default
    this.bottomLayer.setVisible(false);

    // create middle layer
    this.middleLayer = this.tilemap.createDynamicLayer(TileLayer.Middle, this.tileset, 0, 0);
    this.middleLayer.setCollisionByProperty({ collision: true });

    // tiles in middle layer only detects top collision
    this.middleLayer?.layer.data.forEach(row => {
      row.forEach(tile => {
        if (tile.collides) tile.setCollision(false, false, true, false);
      })
    }) 
    
    // create top layer
    this.topLayer = this.tilemap.createDynamicLayer(TileLayer.Top, this.tileset, 0, 0);

    // Bring top layer to the front.
    // Depth is 0 (unsorted) by default, which perform the rendering 
    // in the order it was added to the scene.
    // Set the depth high enough so that TopLayer is on top of any game objects
    // whose depth might be higher than 0 due to depth sorting.
    this.topLayer.setDepth(Infinity);

    // create animated tiles
    // loop through every tile and check if its id is animated tile's id
    // const tileData = this.tileset.tileData as TilesetTileData;
    // for (let tileid in tileData)
    // {
    //   this.tilemap.layers.forEach(layer => {
    //     if (layer.tilemapLayer.type === "StaticTilemapLayer") return;
    //     layer.data.forEach(tileRow => {
    //       tileRow.forEach(tile => {
    //         // Typically `firstgid` is 1, which means tileid starts from 1.
    //         // Tiled's tileid starts from 0.
    //         if ((tile.index - this.tileset!.firstgid) === parseInt(tileid)) 
    //         {
    //           this.animatedTiles.push(new AnimatedTile(tile, tileData[tileid].animation!, this.tileset!.firstgid));
    //         }
    //       });
    //     });
    //   })
    // }

    // get reference to the keyboard key
    this.keyI = this.input.keyboard.addKey('I');

    // setup debug mode
    this.debugGraphics = this.add.graphics().setAlpha(0.5).setVisible(false);
    this.bottomLayer.renderDebug(this.debugGraphics!, PlatformScene.RENDER_DEBUG_CONFIG);
    this.middleLayer.renderDebug(this.debugGraphics!, PlatformScene.RENDER_DEBUG_CONFIG);

    // set world bounds
    this.physics.world.bounds.width = this.tilemap.widthInPixels;
    this.physics.world.bounds.height = this.tilemap.heightInPixels;

    // configure camera
    this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);

    // don't show built-in debug graphics by default 
    this.physics.world.debugGraphic.setVisible(false);
  }
  
  /**
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time
   * @param {number} delta - the delta time in ms since the last frame
   * @override
   */
  public update(time: number, delta: number): void
	{
    super.update(time, delta);

    if (Phaser.Input.Keyboard.JustDown(this.keyI!)) 
    {
      this.toggleDebugMode(); 
    }

    // this.animatedTiles.forEach(tile => tile.update(delta));
  }

  /**
   * The graphics shows useful information for debugging when the debug mode 
   * is turned on. In `update()`, it checks whether a debug key (assigned in 
   * {@link BaseScene}) is pressed, and if it is, call this function.
   * @override
   */
  protected toggleDebugMode(): void
  {
    // toggle built in debug display
    this.physics.world.debugGraphic.setVisible(!this.physics.world.debugGraphic.visible);

    // toggle custom debug display
    this.debugGraphics!.setVisible(this.physics.world.debugGraphic.visible);
  }

  /**
   * By default, Tiled uses the filename of the tileset image to reference the 
   * tiles in that tileset. See {@link TilemapScene#getTilesetKey} for 
   * definition of `tilesetKey`.
   * 
   * @example
   * getDefaultTilesetName("path/to/tile/set/foo"); // return "foo"
   * 
   * @param {string} tilesetKey - the tile set key 
   */
  private getDefaultTilesetName(tilesetKey: string): string
  {
    return tilesetKey.slice(tilesetKey.lastIndexOf("/") + 1);
  }

}

export default PlatformScene;