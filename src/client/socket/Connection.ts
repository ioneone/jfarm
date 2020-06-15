import { Event, EventData } from '../events/Event';
import io from 'socket.io-client';
import EventDispatcher from '../events/EventDispatcher';

/**
 * APIs for socket io. The connection persists through all the scenes. It is 
 * disconnected when the game is closed (i.e. the browser tab of this game is 
 * closed).
 */
class Connection
{

  // the singeleton instance of this class
  private static singelton?: Connection;

  public socket: SocketIOClient.Socket;

  private playersData?: {[key: string]: any};

  private constructor()
  {
    this.playersData = {};
    this.socket = io();

    this.socket.on(Event.VisitGame, (players) => {
      this.playersData = players as EventData.VisitGame
    });

    this.socket.on(Event.NewPlayer, (player) => {
      this.playersData![player.id] = player;
      EventDispatcher.getInstance().emit(Event.NewPlayer, player);
    });

    this.socket.on(Event.PlayerMoved, (player) => {
      this.playersData![player.id].x = player.x;
      this.playersData![player.id].y = player.y;
      this.playersData![player.id].flipX = player.flipX;
      this.playersData![player.id].frameName = player.frameName;
      EventDispatcher.getInstance().emit(Event.PlayerMoved, player);
    });

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

  public getSocket()
  {
    return this.socket;
  }

  public getPlayersData()
  {
    return this.playersData;
  }

}

export default Connection;