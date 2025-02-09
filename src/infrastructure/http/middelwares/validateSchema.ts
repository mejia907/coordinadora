import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'

/**
 * @param schema 
 * @description Middleware para validar el cuerpo de la petición
 */
export const validateSchema =
  (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction): void => {
      try {
        schema.parse(req.body)
        // Si todo está bien permite continuar la petición
        next()
      } catch (err) {
        if (err instanceof ZodError) {
          res.status(400).json({
            message: err.errors.map((error) => error.message),
          })
          return
        }

        res.status(500).json({
          message: "Error interno del servidor",
        })
        return
      }
    }
