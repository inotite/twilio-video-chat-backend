export class PayoutsDto {
  sender_batch_header: SenderBatchHeader;
  items: Item[] = [];
}

export class SenderBatchHeader {
  sender_batch_id : string;
  email_subject = 'You have a money in your account!';
  email_message = 'You have received a money from Join A Room! Thanks for using our service!';
}

export class Item {
  recipient_type = 'EMAIL';
  amount: Amount;
  note: 'Funds withdrawn successfully.!';
  sender_item_id: string;
  receiver: string;
  notification_language: 'en-EN';
}

export class Amount {
  value: number;
  currency: string;

  constructor(value: number, currency: string) {
    this.value = value;
    this.currency = currency;
  }
}

