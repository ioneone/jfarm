import { SceneTransitionData } from '../objects/SceneTransitionObject';
import Phaser from 'phaser';
import AnimatedTile, { TilesetTileData } from '../objects/AnimatedTile';
import BaseScene from './BaseScene';
import SceneTransitionObjectFactory from '../factory/SceneTransitionObjectFactory';

/**
 * The name of tile layers of the tilemap exported from Tiled program.
 * @see TilemapScene
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
 * Responsible for reading tiledmap and rendering the world.
 * @class
 * @classdesc
 * The tilemap must have the structure as follows:
 * - TopLayer (non-collidable)
 * - ObjectLayer
 * - MiddleLayer (collidable)
 * - BottomLayer (collidable)
 * - TransitionLayer
 * The lower layer will be rendered first. Use default name for tileset name. 
 * (e.g. `path/to/file/foo.png` => `foo`)
 * 
 * The tile map and tile set files should follow a convention. If the key of the 
 * map is `foo`, then your tile map file must be located at `foo.json`, 
 * the tile set file at `foo.png`, and the tile set normal map file at 
 * `foo_n.png`.
 * 
 * The depths of the layers are 0 by default except the TopLayer whose depth is 
 * set to 1 so it appears on top of every game object with depth 0 even if they 
 * are added later.
 */
abstract class TilemapScene extends BaseScene
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

  // light enabled objects need at least one light source to exibit ambient color
  protected sceneLight?: Phaser.GameObjects.Light;

  // temporary storage for tile map key extracted from init() method
  protected tilemapKey?: string;

  // temporary storage for tile set key extracted from init() method
  protected tilesetKey?: string;

  protected isDark?: boolean;

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
    this.tilemapKey = this.getTilemapKey(data);
    this.tilesetKey = this.getTilesetKey(data);
    this.isDark = data.isDark;
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
      this.transitionObjectGroup?.add(SceneTransitionObjectFactory.create(this, tiledTransitionObject));
    });

    // create bottom layer
    this.bottomLayer = this.tilemap.createDynamicLayer(TileLayer.Bottom, this.tileset, 0, 0);
    this.bottomLayer.setCollisionByProperty({ collision: true });   

    // create middle layer
    this.middleLayer = this.tilemap.createDynamicLayer(TileLayer.Middle, this.tileset, 0, 0);
    this.middleLayer.setCollisionByProperty({ collision: true });     
    
    // create top layer
    this.topLayer = this.tilemap.createDynamicLayer(TileLayer.Top, this.tileset, 0, 0);

    // Bring top layer to the front.
    // Depth is 0 (unsorted) by default, which perform the rendering 
    // in the order it was added to the scene.
    this.topLayer.setDepth(1);

    // create animated tiles
    // loop through every tile and check if its id is animated tile's id
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

    // setup debug mode
    this.debugGraphics = this.add.graphics().setAlpha(0.5).setVisible(false);
    this.bottomLayer.renderDebug(this.debugGraphics!, TilemapScene.RENDER_DEBUG_CONFIG);
    this.middleLayer.renderDebug(this.debugGraphics!, TilemapScene.RENDER_DEBUG_CONFIG);

    // set world bounds
    this.physics.world.bounds.width = this.tilemap.widthInPixels;
    this.physics.world.bounds.height = this.tilemap.heightInPixels;

    // configure camera
    this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
    this.cameras.main.setZoom(2);

    // configure lights
    if (this.isDark)
    {
      this.bottomLayer.setPipeline('Light2D');
      this.middleLayer.setPipeline('Light2D');
      this.topLayer.setPipeline('Light2D');
      this.sceneLight = this.lights.addLight();
      this.lights.enable().setAmbientColor(0x404040);
    }
    
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
    this.animatedTiles.forEach(tile => tile.update(delta));
  }

  /**
   * Get the unique key of the tile map. The `key` of a tile map is just its 
   * file path excluding the extension. If your tile map is located at 
   * `path/to/tile/map/foo.json`, then the key should be `path/to/tile/map/foo`.
   * @param {any} data - the data the scene received for initialization
   * @return {string} - the tile map key
   */
  public abstract getTilemapKey(data: any): string;

  /**
   * Get the unique key of the tile set. The `key` of a tile set is just its 
   * file path excluding the extension. If your tile set is located at 
   * `path/to/tile/set/foo.png`, then the key should be `path/to/tile/set/foo`.
   * The tile set normal map must be located at `path/to/tile/set/foo_n.png`.
   * @param {any} data - the data the scene received for initialization
   * @return {string} - the tile set key
   */
  public abstract getTilesetKey(data: any): string;

  /**
   * The graphics shows useful information for debugging when the debug mode 
   * is turned on. In `update()`, it checks whether a debug key (assigned in 
   * {@link BaseScene}) is pressed, and if it is, call this function.
   * @override
   */
  protected toggleDebugMode(): void
  {
    super.toggleDebugMode();

    // toggle custom debug display
    this.debugGraphics!.setVisible(this.physics.world.debugGraphic.visible);

    // toggle lights
    if (this.isDark)
    {
      if (this.physics.world.debugGraphic.visible)
      {
        this.bottomLayer?.resetPipeline();
        this.middleLayer?.resetPipeline();
        this.topLayer?.resetPipeline();
      }
      else
      {
        this.bottomLayer?.setPipeline('Light2D');
        this.middleLayer?.setPipeline('Light2D');
        this.topLayer?.setPipeline('Light2D');
      }
    }
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

export default TilemapScene;