import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { GameStateDto } from './dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private gameRooms = new Map<string, Set<string>>();

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // 清理房間
    this.gameRooms.forEach((clients, gameId) => {
      if (clients.has(client.id)) {
        clients.delete(client.id);
        if (clients.size === 0) {
          this.gameRooms.delete(gameId);
        }
      }
    });
  }

  @SubscribeMessage('joinGame')
  async handleJoinGame(client: Socket, gameId: string) {
    // 加入房間
    if (!this.gameRooms.has(gameId)) {
      this.gameRooms.set(gameId, new Set());
    }
    this.gameRooms.get(gameId).add(client.id);
    client.join(gameId);

    try {
      const gameState = await this.gameService.getGameState(gameId);
      this.broadcastGameState(gameId, gameState);
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('leaveGame')
  handleLeaveGame(client: Socket, gameId: string) {
    // 離開房間
    if (this.gameRooms.has(gameId)) {
      this.gameRooms.get(gameId).delete(client.id);
      if (this.gameRooms.get(gameId).size === 0) {
        this.gameRooms.delete(gameId);
      }
    }
    client.leave(gameId);
  }

  // 廣播遊戲狀態給房間內的所有玩家
  broadcastGameState(gameId: string, gameState: GameStateDto) {
    this.server.to(gameId).emit('gameStateUpdate', gameState);
  }
}
