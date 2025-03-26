export interface ConnectedClientsRepository {
  addClient(clientId: string, userId: string): Promise<void>;
  getClientIdByUserId(userId: string): Promise<string | null>;
  removeClient(clientId: string): Promise<void>;
  getUserIdByClientId(clientId: string): Promise<string | null>;
}
