import Phaser from 'phaser';

/**
 * EventDispatcher allows inter-communication between different scenes 
 * in the scene
 * 
 * For example, the player object can emit a 'PlayerHpChange' event, and
 * the UI scene can listen for this event and change the HP bar accordingly.
 * 
 * EventDispatcher is a singlenton class. You can get the instance from 
 * anywhere by EventDispatcher.getInstance().
 * 
 * Reference: https://phasergames.com/phaser-3-dispatching-custom-events/
 */
class EventDispatcher extends Phaser.Events.EventEmitter
{

  private static singelton?: EventDispatcher;

  private constructor()
  {
    super();
  }

  static getInstance()
  {
    if (!EventDispatcher.singelton)
    {
      EventDispatcher.singelton = new EventDispatcher();
    }
    return EventDispatcher.singelton;
  }
}

export default EventDispatcher;