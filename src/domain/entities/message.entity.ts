export class MessageEntity {
  constructor(
    public readonly messageId: string,
    public readonly chatId: string,
    public readonly senderId: string,
    public readonly content: string,
    public readonly messageType: 'text' | 'image' | 'video' | 'file',
    public readonly attachmentUrl?: string,
    public readonly createdAt: Date = new Date(),
  ) {}
}
