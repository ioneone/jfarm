import Phaser from 'phaser';
import ItemBox from "./ItemBox";

class ItemBoxes
{

  private itemBoxes: ItemBox[];

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
  }

}

export default ItemBoxes;