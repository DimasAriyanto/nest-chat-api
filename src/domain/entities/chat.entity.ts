export class ChatEntity {
  constructor(
    public readonly chatId: string,
    public readonly isGroup: boolean,
    public readonly createdBy: string,
    public readonly createdAt: Date = new Date(),
  ) {}
}
