export interface MessageQueueService {
  publishMessage(message: any): Promise<void>;
  registerUserOnline(userId: string, callback: (message: any) => void): void;
  unregisterUser(userId: string): void;
  isUserRegistered(userId: string): boolean;
}
