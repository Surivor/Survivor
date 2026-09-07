import {WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})

export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    
    if (userId) {
      client.join(`user_${userId}`);
      console.log(`Client connecté et ajouté à la room: user_${userId}`);
    }
  }
  
  handleDisconnect(client: Socket) {
    console.log(`Client déconnecté: ${client.id}`);
  }
}