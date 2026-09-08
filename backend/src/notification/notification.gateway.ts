import {WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<string, number>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.sub.toString();
      const isAdmin = payload.isAdmin === true;

      (client as any).user = { userId, isAdmin };

      client.join(`user_${userId}`);
      const count = this.onlineUsers.get(userId) || 0;
      this.onlineUsers.set(userId, count + 1);
      
      if (count === 0) {
        this.server.to('admin_room').emit('user_connected', { userId: parseInt(userId, 10) });
      }

      if (isAdmin) {
        client.join('admin_room');
        const usersArray = Array.from(this.onlineUsers.keys()).map(id => parseInt(id, 10));
        client.emit('online_users', { users: usersArray });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      client.disconnect();
    }
  }
  
  handleDisconnect(client: Socket) {
    const user = (client as any).user;
    if (user && user.userId) {
      const userId = user.userId;
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