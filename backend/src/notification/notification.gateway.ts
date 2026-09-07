import {WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})

export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<string, number>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    const isAdmin = client.handshake.query.isAdmin === 'true';
    
    if (userId) {
      client.join(`user_${userId}`);
      const count = this.onlineUsers.get(userId) || 0;
      this.onlineUsers.set(userId, count + 1);
      
      if (count === 0) {
        this.server.to('admin_room').emit('user_connected', { userId: parseInt(userId, 10) });
      }
    }

    if (isAdmin) {
      client.join('admin_room');
      const usersArray = Array.from(this.onlineUsers.keys()).map(id => parseInt(id, 10));
      client.emit('online_users', { users: usersArray });
    }
  }
  
  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      const count = this.onlineUsers.get(userId) || 0;
      if (count <= 1) {
        this.onlineUsers.delete(userId);
        this.server.to('admin_room').emit('user_disconnected', { userId: parseInt(userId, 10) });
      } else {
        this.onlineUsers.set(userId, count - 1);
      }
    }
  }
}