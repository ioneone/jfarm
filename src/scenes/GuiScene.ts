import Phaser from 'phaser';
import ItemBoxes from "../gui/ItemBoxes";

class GuiScene extends Phaser.Scene
{

  private itemBoxes: ItemBoxes | null;

  constructor()
	{
    super({ key: 'gui', active: true });
    this.itemBoxes = null;
	}

  public preload()
  {
    this.load.image("box", "assets/box.png");
    this.load.image("axe", "assets/axe.png");
  }

  public update()
  {
    this.itemBoxes?.update();
  }

  public create()
  {

    // this.input.setDefaultCursor('url(assets/cursor.png), pointer');
    
    // this.itemBoxes = new ItemBoxes(this, 512 / 2, 340);

  }


}

export default GuiScene;