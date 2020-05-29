import Crop from '../objects/Crop';
import GameScene from "./GameScene";
import CropManager from '../manager/CropManager';

/**
 * CropScene is responsible for managing the soils
 * and crops in the scene
 */
class CropScene extends GameScene
{

  // manages the locations of the crops in this scene
  protected cropManager?: CropManager;

  // player can place a seed in crop mode
  protected cropMode: boolean;

  // keyboard key to toggle crop mode
  protected keyC?: Phaser.Input.Keyboard.Key;

  // preview the plant when placed
  protected previewSprite?: Phaser.GameObjects.Sprite;
  protected previewMarker?: Phaser.GameObjects.Rectangle;

  constructor(key: string, tilemapFilePath: string, tilesetFilePaths: string[])
  {
    super(key, tilemapFilePath, tilesetFilePaths);
    this.cropMode = false;
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
    this.cropManager = new CropManager(this.tilemap!.width, this.tilemap!.height);

    // Create a simple graphic that can be used to show which tile the mouse is over
    this.previewSprite = this.add.sprite(0, 0, "assets/plant/plants.png", 0);
    this.previewSprite.setAlpha(0.5);
    this.previewSprite.setOrigin(0.5, 0.85);
    this.previewMarker = this.add.rectangle(0, 0, 32, 32);

    // add event listener for left moust click for planting
    this.input.on('pointerdown', () => {

      if (!this.cropMode) return;

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
        console.log("not soil");
      }
    });

  }

  update()
  {
    super.update();

    // toggle crop mode
    if (Phaser.Input.Keyboard.JustDown(this.keyC!))
    {
      this.cropMode = !this.cropMode;
      this.previewSprite?.setVisible(this.cropMode);
      this.previewMarker?.setVisible(this.cropMode);
    }

    if (this.cropMode)
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