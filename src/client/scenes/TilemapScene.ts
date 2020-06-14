import { SceneTransitionData } from '../objects/SceneTransitionObject';
import SceneTransitionObject from '../objects/SceneTransitionObject';
import Phaser from 'phaser';
import AnimatedTile, { TilesetTileData } from '../objects/AnimatedTile';
import BaseScene from './BaseScene';

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
   * @override
   */
  public init(data: SceneTransitionData): void
  {
    super.init(data);
    this.animatedTiles = [];
    this.sceneTransitionData = data;
  }
  
  /**
   * Scenes can have a preload method, which is always called before the Scenes 
   * create method, allowing you to preload assets that the Scene may need.
   * @override
   */
	public preload(): void
	{
    super.preload();

    // load tileset image
    this.load.image(this.createDefaultImageFileConfig(
      this.getTilesetKey(this.sceneTransitionData!)));

    // load tilemap json data
    this.load.tilemapTiledJSON(this.getTilemapKey(this.sceneTransitionData!));
	}

  /**
   * Scenes can have a create method, which is always called after the Scenes 
   * init and preload methods, allowing you to create assets that the Scene may need.
   * 
   * The data is passed when the scene is started/launched by the scene manager.
   * 
   * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}
   * @param {SceneTransitionData} data - the data being passed when the scene manager starts this scene
   * @override
   */
	public create(data: SceneTransitionData): void
	{
    super.create(data);

    // parse tilemap json data to phaser tile map object
    this.tilemap = this.make.tilemap({ 
      key: this.getTilemapKey(this.sceneTransitionData!)
    });
    
    // parse tileset image
    const tilesetKey = this.getTilesetKey(this.sceneTransitionData!);
    const tilesetName = this.getDefaultTilesetName(tilesetKey);
    this.tileset = this.tilemap.addTilesetImage(tilesetName, tilesetKey);

    // create transition layer
    this.transitionObjectGroup = this.physics.add.staticGroup();
    const tiledTransitionObjects = this.tilemap.getObjectLayer(TileLayer.Transition).objects as TiledTransitionObject[];
    tiledTransitionObjects.forEach(tiledTransitionObject => {
      this.transitionObjectGroup?.add(new SceneTransitionObject(this, tiledTransitionObject));
    });

    // create bottom layer
    this.bottomLayer = this.tilemap.createDynamicLayer(TileLayer.Bottom, this.tileset, 0, 0).setPipeline('Light2D');
    this.bottomLayer.setCollisionByProperty({ collision: true });   

    // create middle layer
    this.middleLayer = this.tilemap.createDynamicLayer(TileLayer.Middle, this.tileset, 0, 0).setPipeline('Light2D');
    this.middleLayer.setCollisionByProperty({ collision: true });     
    
    // create top layer
    this.topLayer = this.tilemap.createDynamicLayer(TileLayer.Top, this.tileset, 0, 0).setPipeline('Light2D');

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
   * @override
   */
  public update(time: number, delta: number): void
	{

    super.update(time, delta);

    // toggle debug mode
    if (Phaser.Input.Keyboard.JustDown(this.keyI!)) 
    {
      this.toggleDebugMode(); 
    }

    this.animatedTiles.forEach(tile => tile.update(delta));

  }

  /**
   * Get the unique key of the tile map. The `key` of a tile map is just its 
   * file path excluding the extension. If your tile map is located at 
   * `path/to/tile/map/foo.json`, then the key should be `path/to/tile/map/foo`.
   * @param {SceneTransitionData} data - the data the scene received for initialization
   * @return {string} - the tile map key
   */
  public abstract getTilemapKey(data: SceneTransitionData): string;

  /**
   * Get the unique key of the tile set. The `key` of a tile set is just its 
   * file path excluding the extension. If your tile set is located at 
   * `path/to/tile/set/foo.png`, then the key should be `path/to/tile/set/foo`.
   * The tile set normal map must be located at `path/to/tile/set/foo_n.png`.
   * @param {SceneTransitionData} data - the data the scene received for initialization
   * @return {string} - the tile set key
   */
  public abstract getTilesetKey(data: SceneTransitionData): string;

  /**
   * The graphics shows useful information for debugging when the debug mode 
   * is turned on.
   */
  protected toggleDebugMode(): void
  {
    // toggle built in debug display
    this.physics.world.debugGraphic.setVisible(!this.physics.world.debugGraphic.visible);

    // toggle custom debug display
    this.debugGraphics!.setVisible(!this.debugGraphics!.visible);
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
    // extract the filename
    return tilesetKey.slice(tilesetKey.lastIndexOf("/") + 1);
  }

}

export default TilemapScene;