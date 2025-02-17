import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface CustomRequest extends Request {
  user?: { user_id: number };
}

/**
 * @param req
 * @param res 
 * @param next 
 * @description Middleware para verificar si el usuario esta autenticado  
 */
export const authRequired = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1]

  if (!token) {
    res.status(401).json({ message: "Acceso denegado, debe iniciar sesión" })
    return
  }

  try {
    // Verificar el token
    const decodedJwt = jwt.verify(token, process.env.JWT_SECRET as string) as { user_id: number };
    req.user = { user_id: decodedJwt.user_id };
    next()
  } catch (error) {
    res.status(403).json({ message: "Token inválido" })
    return
  }
}
