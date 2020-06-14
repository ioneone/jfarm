import io from 'socket.io-client';

/**
 * APIs for socket io. The connection persists through all the scenes. It is 
 * disconnected when the game is closed (i.e. the browser tab of this game is 
 * closed).
 */
class Connection
{

  // the singeleton instance of this class
  private static singelton?: Connection;

  public readonly socket: any;

  private constructor()
  {
    this.socket = io();
  }

  /**
   * Get the singleton connection.
   * @return {Connection} - the singeleton connection
   */
  public static getInstance(): Connection
  {
    if (!Connection.singelton)
    {
      Connection.singelton = new Connection();
    }
    return Connection.singelton;
  }
}

export default Connection;