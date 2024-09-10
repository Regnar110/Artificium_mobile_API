import { Injectable } from '@nestjs/common';

@Injectable()
export class FriendListSocketEvents {
  async getInvitation() {
    console.log('GET INVITATION EVENT HANDLED');
    return 'dupa2';
  }
}
