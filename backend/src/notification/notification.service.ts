import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notification.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly gateway: NotificationsGateway) {}

  sendBalanceUpdate(userId: number, newBalance: number) {
    this.gateway.server
      .to(`user_${userId}`)
      .emit('balance_update', { newBalance });
      
    console.log(`Nouveau solde de ${newBalance}€ envoyé à l'utilisateur ${userId}`);
  }
}