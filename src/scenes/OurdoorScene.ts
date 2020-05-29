import CharacterAsset from '../assets/CharacterAsset';
import Phaser from 'phaser';
import NonPlayer from "../objects/NonPlayer";
import CharacterConfigBuilder from '../builder/CharacterConfigBuilder';
import CharacterConfigFactory from '../factory/CharacterConfigFactory';
import CropScene from './CropScene';

class OurdoorScene extends CropScene
{

  // npcs that wander around the scene
  private npcs?: Phaser.GameObjects.Group;

	constructor()
	{
    super("OutdoorScene", "assets/map/simple.json", 
      [
        "assets/tileset/outdoor/outdoor.png", 
        "assets/tileset/building-exterior/house.png", 
        "assets/tileset/farming/soil.png"
      ]);  
  }
  
	public preload()
	{
    super.preload(); 
    // load character assets if not loaded
    CharacterConfigFactory.getSingletonInstance().preloadCharacterSpritesheets(
      this.load, Object.keys(CharacterAsset).map(key => CharacterAsset[key]));
	}

	public create()
	{
    super.create();
    
    this.createNPCs();

    // add collision detection between npcs and collidable layer
    this.physics.add.collider(this.npcs!, this.middleLayer!);
    this.physics.add.collider(this.npcs!, this.bottomLayer!);

    // add collision detection between player and npcs
    this.physics.add.collider(this.player!, this.npcs!);
  }
  
  public update()
	{
    super.update();
    Phaser.Actions.Call(this.npcs!.getChildren(), (npc) => npc.update(), this);    
  }

  private createNPCs()
  {
    const npcConfig1 = new CharacterConfigBuilder()
      .setHairCharacterAsset(CharacterAsset.BlueBangsMaleHair)
      .setBodyCharacterAsset(CharacterAsset.LightMaleBody)
      .setTorsoCharacterAsset(CharacterAsset.WhiteMaleLongSleeve)
      .setLegsCharacterAsset(CharacterAsset.MagentaMalePants)
      .setFeetCharacterAsset(CharacterAsset.BlackMaleShoes)
      .setShadowCharacterAsset(CharacterAsset.Shadow)
      .setScene(this)
      .build();

    const npc1 = new NonPlayer(npcConfig1).setPosition(400, 400);

    const npcConfig2 = new CharacterConfigBuilder()
      .setHairCharacterAsset(CharacterAsset.BlackLongFemaleHair)
      .setBodyCharacterAsset(CharacterAsset.LightFemaleBody)
      .setTorsoCharacterAsset(CharacterAsset.WhiteFemaleWhitePirate)
      .setLegsCharacterAsset(CharacterAsset.FemaleSkirt)
      .setFeetCharacterAsset(CharacterAsset.BlackFemaleShoes)
      .setShadowCharacterAsset(CharacterAsset.Shadow)
      .setScene(this)
      .build();

    const npc2 = new NonPlayer(npcConfig2).setPosition(500, 400);

    const npcConfig3 = new CharacterConfigBuilder()
      .setHairCharacterAsset(CharacterAsset.BlondeBangslongFemaleHair)
      .setBodyCharacterAsset(CharacterAsset.LightFemaleBody)
      .setTorsoCharacterAsset(CharacterAsset.WhiteFemaleWhitePirate)
      .setLegsCharacterAsset(CharacterAsset.FemaleSkirt)
      .setFeetCharacterAsset(CharacterAsset.BlackFemaleShoes)
      .setShadowCharacterAsset(CharacterAsset.Shadow)
      .setScene(this)
      .build();

    const npc3 = new NonPlayer(npcConfig3).setPosition(500, 200);

    this.npcs = this.add.group([npc1, npc2, npc3]);

  }

}

export default OurdoorScene;