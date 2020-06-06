import Phaser from 'phaser';

/**
 * EventDispatcher allows inter-communication between different objects 
 * in the scene
 * 
 * For example, an enemy object can emit an 'attack' event and the player
 * can listen to this event.
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