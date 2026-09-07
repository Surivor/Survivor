import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notification.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly gateway: NotificationsGateway) {}

  sendBalanceUpdate(userId: number, newBalance: number, transaction?: any) {
    this.gateway.server
      .to(`user_${userId}`)
      .emit('balance_update', { newBalance, transaction });
  }

  sendNewUserRegistered(user: any) {
    this.gateway.server.to('admin_room').emit('new_user_registered', user);
  }
}