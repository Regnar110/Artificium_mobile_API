import { Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

type GatewayDefaultInterface = OnGatewayConnection & OnGatewayDisconnect;

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class SocketChatGateway implements GatewayDefaultInterface {
  handleConnection() {
    console.log('CHAT NAMESPACE CONECTION');
	
  }
  handleDisconnect() {
    console.log('CHAT NAMESPACE DISCONNECTED');
  }
  @WebSocketServer()
  private server: Socket;
  // Implement other Socket.IO event handlers and message handlers
}
