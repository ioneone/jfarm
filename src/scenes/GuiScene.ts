import Phaser from 'phaser';
import ItemBoxes from "../gui/ItemBoxes";

class GuiScene extends Phaser.Scene
{
  constructor()
	{
    super({ key: 'gui', active: true });
	}

  public preload()
  {
    this.load.image("box", "assets/box.png");
    this.load.image("axe", "assets/axe.png");
  }

  public update()
  {

  }

  public create()
  {

    this.input.setDefaultCursor('url(assets/cursor.png), pointer');
    
    new ItemBoxes(this, 512 / 2, 340);

    // const marker = this.add.graphics();
    // marker.lineStyle(5, 0xffffff, 1);
    // marker.strokeRect(0, 0, box.width, box.height);
    // marker.lineStyle(3, 0xff4f78, 1);
    // marker.strokeRect(0, 0, box.width, box.height);

    // marker.setPosition(box.getBounds().x, box.getBounds().y);

    // const text = this.add.text(box.getBounds().x + 2, box.getBounds().y + 2, '1', { fontSize: 12, color: '#000000' });


  }


}

export default GuiScene;