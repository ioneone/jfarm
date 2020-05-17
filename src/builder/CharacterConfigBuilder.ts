import CharacterConfigFactory from '../factory/CharacterConfigFactory';
import CharacterAsset from '../assets/CharacterAsset';
import CharacterConfig from '../configs/CharacterConfig';

class CharacterConfigBuilder {

  private scene?: Phaser.Scene;
  private hairCharacterAsset?: CharacterAsset;
  private bodyCharacterAsset?: CharacterAsset;
  private torsoCharacterAsset?: CharacterAsset;
  private legsCharacterAsset?: CharacterAsset;
  private feetCharacterAsset?: CharacterAsset;
  private shadowCharacterAsset?: CharacterAsset;

  public setHairCharacterAsset(hairCharacterAsset: CharacterAsset): CharacterConfigBuilder
  {
    this.hairCharacterAsset = hairCharacterAsset;
    return this;
  }

  public setBodyCharacterAsset(bodyCharacterAsset: CharacterAsset): CharacterConfigBuilder
  {
    this.bodyCharacterAsset = bodyCharacterAsset;
    return this;
  }

  public setTorsoCharacterAsset(torsoCharacterAsset: CharacterAsset): CharacterConfigBuilder
  {
    this.torsoCharacterAsset = torsoCharacterAsset;
    return this;
  }

  public setLegsCharacterAsset(legsCharacterAsset: CharacterAsset): CharacterConfigBuilder
  {
    this.legsCharacterAsset = legsCharacterAsset;
    return this;
  }

  public setFeetCharacterAsset(feetCharacterAsset: CharacterAsset): CharacterConfigBuilder
  {
    this.feetCharacterAsset = feetCharacterAsset;
    return this;
  }

  public setShadowCharacterAsset(shadowCharacterAsset: CharacterAsset): CharacterConfigBuilder
  {
    this.shadowCharacterAsset = shadowCharacterAsset;
    return this;
  }

  public setScene(scene: Phaser.Scene)
  {
    this.scene = scene;
    return this;
  }

  public build(): CharacterConfig
  {
    return CharacterConfigFactory.getSingletonInstance().createCharacterConfig(
      this.scene!,
      this.hairCharacterAsset!,
      this.bodyCharacterAsset!,
      this.torsoCharacterAsset!,
      this.legsCharacterAsset!,
      this.feetCharacterAsset!,
      this.shadowCharacterAsset!
    );
  }

}

export default CharacterConfigBuilder;