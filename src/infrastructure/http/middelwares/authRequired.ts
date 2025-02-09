import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface CustomRequest extends Request {
  user?: any 
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
    const decodedJwt = jwt.verify(token, process.env.JWT_SECRET as string)
    req.user = decodedJwt
    next()
  } catch (error) {
    res.status(403).json({ message: "Token inválido" })
    return 
  }
}
