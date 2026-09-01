import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsService {
  
  getBalance() {
    return { balance: 150.00 };
  }

  getHistory() {
    return [
      { id: 1, date: '2026-09-01T12:30:00Z', amount: -15.50, partnerName: 'Boulangerie Paul', type: 'debit' },
      { id: 2, date: '2026-08-31T19:00:00Z', amount: -32.00, partnerName: 'Bistrot du Coin', type: 'debit' },
      { id: 3, date: '2026-08-25T08:00:00Z', amount: 200.00, partnerName: 'Recharge Employeur', type: 'credit' }
    ];
  }

  getQrCode() {
    return { code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30' };
  }
}