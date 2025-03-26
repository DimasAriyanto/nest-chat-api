export interface SessionRepository {
  createSession(userId: string, data: any, ttlSeconds?: number): Promise<void>;
  getSession(userId: string): Promise<any | null>;
  removeSession(userId: string): Promise<void>;
}
