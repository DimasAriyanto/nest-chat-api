export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public readonly password: string,
    public readonly status: 'online' | 'offline' = 'offline',
    public readonly lastSeen?: Date,
  ) {}
}
