import Phaser from 'phaser';

class Bar extends Phaser.Scene
{
  constructor()
	{
    super({ key: 'gui', active: true });
	}

  public preload()
  {
    this.load.image("box", "assets/box.png");
    this.load.image("axe", "assets/axe.png");
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
  }

  public create()
  {
    
    const startX = 120;

    const box = this.add.image(startX, 340, 'box');
    this.add.image(startX, 340, 'axe').setScale(1.5);
    this.add.image(startX + box.width, 340, 'box');
    this.add.image(startX + 2 * box.width, 340, 'box');
    this.add.image(startX + 3 * box.width, 340, 'box');
    this.add.image(startX + 4 * box.width, 340, 'box');
    this.add.image(startX + 5 * box.width, 340, 'box');
    this.add.image(startX + 6 * box.width, 340, 'box');
    this.add.image(startX + 7 * box.width, 340, 'box');
    this.add.image(startX + 8 * box.width, 340, 'box');
    this.add.image(startX + 9 * box.width, 340, 'box');

    const marker = this.add.graphics();
    marker.lineStyle(5, 0xffffff, 1);
    marker.strokeRect(0, 0, box.width, box.height);
    marker.lineStyle(3, 0xff4f78, 1);
    marker.strokeRect(0, 0, box.width, box.height);

    marker.setPosition(box.getBounds().x, box.getBounds().y);

    const text = this.add.text(box.getBounds().x + 2, box.getBounds().y + 2, '1', { fontSize: 12, color: '#000000' });


  }


}

export default Bar;