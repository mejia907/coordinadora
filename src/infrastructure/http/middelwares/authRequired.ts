import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthService } from "@infrastructure/services/authService";
import { UserTokenEntity } from "@entitites/userTokenEntity";

interface CustomRequest extends Request {
  user?: any; 
}

export const authRequired = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Acceso denegado" });
    return; 
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next(); 
  } catch (error) {
    res.status(403).json({ message: "Token inválido" });
    return; 
  }
};
