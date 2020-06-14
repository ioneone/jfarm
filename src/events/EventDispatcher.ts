import Phaser from 'phaser';

/**
 * Allows inter-communication between different scenes.
 * @class
 * @classdesc 
 * For example, the player object can fire a {@link Event#PlayerHpChange} event, 
 * and the UI scene can listen for this event and change the HP bar accordingly.
 * 
 * {@link EventDispatcher} is a singlenton class. You can get the instance from 
 * anywhere by `EventDispatcher.getInstance()`.
 * 
 * List of events can be found at {@link Event}.
 * 
 * @see {@link https://phasergames.com/phaser-3-dispatching-custom-events/}
 */
class EventDispatcher extends Phaser.Events.EventEmitter
{

  // the singeleton instance of this class
  private static singelton?: EventDispatcher;

  private constructor()
  {
    super();
  }

  /**
   * Get the singleton event dispatcher.
   * @return {EventDispatcher} - the singeleton event dispatcher
   */
  static getInstance(): EventDispatcher
  {
    if (!EventDispatcher.singelton)
    {
      EventDispatcher.singelton = new EventDispatcher();
    }
    return EventDispatcher.singelton;
  }
}

export default EventDispatcher;