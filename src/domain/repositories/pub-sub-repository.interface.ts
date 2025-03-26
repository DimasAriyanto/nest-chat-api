export interface PubSubRepository {
  publishMessage(channel: string, message: any): Promise<void>;
  subscribeToMessages(
    channel: string,
    callback: (message: any) => void,
  ): Promise<void>;
}
