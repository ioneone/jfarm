import Phaser from 'phaser';
import Items from '../ui/Items';

class UIScene extends Phaser.Scene
{
  constructor()
  {
    // overlay UIScene on top of current scene
    super({ key: "UIScene", active: true });
  }

  public preload()
  {
    const option = { frameWidth: 32, frameHeight: 64 };
    this.load.spritesheet("assets/tileset/farming/plants.png", "assets/tileset/farming/plants.png", option);
    this.load.image("assets/ui/item.png", "assets/ui/item.png");
  }

  public create()
  {
    const items = new Items(this, this.cameras.main.centerX, this.cameras.main.height - 32);
    this.add.text(0, 0, "HP");
    this.add.rectangle(100, 0, 100, 30, 0x2ff7d6);
    this.add.text(50, 30, "100 / 100");

    this.add.text(300, 0, "SP");
    this.add.rectangle(400, 0, 100, 30, 0xf66f21);
    this.add.text(350, 30, "100 / 100");
  }

  public update()
  {

  }

}

export default UIScene;