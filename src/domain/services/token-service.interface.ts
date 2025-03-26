export interface TokenService {
  generateAccessToken(payload: Record<string, any>): string;
  generateRefreshToken(payload: Record<string, any>): string;
  verifyToken(token: string): Record<string, any>;
}
