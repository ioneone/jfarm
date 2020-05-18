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
  }

  public update()
  {

  }

}

export default UIScene;