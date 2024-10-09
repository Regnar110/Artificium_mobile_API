import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatSocketEvents {
  async sendMessage(x) {
	console.log(x)
    console.log('Send message event');
    return 'msg';
  }
}
