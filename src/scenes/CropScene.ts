import Crop from '../objects/Crop';
import GameScene from "./GameScene";
import CropManager from '../manager/CropManager';

enum GameMode
{
  // player can place the seeds in crop mode
  Crop,
  // player can plow the soil in plow mode
  Plow,
  // initial game mode
  Default
}

/**
 * CropScene is responsible for managing the soils
 * and crops in the scene
 */
class CropScene extends GameScene
{

  // manages the locations of the crops in this scene
  protected cropManager?: CropManager;

  // current game mode
  protected mode: GameMode;
  
  // keyboard key to turn on crop mode
  protected keyC?: Phaser.Input.Keyboard.Key;

  // keyboard key to turn on plow mode
  protected keyP?: Phaser.Input.Keyboard.Key;

  // preview the plant when placed
  protected previewSprite?: Phaser.GameObjects.Sprite;
  protected previewMarker?: Phaser.GameObjects.Rectangle;

  constructor(key: string, tilemapFilePath: string, tilesetFilePaths: string[])
  {
    super(key, tilemapFilePath, tilesetFilePaths);
    this.mode = GameMode.Default;
  }

  preload()
  {
    super.preload();
    this.load.spritesheet("assets/plant/plants.png", "assets/plant/plants.png", { frameWidth: 32, frameHeight: 64 });
  }

  create()
  {
    super.create();

    this.keyC = this.input.keyboard.addKey('C');
    this.keyP = this.input.keyboard.addKey('P');

    this.cropManager = new CropManager(this.tilemap!.width, this.tilemap!.height);

    // Create a simple graphic that can be used to show which tile the mouse is over
    this.previewSprite = this.add.sprite(0, 0, "assets/plant/plants.png", 0);
    this.previewSprite.setAlpha(0.5);
    this.previewSprite.setOrigin(0.5, 0.85);
    this.previewMarker = this.add.rectangle(0, 0, 32, 32);

    // add event listener for left moust click for planting
    this.input.on('pointerdown', () => {

      if (this.mode === GameMode.Crop)
      {
        const mouseTilePosition = this.getMouseTilePosition();
        const snappedWorldPosition = this.getSnappedWorldPosition(mouseTilePosition);
        this.previewSprite?.setPosition(snappedWorldPosition.x + 16, snappedWorldPosition.y + 16);
        this.previewMarker?.setPosition(snappedWorldPosition.x + 16, snappedWorldPosition.y + 16);
  
        const isSoil = this.bottomLayer!.getTileAt(mouseTilePosition.x, mouseTilePosition.y).properties.isSoil;
        if (isSoil && !this.cropManager!.hasCrop(mouseTilePosition.x, mouseTilePosition.y))
        {
          this.cropManager!.addCrop(mouseTilePosition.x, mouseTilePosition.y, 
            new Crop(this, snappedWorldPosition.x + 16, snappedWorldPosition.y + 16, 0))
        }
        else
        {
          const snappedWorldPosition = this.getSnappedWorldPosition(mouseTilePosition);
          const text = this.add.text(snappedWorldPosition.x, snappedWorldPosition.y, "not soil");

          this.tweens.add({
            targets: text,
            alpha: 0,
            duration: 2000,
            ease: 'Power2'
          });

          this.time.delayedCall(2000, () => {
            text.destroy();
          });
        }
      }
      else if (this.mode === GameMode.Plow)
      {
        const mouseTilePosition = this.getMouseTilePosition();
        const isGrass = this.bottomLayer!.getTileAt(mouseTilePosition.x, mouseTilePosition.y).properties.isGrass;
        if (isGrass)
        {
          this.player?.thrust();
          const tile = this.bottomLayer?.putTileAt(this.tilesets![2].firstgid + 15, mouseTilePosition.x, mouseTilePosition.y);
          tile!.properties = this.tilesets![2].tileProperties[15];
        }
        else
        {
          const snappedWorldPosition = this.getSnappedWorldPosition(mouseTilePosition);
          const text = this.add.text(snappedWorldPosition.x, snappedWorldPosition.y, "not grass");

          this.tweens.add({
            targets: text,
            alpha: 0,
            duration: 2000,
            ease: 'Power2'
          });

          this.time.delayedCall(2000, () => {
            text.destroy();
          });
        }
      }

    });

  }

  update()
  {
    super.update();

    if (Phaser.Input.Keyboard.JustDown(this.keyC!))
    {
      this.mode = GameMode.Crop;
    }
    else if (Phaser.Input.Keyboard.JustDown(this.keyP!))
    {
      this.mode = GameMode.Plow;
    }

    this.previewSprite?.setVisible(this.mode === GameMode.Crop);
    this.previewMarker?.setVisible(this.mode === GameMode.Crop);

    if (this.mode === GameMode.Crop)
    {
      
      const mouseTilePosition = this.getMouseTilePosition();
      const snappedWorldPosition = this.getSnappedWorldPosition(mouseTilePosition);
      this.previewSprite?.setPosition(snappedWorldPosition.x + 16, snappedWorldPosition.y + 16);
      this.previewMarker?.setPosition(snappedWorldPosition.x + 16, snappedWorldPosition.y + 16);

      const isSoil = this.bottomLayer!.getTileAt(mouseTilePosition.x, mouseTilePosition.y).properties.isSoil;
      if (isSoil && !this.cropManager!.hasCrop(mouseTilePosition.x, mouseTilePosition.y))
      {
        this.previewMarker?.setStrokeStyle(1, 0x00ff00);
      }
      else
      {
        this.previewMarker?.setStrokeStyle(1, 0xff0000);
      }
    }

  }

  private getMouseTilePosition() : Phaser.Math.Vector2
  {
    // Convert the mouse position to world position within the camera
    const mouseWorldPosition = this.input.activePointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
    return this.bottomLayer!.worldToTileXY(mouseWorldPosition.x, mouseWorldPosition.y);
  }

  private getSnappedWorldPosition(mouseTilePosition: Phaser.Math.Vector2) : Phaser.Math.Vector2
  {
    return this.bottomLayer!.tileToWorldXY(mouseTilePosition.x, mouseTilePosition.y);
  }
}

export default CropScene;