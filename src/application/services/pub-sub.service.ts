import { Injectable } from '@nestjs/common';
import { PubSubRepository } from 'src/domain/repositories/pub-sub-repository.interface';

@Injectable()
export class PubSubService {
  constructor(private readonly pubSubRepository: PubSubRepository) {}

  async publishMessage(channel: string, message: any): Promise<void> {
    await this.pubSubRepository.publishMessage(channel, message);
  }

  async subscribeToMessages(
    channel: string,
    callback: (message: any) => void,
  ): Promise<void> {
    await this.pubSubRepository.subscribeToMessages(channel, callback);
  }
}
