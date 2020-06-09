import SceneTransitionObject from '../objects/SceneTransitionObject';
import Phaser from 'phaser';

export enum TileLayer
{
  Top = "TopLayer",
  Middle = "MiddleLayer",
  Bottom = "BottomLayer",
  Transition = "TransitionLayer"
}

// Raw data of Tiled transition object
// These are data provided by Tiled program by default
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
 * TilemapScene is responsible for reading tiledmap and
 * rendering the world
 */
abstract class TilemapScene extends Phaser.Scene
{

  /**
   * The tilemap must have the structure as follows:
   * - TopLayer (non-collidable)
   * - MiddleLayer (collidable)
   * - BottomLayer (collidable)
   * - TransitionLayer
   * The lower layer will be rendered first.
   * Use default name for tileset name. 
   * (e.g. path/to/file/foo.png => foo)
   */
  protected tilemap?: Phaser.Tilemaps.Tilemap;

  // Tileset for the tilemap
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

  protected animatedTiles: any[];

  /**
   * @param key {string} - the unique id of the scene
   */
	constructor(key: string)
	{
    super(key);
    this.animatedTiles = [];
  }

  /**
   * Use init() to pass data from one scene to another.
   * init() is called before preload()
   * @param data {any} - the data received from another scene
   */
  public init(data: any)
  {
  }
  
  /**
   * preload() is always called before the Scenes create method, 
   * allowing you to preload assets that the Scene may need.
   */
	public preload()
	{
    // load tileset image
    this.load.image(this.getTilesetFilePath(), this.getTilesetFilePath());
    // load tilemap json data
    this.load.tilemapTiledJSON(this.getTilemapFilePath(), this.getTilemapFilePath());
	}

  /**
   * create() is called after preload() is completed.
   * You can safely assume all the resources are declared in preload()
   * are loaded to the memory.
   */
	public create()
	{
    // parse tilemap json data to phaser tile map object
    this.tilemap = this.make.tilemap({ key: this.getTilemapFilePath() });

    // parse tileset image
    const tilesetNameInTilemapData = this.getTilesetFilePath().slice(
      this.getTilesetFilePath().lastIndexOf("/") + 1, this.getTilesetFilePath().lastIndexOf("."));
    this.tileset = this.tilemap.addTilesetImage(tilesetNameInTilemapData, this.getTilesetFilePath());


    // create transition layer
    this.transitionObjectGroup = this.physics.add.staticGroup();
    const tiledTransitionObjects = this.tilemap.getObjectLayer(TileLayer.Transition).objects as TiledTransitionObject[];
    tiledTransitionObjects.forEach(tiledTransitionObject => {
      const transitionObject = this.parseTransitionObject(tiledTransitionObject); 
      this.transitionObjectGroup?.add(transitionObject);
    });

    // create bottom layer
    this.bottomLayer = this.tilemap.createDynamicLayer("BottomLayer", this.tileset, 0, 0);
    this.bottomLayer.setCollisionByProperty({ collision: true });   

    // create middle layer
    this.middleLayer = this.tilemap.createDynamicLayer("MiddleLayer", this.tileset, 0, 0);
    this.middleLayer.setCollisionByProperty({ collision: true });     
    
    // create top layer
    this.topLayer = this.tilemap.createDynamicLayer("TopLayer", this.tileset, 0, 0);

    console.log(this.tileset);

    for (let key in this.tileset.tileData as {[key: number]: { animation?: { duration: number, tileid: number }[] }})
    {
      const value = this.tileset.tileData[key];
      this.tilemap.layers.forEach(layer => {
        if (layer.tilemapLayer.type === "DynamicTilemapLayer") 
        {
          layer.data.forEach(tileRow => {
            tileRow.forEach(tile => {
              if ((tile.index - this.tileset!.firstgid) === parseInt(key)) 
              {
                this.animatedTiles.push(tile);
                tile.animationData = value.animation;
                tile.currentAnimationFrame = 0;
              }
            });
          });
        }
      })
    }

    console.log(this.animatedTiles);

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
   * update() is called after create() is completed.
   * This method is called every frame and updates the state
   * of the scene.
   */
  public update(time, delta)
	{
    // toggle debug mode
    if (Phaser.Input.Keyboard.JustDown(this.keyI!)) 
    {
      // built in debug display
      this.physics.world.debugGraphic.setVisible(!this.physics.world.debugGraphic.visible);

      // custom debug display
      this.debugGraphics!.setVisible(!this.debugGraphics!.visible);
    }

    this.animatedTiles.forEach(tile => {
      tile.currentAnimationFrame += delta;
      tile.currentAnimationFrame %= 300;
      const animationIndex = Math.floor(tile.currentAnimationFrame / 100);
      tile.index = tile.animationData[animationIndex].tileid + this.tileset!.firstgid;
    })

  }

  /**
   * file path to the tilemap of this scene
   * @return {string} - tile map file path
   */
  public abstract getTilemapFilePath(): string;

  /**
   * file path to the tileset for the tilemap
   * @return {string} - tile set file path
   */
  public abstract getTilesetFilePath(): string;

  /**
   * How to parse transition object depends on its destination scene
   * Every scene requires different data for initialization
   * @param tiledTransitionObject {TiledTransitionObject} - transition object to parse
   * @return {[key: string]: string} - an object 
   */
  public abstract parseTransitionObject(tiledTransitionObject: TiledTransitionObject): SceneTransitionObject;

}

export default TilemapScene;