export class MessageStatusEntity {
  constructor(
    public readonly statusId: string,
    public readonly messageId: string,
    public readonly userId: string,
    public readonly status: 'sent' | 'delivered' | 'read',
    public readonly updatedAt: Date = new Date(),
  ) {}
}
