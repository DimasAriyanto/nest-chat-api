export interface RefreshTokenRepository {
  saveToken(
    userId: string,
    refreshToken: string,
    expiresIn: number,
  ): Promise<void>;
  getToken(userId: string): Promise<string | null>;
  removeToken(userId: string): Promise<void>;
}
