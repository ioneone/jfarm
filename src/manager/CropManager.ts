import Crop from '../objects/Crop';
/**
 * CropManager manages the crops.
 * This is used in CropScene.
 */
class CropManager
{

  private widthInTiles: number;
  private heightInTiles: number;

  private crops: Crop[][];

  constructor(widthInTiles: number, heightInTiles: number)
  {
    this.widthInTiles = widthInTiles;
    this.heightInTiles = heightInTiles;

    this.crops = new Array(heightInTiles);
    for (let i = 0; i < this.crops.length; i++)
    {
      this.crops[i] = new Array(widthInTiles);
    }
  }

  public hasCrop(xInTiles: number, yInTiles: number)
  {
    return this.crops[yInTiles][xInTiles] != null;
  }

  public addCrop(xInTiles: number, yInTiles: number, crop: Crop)
  {
    if (this.hasCrop(xInTiles, yInTiles)) return;
    this.crops[yInTiles][xInTiles] = crop;
  }
}

export default CropManager;