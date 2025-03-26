export class ChatMemberEntity {
  constructor(
    public readonly chatMemberId: string,
    public readonly chatId: string,
    public readonly userId: string,
    public readonly role: 'admin' | 'member',
    public readonly joinedAt: Date = new Date(),
  ) {}
}
