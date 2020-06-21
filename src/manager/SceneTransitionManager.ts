import { DialogSceneData } from './../scenes/DialogScene';
import { SceneTransitionData } from '../objects/SceneTransitionObject';
import Events from '../events/Events';
import EventDispatcher from '../events/EventDispatcher';
import BasecampScene from '../scenes/BasecampScene';
import AudioScene from '../scenes/AudioScene';
import UIScene from '../scenes/UIScene';
import GameStartScene from '../scenes/GameStartScene';
import GameOverScene from '../scenes/GameOverScene';
import DialogScene from '../scenes/DialogScene';
import CombatScene from '../scenes/CombatScene';
import PlatformerScene from '~/scenes/PlatformerScene';

/**
 * Takes care of transitioning from one scene to another.
 * @class
 * @classdesc
 * Some scene transitions involve more than just starting a scene. For example,
 * to start a dialog scene, we need to put the UI scene into sleep, and wake it 
 * up when the dialog scene ends.
 */
class SceneTransitionManager
{
  // the singeleton instance of this class
  private static singelton?: SceneTransitionManager;

  // a flag to prevent the manager from being initialized twice
  private initialized: boolean;

  private constructor()
  {
    this.initialized = false;
  }

  /**
   * Get the singleton scene transition manager.
   * @return {SceneTransitionManager} - the singeleton event dispatcher
   */
  public static getInstance(): SceneTransitionManager
  {
    if (!SceneTransitionManager.singelton)
    {
      SceneTransitionManager.singelton = new SceneTransitionManager();
    }
    return SceneTransitionManager.singelton;
  }

  /**
   * Start listening for scene transition related events. Call this method when 
   * the game starts in {@link PreloadScene#init}.
   */
  public init(): void
  {
    if (this.initialized) return;

    EventDispatcher.getInstance().on(Events.Event.PreloadComplete, this.handlePreloadComplete, this);
    EventDispatcher.getInstance().on(Events.Event.StartGame, this.handleStartGame, this);
    EventDispatcher.getInstance().on(Events.Event.PlayerDies, this.handlePlayerDies, this);
    EventDispatcher.getInstance().on(Events.Event.PlayerTalksToNPC, this.handlePlayerTalksToNPC, this);
    EventDispatcher.getInstance().on(Events.Event.DialogEnds, this.handleDialogEnds, this);

    this.initialized = true;
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
    // the audio scene will live for the life time of the game
    scene.scene.start(AudioScene.KEY);
  }

  /**
   * Callback for handling {@link Events.Event#StartGame}. The player is leaving 
   * the {@link GameStartScene} or {@link GameOverScene}.
   * @param {Events.Data.StartGame} data - the data associated with the event from the sender 
   */
  private handleStartGame(data: Events.Data.StartGame): void
  {
    const scene = data.scene;
    // const basecampSceneTransitionData: SceneTransitionData = {
    //   destinationScene: BasecampScene.KEY,
    //   destinationX: 168,
    //   destinationY: 263,
    //   tilemapKey: "assets/map/basecamp",
    //   tilesetKey: "assets/map/basecamp"
    // };

    // scene.scene.start(BasecampScene.KEY, basecampSceneTransitionData);
    scene.scene.start(UIScene.KEY);
    const platformerSceneTransitionData: SceneTransitionData = {
      destinationScene: PlatformerScene.KEY,
      destinationX: 168,
      destinationY: 263,
      tilemapKey: "assets/map/platform",
      tilesetKey: "assets/map/tileset"
    };
    scene.scene.start(PlatformerScene.KEY, platformerSceneTransitionData);
  }

  /**
   * Callback for handling {@link Events.Event#PlayerDies}.
   * @param {Events.Data.PlayerDies} data - the data associated with the event from the sender 
   */
  private handlePlayerDies(data: Events.Data.PlayerDies)
  {
    const scene = data.scene;
    scene.scene.stop(UIScene.KEY);
    scene.scene.start(GameOverScene.KEY);
  }

  /**
   * Callback for handling {@link Events.Event#PlayerTalksToNPC}.
   * @param {Events.Data.PlayerTalksToNPC} data - the data associated with the event from the sender 
   */
  private handlePlayerTalksToNPC(data: Events.Data.PlayerTalksToNPC)
  {
    const scene = data.scene;
    const dialogSceneData: DialogSceneData = {
      player: data.player, 
      npc: data.npc
    };
    scene.scene.launch(DialogScene.KEY, dialogSceneData);
    scene.scene.sleep(UIScene.KEY);
  }

  /**
   * Callback for handling {@link Events.Event#DialogEnds}.
   * @param {Events.Data.DialogEnds} data - the data associated with the event from the sender 
   */
  private handleDialogEnds(data: Events.Data.DialogEnds)
  {
    const scene = data.scene as Phaser.Scene;
    scene.scene.stop(DialogScene.KEY);
    scene.scene.wake(UIScene.KEY);
  }

}

export default SceneTransitionManager;