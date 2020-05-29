import GameScene from './GameScene';

class RoomScene extends GameScene
{

	constructor()
	{
    super("RoomScene", "assets/map/room.json", 
      [
        "assets/tileset/building-interior/building-interior.png",
        "assets/tileset/background/background.png"
      ]);
  }
  
	public preload()
	{
    super.preload();
	}

	public create()
	{
    super.create();

    this.cameras.main.setPosition(
      this.cameras.main.centerX - this.tilemap!.widthInPixels / 2,
      this.cameras.main.centerY - this.tilemap!.heightInPixels / 2
    );
  }
  
  public update()
	{
    super.update();
  }
  
}

export default RoomScene;