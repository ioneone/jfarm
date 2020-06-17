import { SceneTransitionData } from '../objects/SceneTransitionObject';
import { Events } from '../events/Events';
import EventDispatcher from '../events/EventDispatcher';
import LevelScene from '../scenes/LevelScene';
import BasecampScene from '../scenes/BasecampScene';
import AudioScene from '../scenes/AudioScene';
import UIScene from '../scenes/UIScene';
import GameStartScene from '../scenes/GameStartScene';
import GameOverScene from '~/scenes/GameOverScene';
import DialogScene from '~/scenes/DialogScene';

/**
 * Takes care of what scene to start. 
 * @class
 * @classdesc
 * Instead of letting the scene to figure out what scene to go next, the scene 
 * just needs to emit a scene transition event, then this class will take care 
 * of the rest.
 */
class SceneManager
{
  // the singeleton instance of this class
  private static singelton?: SceneManager;

  // a flag for avoiding initializing more than once
  private isInitialized: boolean;

  private constructor()
  {
    this.isInitialized = false;
  }

  /**
   * Get the singleton scene manager.
   * @return {EventDispatcher} - the singeleton event dispatcher
   */
  public static getInstance(): SceneManager
  {
    if (!SceneManager.singelton)
    {
      SceneManager.singelton = new SceneManager();
    }
    return SceneManager.singelton;
  }

  /**
   * Call this function to get ready to listen for scene transition events. 
   * This will be called in {@link PreloadScene#init}.
   * {@see Events.Event.PreloadComplete}
   * {@see Events.Event.StartGame}
   */
  public init(): void
  {
    // prevent from accidentally attaching the same listener twice
    if (this.isInitialized) return;

    EventDispatcher.getInstance().on(Events.Event.PreloadComplete, this.handlePreloadComplete, this);
    EventDispatcher.getInstance().on(Events.Event.StartGame, this.handleStartGame, this);
    EventDispatcher.getInstance().on(Events.Event.PlayerDies, this.handlePlayerDies, this);
    EventDispatcher.getInstance().on('playertalkstonpc', (data) => {
      const scene = data.scene;
      scene.scene.launch(DialogScene.KEY, { player: data.player, npc: data.npc });
      scene.scene.sleep(UIScene.KEY);
    });
    EventDispatcher.getInstance().on('dialogends', (data) => {
      const scene = data.scene as Phaser.Scene;
      scene.scene.stop(DialogScene.KEY);
      scene.scene.wake(UIScene.KEY);
    });
  }

  /**
   * Callback for handling {@link Events.Event#PreloadCompelte}. All the assets
   * are now loaded, so it's ready to start the game.
   * @param {Events.Data.PreloadComplete} data - the data associated with the event from the sender 
   */
  private handlePreloadComplete(data: Events.Data.PreloadComplete): void
  {
    const scene = data.scene;
    scene.scene.start(GameStartScene.KEY);
    scene.scene.start(AudioScene.KEY);
  }

  /**
   * Callback for handling {@link Events.Event#StartGame}. The player is leaving 
   * the {@link GameStartScene}.
   * @param {Events.Data.StartGame} data - the data associated with the event from the sender 
   */
  private handleStartGame(data: Events.Data.StartGame): void
  {
    const scene = data.scene;
    
    const levelSceneTranstionData: SceneTransitionData = {
      destinationScene: LevelScene.KEY,
      destinationX: 168,
      destinationY: 263,
      tilemapKey: "assets/map/level",
      tilesetKey: "assets/map/tiles"
    };

    const basecampSceneTransitionData: SceneTransitionData = {
      destinationScene: BasecampScene.KEY,
      destinationX: 168,
      destinationY: 263,
      tilemapKey: "assets/map/basecamp",
      tilesetKey: "assets/map/tiles"
    };

    // this.scene.start(LevelScene.KEY, levelSceneTranstionData);
    scene.scene.start(BasecampScene.KEY, basecampSceneTransitionData);
    scene.scene.start(UIScene.KEY);
  }

  private handlePlayerDies(data: Events.Data.PlayerDies)
  {
    const scene = data.scene;
    scene.scene.stop(UIScene.KEY);
    scene.scene.start(GameOverScene.KEY);
  }

}

export default SceneManager;