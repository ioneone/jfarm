import Phaser from 'phaser';
import ItemBox from "./ItemBox";

class ItemBoxes
{

  private itemBoxes: ItemBox[];
  private marker: Phaser.GameObjects.Graphics;

  private key1: Phaser.Input.Keyboard.Key;
  private key2: Phaser.Input.Keyboard.Key;
  private key3: Phaser.Input.Keyboard.Key;
  private key4: Phaser.Input.Keyboard.Key;
  private key5: Phaser.Input.Keyboard.Key;
  private key6: Phaser.Input.Keyboard.Key;
  private key7: Phaser.Input.Keyboard.Key;
  private key8: Phaser.Input.Keyboard.Key;
  private key9: Phaser.Input.Keyboard.Key;
  private key0: Phaser.Input.Keyboard.Key;
  // private key3: Phaser.Input.Keyboard.Key;
  // private key4: Phaser.Input.Keyboard.Key;
  
  constructor(scene: Phaser.Scene, x: number, y: number)
  {
    this.itemBoxes = [];
    
    const startX = x - 32 * 6 + 16;
    const itemBox = new ItemBox(scene, startX, y, '1');
    this.itemBoxes.push(itemBox);
    
    this.itemBoxes.push(new ItemBox(scene, 1 * itemBox.box.width + startX, y, '2'));
    this.itemBoxes.push(new ItemBox(scene, 2 * itemBox.box.width + startX, y, '3'));
    this.itemBoxes.push(new ItemBox(scene, 3 * itemBox.box.width + startX, y, '4'));
    this.itemBoxes.push(new ItemBox(scene, 4 * itemBox.box.width + startX, y, '5'));
    this.itemBoxes.push(new ItemBox(scene, 5 * itemBox.box.width + startX, y, '6'));
    this.itemBoxes.push(new ItemBox(scene, 6 * itemBox.box.width + startX, y, '7'));
    this.itemBoxes.push(new ItemBox(scene, 7 * itemBox.box.width + startX, y, '8'));
    this.itemBoxes.push(new ItemBox(scene, 8 * itemBox.box.width + startX, y, '9'));
    this.itemBoxes.push(new ItemBox(scene, 9 * itemBox.box.width + startX, y, '0'));
    this.itemBoxes.push(new ItemBox(scene, 10 * itemBox.box.width + startX, y, '-'));
    this.itemBoxes.push(new ItemBox(scene, 11 * itemBox.box.width + startX, y, '='));

    this.marker = scene.add.graphics();
    this.marker.lineStyle(5, 0xffffff, 1);
    this.marker.strokeRect(0, 0, itemBox.box.width, itemBox.box.height);
    this.marker.lineStyle(3, 0xff4f78, 1);
    this.marker.strokeRect(0, 0, itemBox.box.width, itemBox.box.height);

    this.marker.setPosition(itemBox.box.getBounds().x, itemBox.box.getBounds().y);


    this.key1 = scene.input.keyboard.addKey("ONE");
    this.key2 = scene.input.keyboard.addKey('TWO');
    this.key3 = scene.input.keyboard.addKey('THREE');
    this.key4 = scene.input.keyboard.addKey('FOUR');
    this.key5 = scene.input.keyboard.addKey('FIVE');
    this.key6 = scene.input.keyboard.addKey('SIX');
    this.key7 = scene.input.keyboard.addKey('SEVEN');
    this.key8 = scene.input.keyboard.addKey('EIGHT');
    this.key9 = scene.input.keyboard.addKey('NINE');
    this.key0 = scene.input.keyboard.addKey('ZERO');
    // this.key- = this.scene.input.keyboard.addKey('0');
    // this.key= = this.scene.input.keyboard.addKey('d');
  }

  public update()
  {

    if (this.key1.isDown)
    {
      this.marker.setPosition(this.itemBoxes[0].box.getBounds().x, this.itemBoxes[0].box.getBounds().y);
    }
    else if (this.key2.isDown)
    {
      this.marker.setPosition(this.itemBoxes[1].box.getBounds().x, this.itemBoxes[1].box.getBounds().y);
    }
    else if (this.key3.isDown)
    {
      this.marker.setPosition(this.itemBoxes[2].box.getBounds().x, this.itemBoxes[2].box.getBounds().y);
    }
    else if (this.key4.isDown)
    {
      this.marker.setPosition(this.itemBoxes[3].box.getBounds().x, this.itemBoxes[3].box.getBounds().y);
    }
    else if (this.key5.isDown)
    {
      this.marker.setPosition(this.itemBoxes[4].box.getBounds().x, this.itemBoxes[4].box.getBounds().y);
    }
    else if (this.key6.isDown)
    {
      this.marker.setPosition(this.itemBoxes[5].box.getBounds().x, this.itemBoxes[5].box.getBounds().y);
    }
    else if (this.key7.isDown)
    {
      this.marker.setPosition(this.itemBoxes[6].box.getBounds().x, this.itemBoxes[6].box.getBounds().y);
    }
    else if (this.key8.isDown)
    {
      this.marker.setPosition(this.itemBoxes[7].box.getBounds().x, this.itemBoxes[7].box.getBounds().y);
    }
    else if (this.key9.isDown)
    {
      this.marker.setPosition(this.itemBoxes[8].box.getBounds().x, this.itemBoxes[8].box.getBounds().y);
    }
    else if (this.key0.isDown)
    {
      this.marker.setPosition(this.itemBoxes[9].box.getBounds().x, this.itemBoxes[9].box.getBounds().y);
    }

  }

}

export default ItemBoxes;