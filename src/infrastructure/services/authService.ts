import jwt from 'jsonwebtoken';
import { envs } from "@config/envs";

export class AuthService {
  public static verifyToken(token: string): { user_id: number; role: string } | null {
    try {
      const decodedJwt = jwt.verify(token, envs.JWT_SECRET ?? "") as { user_id: number; role: string };
      return decodedJwt;
    } catch (error: Error | any) {
      throw new Error(`Error verificando el token: ${error.message}`);
    }
  }
}
